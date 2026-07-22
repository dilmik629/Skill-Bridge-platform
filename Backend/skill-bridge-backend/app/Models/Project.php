<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Project extends Model {
    protected $fillable = [
        'category_id','created_by','title','description',
        'tech_stack','level','status','deadline','max_students',
    ];

    protected $casts = [
        'tech_stack' => 'array',
        'deadline'   => 'date',
    ];

    // ─── Relationships ──────────────────────────
    public function category()     { return $this->belongsTo(Category::class); }
    public function creator()      { return $this->belongsTo(User::class, 'created_by'); }
    public function quiz()         { return $this->hasOne(Quiz::class); }
    public function applications() { return $this->hasMany(ProjectApplication::class); }
    public function submissions()  { return $this->hasMany(Submission::class); }

    // ─── Helpers ────────────────────────────────
    public function approvedStudentsCount() {
        if ($this->relationLoaded('applications')) {
            return $this->applications->where('status', 'approved')->count();
        }
        return $this->applications()->where('status', 'approved')->count();
    }
    public function isFull() {
        return $this->approvedStudentsCount() >= $this->max_students;
    }
}