<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\Submission;
use App\Models\QuizAttempt;
use App\Models\LeaderboardScore;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
   public function export(Request $request)
    {
        $type   = $request->query('type', 'students');
        $format = $request->query('format', 'csv');
        $from   = $request->query('from');
        $to     = $request->query('to');

        $data = match($type) {
            'students'    => $this->getStudentsData($from, $to),
            'projects'    => $this->getProjectsData($from, $to),
            'submissions' => $this->getSubmissionsData($from, $to),
            'quizzes'     => $this->getQuizzesData($from, $to),
            'leaderboard' => $this->getLeaderboardData(),
            'analytics'   => $this->getAnalyticsData(),
            default       => [],
        };

        if ($format === 'csv') {
            return $this->exportCsv($data, $type);
        }

        $pdf = Pdf::loadView('reports.export', ['data' => $data, 'type' => $type])
            ->setPaper('a4', 'landscape');

        return $pdf->download("skillbridge-{$type}-".now()->format('Y-m-d').".pdf");
    
    }

    public function stats()
    {
        return response()->json([
            'total_students'      => User::where('role', 'student')->count(),
            'total_projects'      => Project::count(),
            'total_submissions'   => Submission::count(),
            'approved_submissions'=> Submission::where('status', 'approved')->count(),
            'approval_rate'       => Submission::count() > 0
                ? round((Submission::where('status', 'approved')->count() / Submission::count()) * 100)
                : 0,
        ]);
    }

    private function getStudentsData($from, $to)
    {
        return User::where('role', 'student')
            ->with('leaderboardScore')
            ->withCount('submissions', 'applications')
            ->when($from, fn($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to,   fn($q) => $q->whereDate('created_at', '<=', $to))
            ->get()
            ->map(fn($u) => [
                'Name'             => $u->name,
                'Email'            => $u->email,
                'Skill Points'     => $u->skill_points,
                'Rank'             => $u->leaderboardScore?->rank ?? '—',
                'Submissions'      => $u->submissions_count,
                'Applications'     => $u->applications_count,
                'Joined'           => $u->created_at->format('Y-m-d'),
            ]);
    }

    private function getProjectsData($from, $to)
    {
        return Project::with('category')
            ->withCount('applications', 'submissions')
            ->when($from, fn($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to,   fn($q) => $q->whereDate('created_at', '<=', $to))
            ->get()
            ->map(fn($p) => [
                'Title'       => $p->title,
                'Category'    => $p->category?->name,
                'Level'       => $p->level,
                'Status'      => $p->status,
                'Deadline'    => $p->deadline?->format('Y-m-d'),
                'Max Students'=> $p->max_students,
                'Applications'=> $p->applications_count,
                'Submissions' => $p->submissions_count,
            ]);
    }

    private function getSubmissionsData($from, $to)
    {
        return Submission::with(['student', 'project'])
            ->when($from, fn($q) => $q->whereDate('submitted_at', '>=', $from))
            ->when($to,   fn($q) => $q->whereDate('submitted_at', '<=', $to))
            ->get()
            ->map(fn($s) => [
                'Student'     => $s->student?->name,
                'Email'       => $s->student?->email,
                'Project'     => $s->project?->title,
                'Status'      => $s->status,
                'Score'       => $s->admin_score ?? '—',
                'GitHub URL'  => $s->github_url,
                'Submitted At'=> $s->submitted_at?->format('Y-m-d'),
            ]);
    }

    private function getQuizzesData($from, $to)
    {
        return QuizAttempt::with(['student', 'quiz.project'])
            ->when($from, fn($q) => $q->whereDate('attempted_at', '>=', $from))
            ->when($to,   fn($q) => $q->whereDate('attempted_at', '<=', $to))
            ->get()
            ->map(fn($a) => [
                'Student'    => $a->student?->name,
                'Project'    => $a->quiz?->project?->title,
                'Score'      => $a->score,
                'Passed'     => $a->passed ? 'Yes' : 'No',
                'Attempted At'=> $a->attempted_at?->format('Y-m-d'),
            ]);
    }

    private function getLeaderboardData()
    {
        return LeaderboardScore::with('student')
            ->orderByDesc('total_points')
            ->get()
            ->map(fn($s, $i) => [
                'Rank'               => $i + 1,
                'Name'               => $s->student?->name,
                'Email'              => $s->student?->email,
                'Total Points'       => $s->total_points,
                'Projects Completed' => $s->projects_completed,
            ]);
    }

    private function getAnalyticsData()
    {
        return collect([
            [
                'Metric'  => 'Total Students',
                'Value'   => User::where('role', 'student')->count(),
            ],
            [
                'Metric'  => 'Total Projects',
                'Value'   => Project::count(),
            ],
            [
                'Metric'  => 'Open Projects',
                'Value'   => Project::where('status', 'open')->count(),
            ],
            [
                'Metric'  => 'Total Submissions',
                'Value'   => Submission::count(),
            ],
            [
                'Metric'  => 'Approved Submissions',
                'Value'   => Submission::where('status', 'approved')->count(),
            ],
            [
                'Metric'  => 'Approval Rate %',
                'Value'   => Submission::count() > 0
                    ? round((Submission::where('status','approved')->count() / Submission::count()) * 100).'%'
                    : '0%',
            ],
            [
                'Metric'  => 'Total Quiz Attempts',
                'Value'   => QuizAttempt::count(),
            ],
            [
                'Metric'  => 'Quiz Pass Rate %',
                'Value'   => QuizAttempt::count() > 0
                    ? round((QuizAttempt::where('passed',true)->count() / QuizAttempt::count()) * 100).'%'
                    : '0%',
            ],
        ]);
    }

    private function exportCsv($data, $type)
    {
        if ($data->isEmpty()) {
            return response('No data available.', 200)->header('Content-Type', 'text/csv');
        }

        $headers  = array_keys($data->first());
        $filename = "skillbridge-{$type}-".now()->format('Y-m-d').".csv";

        $csv = implode(',', $headers)."\n";
        foreach ($data as $row) {
            $csv .= implode(',', array_map(
                fn($val) => '"'.str_replace('"', '""', $val ?? '').'"',
                array_values($row)
            ))."\n";
        }
        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

}