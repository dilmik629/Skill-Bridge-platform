<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('project_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('quiz_attempt_id')->nullable()->constrained('quiz_attempts')->onDelete('set null');
            $table->enum('status', ['pending','approved','rejected'])->default('pending');
            $table->timestamp('applied_at')->useCurrent();
            $table->timestamps();

            // Student ට same project ට twice apply කරන්ට බෑ
            $table->unique(['project_id','student_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('project_applications'); }
};