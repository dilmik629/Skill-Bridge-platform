<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->integer('score');           // 0-100 (%)
            $table->boolean('passed')->default(false);
            $table->json('answers')->nullable();// {"question_id": "a", ...}
            $table->timestamp('attempted_at');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('quiz_attempts'); }
};