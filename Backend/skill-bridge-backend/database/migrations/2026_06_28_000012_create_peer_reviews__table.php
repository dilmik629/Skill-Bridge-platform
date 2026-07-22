<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('peer_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained()->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->tinyInteger('rating');        // 1-5 stars
            $table->text('comment')->nullable();
            $table->timestamps();

            // එකම submission ට same person ට twice review කරන්ට බෑ
            $table->unique(['submission_id', 'reviewer_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('peer_reviews'); }
};