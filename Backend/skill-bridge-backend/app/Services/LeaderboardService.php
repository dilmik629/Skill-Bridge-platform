<?php
namespace App\Services;

use App\Models\LeaderboardScore;
use App\Models\Submission;
use App\Models\User;

class LeaderboardService
{
    // Leaderboard ranks recalculate + peer bonus include
    public function recalculateRanks(): void
    {
        $scores = LeaderboardScore::orderByDesc('total_points')
            ->orderByDesc('projects_completed')
            ->get();

        foreach ($scores as $i => $score) {
            $score->update(['rank' => $i + 1]);
        }
    }

    // Student total points recalculate (admin score + peer bonus)
    public function recalculateStudentPoints(int $studentId): void
    {
        $approvedSubmissions = Submission::where('student_id', $studentId)
            ->where('status', 'approved')
            ->with('peerReviews')
            ->get();

        $totalPoints = 0;
        $projectsDone = $approvedSubmissions->count();

        foreach ($approvedSubmissions as $submission) {
            // Admin score (max 100)
            $adminScore = $submission->admin_score ?? 0;

            // Peer review bonus (avg rating * 10, max 50 bonus)
            $peerAvg    = $submission->peerReviews->avg('rating') ?? 0;
            $peerBonus  = min(round($peerAvg * 10), 50);

            $totalPoints += $adminScore + $peerBonus;
        }

        LeaderboardScore::updateOrCreate(
            ['student_id' => $studentId],
            [
                'total_points'       => $totalPoints,
                'projects_completed' => $projectsDone,
            ]
        );

        User::where('id', $studentId)->update(['skill_points' => $totalPoints]);

        // Keep every student's rank in sync immediately, instead of relying
        // on someone opening the public /leaderboard page to trigger it.
        // Dashboard, Admin Reports and the Portfolio PDF all read the stored
        // rank directly, so it must never be left stale.
        $this->recalculateRanks();
    }
}