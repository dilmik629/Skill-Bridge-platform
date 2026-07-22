<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\PeerReview;
use App\Models\LeaderboardScore;
use App\Models\Notification;
use Illuminate\Http\Request;

use App\Services\LeaderboardService;

class PeerReviewController extends Controller
{
    public function __construct(protected LeaderboardService $leaderboardService) {}

    // GET /api/submissions/approved
    // Public — approved submissions list (everyone can see)
    public function index(Request $request)
    {
        $submissions = Submission::where('status', 'approved')
            ->with([
                'student:id,name,avatar,github_username,skill_points',
                'project:id,title,level,tech_stack,category_id',
                'project.category:id,name,icon',
                'peerReviews.reviewer:id,name',
            ])
            ->withCount('peerReviews')
            ->withAvg('peerReviews', 'rating')
            ->when($request->search, fn($q,$v) =>
                $q->whereHas('project', fn($pq) => $pq->where('title','like',"%$v%"))
            )
            ->when($request->level, fn($q,$v) =>
                $q->whereHas('project', fn($pq) => $pq->where('level',$v))
            )
            ->latest()->paginate(12);

        return response()->json($submissions);
    }

    // GET /api/submissions/{id}/public
    // Single submission detail with peer reviews
    public function show(Submission $submission)
    {
        if ($submission->status !== 'approved') {
            return response()->json(['message' => 'Not available.'], 403);
        }

        return response()->json(
            $submission->load([
                'student:id,name,avatar,github_username,skill_points',
                'project.category',
                'feedback',
                'peerReviews.reviewer:id,name',
            ])->loadAvg('peerReviews', 'rating')->loadCount('peerReviews')
        );
    }

    // POST /api/submissions/{id}/review
    // Auth required — student reviews a peer submission
    public function store(Request $request, Submission $submission)
    {
        $reviewer = $request->user();

        // Own submission review කරන්ට බෑ
        if ($submission->student_id === $reviewer->id) {
            return response()->json(['message' => 'You cannot review your own submission.'], 422);
        }

        // Only approved submissions review කරන්ට
        if ($submission->status !== 'approved') {
            return response()->json(['message' => 'Only approved submissions can be reviewed.'], 422);
        }

        $data = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        // Update or create review
        $review = PeerReview::updateOrCreate(
            [
                'submission_id' => $submission->id,
                'reviewer_id'   => $reviewer->id,
            ],
            $data
        );

        // Recalculate leaderboard score and user skill points dynamically
        $this->leaderboardService->recalculateStudentPoints($submission->student_id);

        // Notify submission owner
        Notification::create([
            'user_id' => $submission->student_id,
            'type'    => 'peer_review',
            'title'   => '⭐ New Peer Review!',
            'message' => "{$reviewer->name} gave your '{$submission->project->title}' submission {$data['rating']} star(s)."
                        .($data['comment'] ? " Comment: \"{$data['comment']}\"" : ''),
            'data'    => ['submission_id' => $submission->id, 'rating' => $data['rating']],
        ]);

        return response()->json([
            'message' => 'Review submitted! ⭐',
            'review'  => $review->load('reviewer:id,name'),
        ], 201);
    }

    public function destroy(Request $request, Submission $submission)
    {
        $deleted = PeerReview::where('submission_id', $submission->id)
            ->where('reviewer_id', $request->user()->id)
            ->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Review not found.'], 404);
        }

        // Recalculate leaderboard score and user skill points dynamically
        $this->leaderboardService->recalculateStudentPoints($submission->student_id);

        return response()->json(['message' => 'Review removed.']);
    }
}