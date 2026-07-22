<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyEmailMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $verifyUrl;

    /**
     * @param User   $user  The student/admin who registered.
     * @param string $token Plain-text verification token (already saved, hashed, on the user).
     */
    public function __construct(public User $user, string $token)
    {
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');
        $this->verifyUrl = "{$frontendUrl}/verify-email?token={$token}";
    }

    public function build()
    {
        return $this
            ->subject('Verify your SkillBridge email address')
            ->view('emails.verify-email')
            ->with([
                'name'      => $this->user->name,
                'verifyUrl' => $this->verifyUrl,
            ]);
    }
}
