<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->json('tech_stack')->nullable();   // ["React","Laravel","MySQL"]
            $table->enum('level', ['beginner','intermediate','advanced']);
            $table->enum('status', ['open','closed','in_progress'])->default('open');
            $table->date('deadline');
            $table->integer('max_students')->default(5);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('projects'); }
};