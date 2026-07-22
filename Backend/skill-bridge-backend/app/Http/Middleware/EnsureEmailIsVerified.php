<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureEmailIsVerified {
    public function handle(Request $request, Closure $next) {
        $user = $request->user();

        if (!$user || is_null($user->email_verified_at)) {
            return response()->json([
                'message' => 'Please verify your email address to continue.',
                'code'    => 'email_not_verified',
            ], 403);
        }

        return $next($request);
    }
}