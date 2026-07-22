<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\Feedback;
use App\Models\LeaderboardScore;
use App\Models\Notification;
use Illuminate\Http\Request;

use App\Services\LeaderboardService;

class SubmissionController extends Controller {

    public function __construct(protected LeaderboardService $leaderboardService) {}

    public function index(Request $request) {
        $submissions = Submission::with(['student','project.category','feedback'])
            ->when($request->status, fn($q,$v) => $q->where('status',$v))
            ->when($request->search, fn($q,$v) => $q->whereHas('student', fn($sq) =>
                $sq->where('name','like',"%$v%")))
            ->latest('submitted_at')->paginate(15);

        return response()->json($submissions);
    }

    public function show(Submission $submission) {
        return response()->json(
            $submission->load(['student','project.category','feedback.admin'])
        );
    }

    public function review(Request $request, Submission $submission) {
        $data = $request->validate([
            'admin_score' => 'required|integer|min:0|max:100',
            'comment'     => 'required|string',
            'rating'      => 'nullable|integer|min:1|max:5',
            'action'      => 'required|in:approve,reject',
        ]);

        $status = $data['action'] === 'approve' ? 'approved' : 'rejected';

        $submission->update([
            'admin_score' => $data['admin_score'],
            'status'      => $status,
        ]);


        Feedback::updateOrCreate(
            ['submission_id' => $submission->id],
            [
                'admin_id' => $request->user()->id,
                'comment'  => $data['comment'],
                'rating'   => $data['rating'] ?? null,
            ]
        );

        $this->leaderboardService->recalculateStudentPoints($submission->student_id);

        Notification::create([
            'user_id' => $submission->student_id,
            'type'    => $status === 'approved' ? 'project_approved' : 'project_rejected',
            'title'   => $status === 'approved' ? '🎉 Project Approved!' : '❌ Project Rejected',
            'message' => $status === 'approved'
                ? "Your submission for '{$submission->project->title}' was approved! Score: {$data['admin_score']}/100"
                : "Your submission for '{$submission->project->title}' was rejected. Check the feedback.",
        ]);

        return response()->json(['message' => "Submission {$status}.", 'submission' => $submission->fresh('feedback')]);
    }
}