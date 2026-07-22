<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\LeaderboardScore;
use App\Services\LeaderboardService;
use Illuminate\Http\Request;

class LeaderboardController extends Controller {

    public function __construct(private LeaderboardService $leaderboardService) {}

    public function index(Request $request) {

        $this->leaderboardService->recalculateRanks();

        $leaderboard = LeaderboardScore::with('student')
            ->orderByDesc('total_points')
            ->take(50)->get()
            ->map(fn($entry, $i) => [
                'rank'               => $i + 1,
                'student'            => $entry->student,
                'total_points'       => $entry->total_points,
                'projects_completed' => $entry->projects_completed,
                'is_me'              => $entry->student_id === $request->user()?->id,
            ]);

        return response()->json($leaderboard);
    }
}