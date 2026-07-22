<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\ProjectApplication;
use Illuminate\Http\Request;

class DashboardController extends Controller {

    public function index(Request $request) {
        $student = $request->user();

        return response()->json([
            'stats' => [
                'active_projects'    => ProjectApplication::where('student_id',$student->id)
                    ->where('status','approved')->count(),
                'completed_projects' => Submission::where('student_id',$student->id)
                    ->where('status','approved')->count(),
                'skill_points'       => $student->skill_points,
                'rank'               => $student->leaderboardScore?->rank,
            ],
            'active_projects' => ProjectApplication::where('student_id',$student->id)
                ->where('status','approved')
                ->with(['project.category'])
                ->latest()->take(5)->get(),
            'recent_submissions' => Submission::where('student_id',$student->id)
                ->with(['project','feedback'])
                ->latest('submitted_at')->take(3)->get(),
        ]);
    }
}