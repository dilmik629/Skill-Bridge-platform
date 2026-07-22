<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model {
    protected $fillable = [
        'project_id','student_id','github_url','file_path',
        'notes','status','admin_score','submitted_at',
    ];

    protected $casts = ['submitted_at' => 'datetime'];

    // ─── Relationships ──────────────────────────
    public function project()     { return $this->belongsTo(Project::class); }
    public function student()     { return $this->belongsTo(User::class, 'student_id'); }
    public function feedback()    { return $this->hasOne(Feedback::class); }
    public function peerReviews() { return $this->hasMany(PeerReview::class); }

    // ─── Helpers ────────────────────────────────
    public function avgPeerRating() {
        return $this->peerReviews->avg('rating');
    }

    // Combined score: 70% admin + 30% peer
    public function combinedScore() {
        $adminScore = $this->admin_score ?? 0;
        $peerScore  = $this->avgPeerRating() ? ($this->avgPeerRating() / 5) * 100 : $adminScore;
        return round(($adminScore * 0.7) + ($peerScore * 0.3));
    }
}