<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ResetPasswordMail;
use App\Mail\VerifyEmailMail;
use App\Models\User;
use App\Models\LeaderboardScore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => 'student',
        ]);

        LeaderboardScore::create(['student_id' => $user->id]);

        try {
            $this->sendVerificationEmail($user);
        } catch (\Throwable $e) {
            report($e);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful! Please check your email to verify your account.',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password.'],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful!',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }


    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $plainToken = Str::random(60);

            $user->forceFill([
                'password_reset_token'      => hash('sha256', $plainToken),
                'password_reset_expires_at' => now()->addMinutes(60),
            ])->save();

            try {
                Mail::to($user->email)->send(new ResetPasswordMail($user, $plainToken));
            } catch (\Throwable $e) {
                report($e);
                return response()->json(['message' => 'Could not send the reset email right now. Please try again shortly.'], 500);
            }
        }

        return response()->json([
            'message' => 'If an account exists for that email, a password reset link has been sent.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'token'    => 'required|string',
            'email'    => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::where('email', $data['email'])
            ->where('password_reset_token', hash('sha256', $data['token']))
            ->first();

        if (!$user || !$user->password_reset_expires_at || now()->gt($user->password_reset_expires_at)) {
            return response()->json(['message' => 'Invalid or expired reset token.'], 422);
        }

        $user->forceFill([
            'password'                  => Hash::make($data['password']),
            'password_reset_token'      => null,
            'password_reset_expires_at' => null,
        ])->save();

        $user->tokens()->delete();

        return response()->json(['message' => 'Password reset successfully! You can now log in.']);
    }

 public function resendVerification(Request $request)
    {
        $user = $request->user();

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Your email is already verified.']);
        }

        try {
            $this->sendVerificationEmail($user);
        } catch (\Throwable $e) {
            report($e);
            return response()->json(['message' => 'Could not send verification email right now. Please try again shortly.'], 500);
        }

        return response()->json(['message' => 'Verification email sent.']);
    }

    public function verifyEmail(Request $request, $token)
    {
        $user = User::where('email_verification_token', hash('sha256', $token))
            ->whereNull('email_verified_at')
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired verification link.'], 422);
        }

        $user->forceFill([
            'email_verified_at'         => now(),
            'email_verification_token'  => null,
        ])->save();

        return response()->json(['message' => 'Email verified successfully.']);
    }

    private function sendVerificationEmail(User $user): void
    {
        $plainToken = Str::random(60);

        $user->forceFill([
            'email_verification_token' => hash('sha256', $plainToken),
        ])->save();

        Mail::to($user->email)->send(new VerifyEmailMail($user, $plainToken));
    }
}