<?php
// ============================================
// skill-bridge-backend/bootstrap/app.php
// ============================================

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // ─── Sanctum stateful domains ─────────────────
        $middleware->statefulApi();

        // ─── Custom middleware aliases ─────────────────
        $middleware->alias([
            'is.admin'   => \App\Http\Middleware\IsAdmin::class,
            'is.student' => \App\Http\Middleware\IsStudent::class,
            'verified.email' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();