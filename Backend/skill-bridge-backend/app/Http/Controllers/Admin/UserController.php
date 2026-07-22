<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller {

    public function index(Request $request) {
        $users = User::where('role','student')
            ->with('leaderboardScore')
            ->withCount('submissions','applications')
            ->when($request->search, fn($q,$v) =>
                $q->where(fn($sub) =>
                    $sub->where('name','like',"%$v%")->orWhere('email','like',"%$v%")
                ))
            ->latest()->paginate(20);

        return response()->json($users);
    }

    public function show(User $user) {
        return response()->json(
            $user->load(['submissions.project','applications.project','leaderboardScore','quizAttempts'])
        );
    }

    public function destroy(User $user) {
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Cannot delete admin users.'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'User removed.']);
    }
}