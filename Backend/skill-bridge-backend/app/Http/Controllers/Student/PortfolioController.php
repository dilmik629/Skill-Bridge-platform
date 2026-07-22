<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class PortfolioController extends Controller {


    public function index(Request $request)
    {
        $student = $request->user();

        $completedProjects = Submission::where('student_id', $student->id)
            ->where('status', 'approved')
            ->with(['project.category', 'feedback'])
            ->get();

        $skills = QuizAttempt::where('student_id', $student->id)
            ->where('passed', true)
            ->with('quiz.project.category')
            ->get()

            ->filter(fn($attempt) => $attempt->quiz?->project?->category)
            ->groupBy(fn($attempt) => $attempt->quiz->project->category->name)
            ->map(fn($attempts) => [
                'category' => $attempts->first()->quiz->project->category->name,
                'avg_score'=> round($attempts->avg('score')),
                'count'    => $attempts->count(),
            ])->values();

        return response()->json([
            'student' => $student,
            'completed_projects' => $completedProjects,
            'skills'  => $skills,
            'stats'   => [
                'projects_done' => $completedProjects->count(),
                'skill_points'  => $student->skill_points,
                'rank'          => $student->leaderboardScore?->rank,
            ],
        ]);
    }


    public function exportPdf(Request $request)
    {
        $student = $request->user();

        $completedProjects = Submission::where('student_id', $student->id)
            ->where('status', 'approved')
            ->with(['project.category', 'feedback'])
            ->get();

        $skills = QuizAttempt::where('student_id', $student->id)
            ->where('passed', true)
            ->with('quiz.project.category')
            ->get()
            ->filter(fn($attempt) => $attempt->quiz?->project?->category)
            ->groupBy(fn($attempt) => $attempt->quiz->project->category->name)
            ->map(fn($attempts) => [
                'category' => $attempts->first()->quiz->project->category->name,
                'avg_score'=> round($attempts->avg('score')),
            ])->values();

        $pdf = Pdf::loadView('portfolio.pdf', [
            'student'            => $student,
            'completed_projects' => $completedProjects,
            'skills'             => $skills,
            'stats' => [
                'projects_done' => $completedProjects->count(),
                'skill_points'  => $student->skill_points,
                'rank'          => $student->leaderboardScore?->rank,
            ],
        ]);

        return $pdf->download("skillbridge-portfolio-{$student->name}.pdf");
    }
}