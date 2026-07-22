<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Project;
use Illuminate\Http\Request;

class QuizController extends Controller {

    // GET /api/admin/quizzes
    public function index() {
        $quizzes = Quiz::with(['project', 'questions'])
            ->withCount('attempts')
            ->latest()->get();

        $quizzes->each(fn ($quiz) => $quiz->questions->makeVisible('correct_option'));

        return response()->json($quizzes);
    }

    // POST /api/admin/quizzes
    public function store(Request $request) {
        $data = $request->validate([
            'project_id'            => 'required|exists:projects,id|unique:quizzes',
            'pass_mark'             => 'integer|min:1|max:100',
            'retake_cooldown_hours' => 'integer|min:0',
            'questions'             => 'required|array|min:1',
            'questions.*.question_text'  => 'required|string',
            'questions.*.option_a'       => 'required|string',
            'questions.*.option_b'       => 'required|string',
            'questions.*.option_c'       => 'required|string',
            'questions.*.option_d'       => 'required|string',
            'questions.*.correct_option' => 'required|in:a,b,c,d',
        ]);

        $quiz = Quiz::create([
            'project_id'            => $data['project_id'],
            'pass_mark'             => $data['pass_mark'] ?? 70,
            'retake_cooldown_hours' => $data['retake_cooldown_hours'] ?? 24,
        ]);

        foreach ($data['questions'] as $i => $q) {
            $quiz->questions()->create([...$q, 'order' => $i + 1]);
        }

        return response()->json([
            'message' => 'Quiz created.',
            'quiz'    => $quiz->load('questions'),
        ], 201);
    }

    // GET /api/admin/quizzes/{id}
    public function show(Quiz $quiz) {
        $quiz->load(['project', 'questions']);
        $quiz->questions->makeVisible('correct_option');
        return response()->json($quiz);
    }

    // PUT /api/admin/quizzes/{id}
    public function update(Request $request, Quiz $quiz) {
        $data = $request->validate([
            'pass_mark'             => 'sometimes|integer|min:1|max:100',
            'retake_cooldown_hours' => 'sometimes|integer|min:0',
            'questions'             => 'sometimes|array',
            'questions.*.id'             => 'sometimes|exists:questions,id',
            'questions.*.question_text'  => 'required_with:questions|string',
            'questions.*.option_a'       => 'required_with:questions|string',
            'questions.*.option_b'       => 'required_with:questions|string',
            'questions.*.option_c'       => 'required_with:questions|string',
            'questions.*.option_d'       => 'required_with:questions|string',
            'questions.*.correct_option' => 'required_with:questions|in:a,b,c,d',
        ]);

        $quiz->update($data);

        if (isset($data['questions'])) {
            $quiz->questions()->delete();
            foreach ($data['questions'] as $i => $q) {
                $quiz->questions()->create([...$q, 'order' => $i + 1]);
            }
        }

        return response()->json(['message' => 'Quiz updated.', 'quiz' => $quiz->fresh('questions')]);
    }

    // DELETE /api/admin/quizzes/{id}
    public function destroy(Quiz $quiz) {
        $quiz->delete();
        return response()->json(['message' => 'Quiz deleted.']);
    }
}