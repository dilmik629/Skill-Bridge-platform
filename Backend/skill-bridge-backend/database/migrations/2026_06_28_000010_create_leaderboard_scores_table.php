<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('leaderboard_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade')->unique();
            $table->integer('total_points')->default(0);
            $table->integer('projects_completed')->default(0);
            $table->integer('rank')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('leaderboard_scores'); }
};