<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Notification;
use App\Models\ProjectApplication;
use Illuminate\Http\Request;
use Carbon\Carbon;

class QuizController extends Controller {

    // GET /api/quizzes/{projectId}
    public function show(Request $request, $projectId) {
        $quiz = Quiz::where('project_id', $projectId)
            ->with(['questions', 'project']) // correct_option hidden
            ->firstOrFail();

        // Already approved for this project (quiz passed before) — no need
        // to retake it. Send the frontend a clear signal instead of the quiz.
        $alreadyApproved = ProjectApplication::where('project_id', $projectId)
            ->where('student_id', $request->user()->id)
            ->where('status', 'approved')
            ->exists();

        if ($alreadyApproved) {
            return response()->json([
                'message'         => "You've already been approved for this project — no need to retake the quiz.",
                'already_applied' => true,
            ], 409);
        }

        // Check cooldown
        $lastAttempt = QuizAttempt::where('quiz_id', $quiz->id)
            ->where('student_id', $request->user()->id)
            ->latest('attempted_at')->first();

        if ($lastAttempt && !$lastAttempt->passed) {
            $canRetakeAt = Carbon::parse($lastAttempt->attempted_at)
                ->addHours($quiz->retake_cooldown_hours);

            if (now()->lt($canRetakeAt)) {
                return response()->json([
                    'message'      => 'You must wait before retaking.',
                    'can_retake_at'=> $canRetakeAt->toISOString(),
                ], 429);
            }
        }

        return response()->json($quiz);
    }

    // POST /api/quizzes/{id}/submit
    public function submit(Request $request, Quiz $quiz) {
        $data = $request->validate([
            'answers' => 'required|array',  // { question_id: 'a', ... }
        ]);

        $questions     = $quiz->questions()->withoutGlobalScopes()->get()->makeVisible(['correct_option']);
        $correct       = 0;
        $totalQ        = $questions->count();

        foreach ($questions as $q) {
            if (($data['answers'][$q->id] ?? null) === $q->correct_option) {
                $correct++;
            }
        }

        $score  = $totalQ > 0 ? round(($correct / $totalQ) * 100) : 0;
        $passed = $score >= $quiz->pass_mark;

        $attempt = QuizAttempt::create([
            'quiz_id'      => $quiz->id,
            'student_id'   => $request->user()->id,
            'score'        => $score,
            'passed'       => $passed,
            'answers'      => $data['answers'],
            'attempted_at' => now(),
        ]);

        // Notify student
        Notification::create([
            'user_id' => $request->user()->id,
            'type'    => $passed ? 'quiz_passed' : 'quiz_failed',
            'title'   => $passed ? '🎉 Quiz Passed!' : '❌ Quiz Failed',
            'message' => "You scored {$score}% on the quiz. " .
                         ($passed ? 'You can now apply for the project!' : "Minimum {$quiz->pass_mark}% required."),
        ]);

        return response()->json([
            'score'   => $score,
            'passed'  => $passed,
            'correct' => $correct,
            'total'   => $totalQ,
            'attempt' => $attempt,
        ]);
    }
}