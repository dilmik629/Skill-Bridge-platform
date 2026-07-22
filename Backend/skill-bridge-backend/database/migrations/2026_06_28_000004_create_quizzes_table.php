<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->integer('pass_mark')->default(70);          // %
            $table->integer('retake_cooldown_hours')->default(24);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('quizzes'); }
};