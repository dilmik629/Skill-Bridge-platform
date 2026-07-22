<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->string('github_url');
            $table->text('notes')->nullable();
            $table->enum('status', ['submitted','reviewed','approved','rejected'])->default('submitted');
            $table->integer('admin_score')->nullable();     // 0-100
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('submissions'); }
};