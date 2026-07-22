<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    // PUT /api/auth/profile
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'            => 'sometimes|string|max:100',
            'bio'             => 'nullable|string|max:200',
            'github_username' => 'nullable|string|max:100',
            'location'        => 'nullable|string|max:100',
            'linkedin_url'    => 'nullable|url|max:255',
            'portfolio_url'   => 'nullable|url|max:255',
            'skills'          => 'nullable|string|max:255',
        ]);

        $user->update($data);

        return response()->json($user->fresh());
    }

    // POST /api/auth/avatar
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048', // 2MB max
        ]);

        $user = $request->user();

        // Remove the previous avatar file (if it was one we stored, not an
        // external URL) so old images don't pile up in storage.
        if ($user->avatar && Storage::disk('public')->exists($this->pathFromAvatarUrl($user->avatar))) {
            Storage::disk('public')->delete($this->pathFromAvatarUrl($user->avatar));
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar' => Storage::disk('public')->url($path)]);

        return response()->json($user->fresh());
    }

    private function pathFromAvatarUrl(string $url): string
    {

        $path = ltrim($path, '/');

        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, strlen('storage/'));
        }

        return $path;
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->update(['password' => Hash::make($data['password'])]);

        return response()->json(['message' => 'Password changed successfully.']);
    }
}

