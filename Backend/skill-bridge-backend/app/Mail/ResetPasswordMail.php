<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $resetUrl;

    /**
     * @param User   $user  The account requesting a reset.
     * @param string $token Plain-text reset token (hashed copy stored on the user).
     */
    public function __construct(public User $user, string $token)
    {
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');
        $email = urlencode($user->email);
        $this->resetUrl = "{$frontendUrl}/reset-password?token={$token}&email={$email}";
    }

    public function build()
    {
        return $this
            ->subject('Reset your SkillBridge password')
            ->view('emails.reset-password')
            ->with([
                'name'     => $this->user->name,
                'resetUrl' => $this->resetUrl,
            ]);
    }
}
