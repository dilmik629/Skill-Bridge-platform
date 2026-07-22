<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Question extends Model {
    protected $fillable = [
        'quiz_id','question_text',
        'option_a','option_b','option_c','option_d',
        'correct_option','order',
    ];

    // correct_option hide from students
    protected $hidden = ['correct_option'];

    public function quiz() { return $this->belongsTo(Quiz::class); }

    // Only show correct answer when needed
    public function withAnswer() {
        return $this->makeVisible('correct_option');
    }
}