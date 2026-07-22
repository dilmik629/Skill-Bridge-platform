<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class PeerReview extends Model {
    protected $fillable = ['submission_id','reviewer_id','rating','comment'];

    public function submission() { return $this->belongsTo(Submission::class); }
    public function reviewer()   { return $this->belongsTo(User::class, 'reviewer_id'); }
}