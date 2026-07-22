<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model {
    protected $table = 'feedbacks';
    protected $fillable = ['submission_id','admin_id','comment','rating'];

    public function submission() { return $this->belongsTo(Submission::class); }
    public function admin()      { return $this->belongsTo(User::class, 'admin_id'); }
}