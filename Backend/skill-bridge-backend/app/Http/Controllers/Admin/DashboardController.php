<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\Submission;
use App\Models\QuizAttempt;

class DashboardController extends Controller {

    public function index() {
        return response()->json([
            'stats' => [
                'total_students'   => User::where('role','student')->count(),
                'active_projects'  => Project::where('status','open')->count(),
                'pending_submissions' => Submission::where('status','submitted')->count(),
                'approved_today'   => Submission::where('status','approved')
                    ->whereDate('updated_at', today())->count(),
            ],
            'recent_submissions' => Submission::with(['student','project'])
                ->where('status','submitted')
                ->latest('submitted_at')->take(5)->get(),
            'top_students' => User::where('role','student')
                ->with('leaderboardScore')
                ->orderByDesc('skill_points')
                ->take(5)->get(),
        ]);
    }
}