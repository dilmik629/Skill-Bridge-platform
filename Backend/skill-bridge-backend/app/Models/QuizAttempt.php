<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model {
    protected $fillable = [
        'quiz_id','student_id','score','passed','answers','attempted_at',
    ];

    protected $casts = [
        'passed'       => 'boolean',
        'answers'      => 'array',
        'attempted_at' => 'datetime',
    ];

    public function quiz()    { return $this->belongsTo(Quiz::class); }
    public function student() { return $this->belongsTo(User::class, 'student_id'); }
}