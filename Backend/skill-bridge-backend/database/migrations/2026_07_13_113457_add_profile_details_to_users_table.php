<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->string('location')->nullable()->after('bio');
            $table->string('linkedin_url')->nullable()->after('github_username');
            $table->string('portfolio_url')->nullable()->after('linkedin_url');
            $table->string('skills')->nullable()->after('bio'); // comma-separated tags, e.g. "React,Laravel,UI Design"
        });
    }
    public function down(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['location', 'linkedin_url', 'portfolio_url', 'skills']);
        });
    }
};
