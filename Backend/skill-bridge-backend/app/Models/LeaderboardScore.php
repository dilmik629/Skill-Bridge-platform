<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class LeaderboardScore extends Model {
    protected $fillable = ['student_id','total_points','projects_completed','rank'];

    public function student() { return $this->belongsTo(User::class, 'student_id'); }
}