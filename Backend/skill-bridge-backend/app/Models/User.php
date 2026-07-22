<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name','email','password','role',
        'avatar','github_username','bio','skill_points',
        'location','linkedin_url','portfolio_url','skills',
    ];

    protected $hidden = ['password','remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    // ─── Relationships ──────────────────────────
    public function projects()           { return $this->hasMany(Project::class, 'created_by'); }
    public function applications()       { return $this->hasMany(ProjectApplication::class, 'student_id'); }
    public function submissions()        { return $this->hasMany(Submission::class, 'student_id'); }
    public function quizAttempts()       { return $this->hasMany(QuizAttempt::class, 'student_id'); }
    public function leaderboardScore()   { return $this->hasOne(LeaderboardScore::class, 'student_id'); }
    public function notifications()      { return $this->hasMany(Notification::class); }
    public function feedbacks()          { return $this->hasMany(Feedback::class, 'admin_id'); }

    // ─── Helpers ────────────────────────────────
    public function isAdmin()   { return $this->role === 'admin'; }
    public function isStudent() { return $this->role === 'student'; }
}