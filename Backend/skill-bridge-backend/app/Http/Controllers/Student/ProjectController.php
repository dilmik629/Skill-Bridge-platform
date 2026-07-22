<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectApplication;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;

class ProjectController extends Controller {

    // GET /api/projects (public)
    public function index(Request $request) {
        $projects = Project::with('category')
            ->where('status','open')
            ->when($request->level,       fn($q,$v) => $q->where('level',$v))
            ->when($request->category_id, fn($q,$v) => $q->where('category_id',$v))
            ->when($request->search,      fn($q,$v) => $q->where('title','like',"%$v%"))
            ->withCount(['applications as approved_count' => fn($q) => $q->where('status','approved')])
            ->latest()->paginate(12);

        return response()->json($projects);
    }

    // GET /api/projects/{id} (public — but returns extra info if authenticated)
    public function show(Request $request, Project $project) {
        $project->load(['category','quiz' => fn($q) => $q->withCount('questions')]);

        // If the request carries a valid Sanctum token, tell the frontend
        // whether this student has already applied/passed for this project,
        // so it doesn't send them through the quiz a second time.
        //
        // This route is intentionally public (no auth:sanctum middleware),
        // so guard resolution is wrapped defensively — if anything about
        // the auth setup misbehaves here, we just treat the request as
        // unauthenticated instead of failing the whole page with a 500.
        $student = null;
        try {
            $student = $request->user('sanctum') ?: $request->user();
        } catch (\Throwable $e) {
            $student = null;
        }

        $project->application_status = $student
            ? ProjectApplication::where('project_id', $project->id)
                ->where('student_id', $student->id)
                ->value('status')
            : null;

        return response()->json($project);
    }

    // POST /api/projects/{id}/apply (student)
    public function apply(Request $request, Project $project) {
        $student = $request->user();

        // Check already applied
        if (ProjectApplication::where('project_id',$project->id)->where('student_id',$student->id)->exists()) {
            return response()->json(['message' => 'Already applied for this project.'], 409);
        }

        // Check project is open
        if ($project->status !== 'open') {
            return response()->json(['message' => 'This project is not accepting applications.'], 422);
        }

        // Check project full
        if ($project->isFull()) {
            return response()->json(['message' => 'This project is full.'], 422);
        }

        // Check quiz passed
        if ($project->quiz) {
            $passed = QuizAttempt::where('quiz_id', $project->quiz->id)
                ->where('student_id', $student->id)
                ->where('passed', true)->exists();

            if (!$passed) {
                return response()->json(['message' => 'You must pass the quiz before applying.'], 422);
            }
        }

        $application = ProjectApplication::create([
            'project_id' => $project->id,
            'student_id' => $student->id,
            'status'     => 'approved', // auto-approve after quiz pass
        ]);

        return response()->json(['message' => 'Application approved! Start working on your project.', 'application' => $application], 201);
    }
}