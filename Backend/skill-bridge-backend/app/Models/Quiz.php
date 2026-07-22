<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model {
    protected $fillable = ['project_id','pass_mark','retake_cooldown_hours'];

    public function project()   { return $this->belongsTo(Project::class); }
    public function questions() { return $this->hasMany(Question::class)->orderBy('order'); }
    public function attempts()  { return $this->hasMany(QuizAttempt::class); }
}