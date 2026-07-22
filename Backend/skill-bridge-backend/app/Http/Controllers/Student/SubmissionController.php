<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\Project;
use App\Models\ProjectApplication;
use App\Models\Notification;
use Illuminate\Http\Request;

class SubmissionController extends Controller {

    // GET /api/my/submissions
    //
    // Returns the student's submissions AND their approved applications that
    // haven't been submitted yet — the latter are surfaced as synthetic
    // 'in_progress' entries so they actually show up on the My Projects page
    // (the frontend's "Active" tab / progress bar / Submit button already
    // expect a status of 'in_progress', but nothing used to produce it).
    public function index(Request $request) {
        $studentId = $request->user()->id;

        $submissions = Submission::where('student_id', $studentId)
            ->with(['project.category', 'feedback'])
            ->get();

        $submittedProjectIds = $submissions->pluck('project_id');

        $inProgress = ProjectApplication::where('student_id', $studentId)
            ->where('status', 'approved')
            ->whereNotIn('project_id', $submittedProjectIds)
            ->with('project.category')
            ->get()
            ->map(fn($app) => [
                'id'           => "app-{$app->id}",
                'project_id'   => $app->project_id,
                'project'      => $app->project,
                'status'       => 'in_progress',
                'github_url'   => null,
                'notes'        => null,
                'admin_score'  => null,
                'feedback'     => null,
                'submitted_at' => null,
                'applied_at'   => $app->applied_at,
            ]);

        $all = $submissions->concat($inProgress)
            ->sortByDesc(fn($item) => is_array($item)
                ? ($item['applied_at'] ?? $item['submitted_at'])
                : $item->submitted_at)
            ->values();

        return response()->json($all);
    }

    // POST /api/my/submit/{projectId}
    public function store(Request $request, $projectId) {
        $project = Project::findOrFail($projectId);
        $student = $request->user();

        $data = $request->validate([
            'github_url' => 'required|url',
            'notes'      => 'nullable|string|max:500',
            'file'       => 'nullable|file|mimes:zip,rar,pdf,doc,docx,png,jpg,jpeg|max:10240', // 10MB max
        ]);

        // Check already submitted
        if (Submission::where('project_id',$projectId)->where('student_id',$student->id)->exists()) {
            return response()->json(['message' => 'Already submitted for this project.'], 409);
        }

        $filePath = null;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('submissions', 'public');
            $filePath = \Illuminate\Support\Facades\Storage::disk('public')->url($path);
        }

        $submission = Submission::create([
            'project_id' => $projectId,
            'student_id' => $student->id,
            'github_url' => $data['github_url'],
            'file_path'  => $filePath,
            'notes'      => $data['notes'] ?? null,
            'status'     => 'submitted',
        ]);

        // Notify all admins
        $admins = \App\Models\User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type'    => 'new_submission',
                'title'   => '📤 New Submission',
                'message' => "{$student->name} submitted work for '{$project->title}'. Ready for review.",
            ]);
        }

        return response()->json([
            'message'    => 'Project submitted successfully!',
            'submission' => $submission->load('project'),
        ], 201);
    }
}