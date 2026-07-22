<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;

class IsStudent {
    public function handle(Request $request, Closure $next) {
        if (!$request->user() || !$request->user()->isStudent()) {
            return response()->json(['message' => 'Unauthorized. Student access required.'], 403);
        }
        return $next($request);
    }
}