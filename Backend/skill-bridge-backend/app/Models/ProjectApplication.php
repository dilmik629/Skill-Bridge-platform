<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ProjectApplication extends Model {
    protected $fillable = [
        'project_id','student_id','quiz_attempt_id','status','applied_at',
    ];

    protected $casts = ['applied_at' => 'datetime'];

    public function project()     { return $this->belongsTo(Project::class); }
    public function student()     { return $this->belongsTo(User::class, 'student_id'); }
    public function quizAttempt() { return $this->belongsTo(QuizAttempt::class); }
}