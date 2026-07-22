<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Student;

// ════════════════════════════════════════════
// PUBLIC ROUTES
// ════════════════════════════════════════════
Route::prefix('auth')->group(function () {
    Route::post('register',        [AuthController::class, 'register']);
    Route::post('login',           [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password',  [AuthController::class, 'resetPassword']);
    Route::get('verify-email/{token}', [AuthController::class, 'verifyEmail']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout',              [AuthController::class, 'logout']);
        Route::get('me',                   [AuthController::class, 'me']);
        Route::put('profile',              [Student\ProfileController::class, 'update']);
        Route::post('avatar',              [Student\ProfileController::class, 'uploadAvatar']);
        Route::put('password',             [Student\ProfileController::class, 'changePassword']);
        Route::post('resend-verification', [AuthController::class, 'resendVerification']);
    });
});

// Public — projects
Route::get('projects',           [Student\ProjectController::class, 'index']);
Route::get('projects/{project}', [Student\ProjectController::class, 'show']);

// Public — leaderboard
Route::get('leaderboard', [Student\LeaderboardController::class, 'index']);

// Public — categories
Route::get('categories', fn() => response()->json(\App\Models\Category::all()));

// Public — approved submissions (peer review feed)
Route::get('submissions/approved',         [Student\PeerReviewController::class, 'index']);
Route::get('submissions/{submission}/public', [Student\PeerReviewController::class, 'show']);

// ════════════════════════════════════════════
// STUDENT ROUTES
// ════════════════════════════════════════════
Route::middleware(['auth:sanctum', 'is.student', 'verified.email'])->prefix('my')->group(function () {
    Route::get('dashboard',                 [Student\DashboardController::class, 'index']);
    Route::post('projects/{project}/apply', [Student\ProjectController::class,   'apply']);
    Route::get('quiz/{projectId}',          [Student\QuizController::class,      'show']);
    Route::post('quiz/{quiz}/submit',       [Student\QuizController::class,      'submit']);
    Route::get('submissions',               [Student\SubmissionController::class, 'index']);
    Route::post('submit/{projectId}',       [Student\SubmissionController::class, 'store']);
    Route::get('portfolio',                 [Student\PortfolioController::class,  'index']);
    Route::get('portfolio/export',          [Student\PortfolioController::class, 'exportPdf']);
    Route::get('notifications',             [Student\NotificationController::class, 'index']);
    Route::put('notifications/read-all',    [Student\NotificationController::class, 'markAllRead']);
    Route::put('notifications/{notification}/read', [Student\NotificationController::class, 'markRead']);
});

// Peer reviews — auth required (any role), but must be verified to post
Route::middleware(['auth:sanctum', 'verified.email'])->group(function () {
    Route::post('submissions/{submission}/review',   [Student\PeerReviewController::class, 'store']);
    Route::delete('submissions/{submission}/review', [Student\PeerReviewController::class, 'destroy']);
});

// ════════════════════════════════════════════
// ADMIN ROUTES
// ════════════════════════════════════════════
Route::middleware(['auth:sanctum', 'is.admin'])->prefix('admin')->group(function () {
    Route::get('dashboard',                       [Admin\DashboardController::class,  'index']);
    Route::apiResource('projects',                 Admin\ProjectController::class);
    Route::apiResource('quizzes',                  Admin\QuizController::class);
    Route::get('submissions',                      [Admin\SubmissionController::class, 'index']);
    Route::get('submissions/{submission}',         [Admin\SubmissionController::class, 'show']);
    Route::put('submissions/{submission}/review',  [Admin\SubmissionController::class, 'review']);
    Route::get('users',                            [Admin\UserController::class,       'index']);
    Route::get('users/{user}',                     [Admin\UserController::class,       'show']);
    Route::delete('users/{user}',                  [Admin\UserController::class,       'destroy']);
    Route::get('reports/export',                   [Admin\ReportController::class,     'export']);
    Route::get('reports/stats',                    [Admin\ReportController::class,     'stats']);
});