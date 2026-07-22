<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;
use App\Models\Project;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ─── Remove seeded demo data before viva/production ───────────────
// Deletes the demo students (…@demo.com) and the 5 demo projects
// (title match, from DemoSeeder). Cascading FKs (onDelete('cascade'))
// automatically clean up their quizzes, questions, leaderboard rows,
// applications, submissions, etc. Real users/projects you created are
// untouched. Run: php artisan demo:clear
Artisan::command('demo:clear', function () {
    $demoTitles = [
        'E-Commerce Website with React',
        'Portfolio Website Design',
        'REST API with Laravel',
        'AI Chatbot Integration',
        'Mobile App UI Design',
    ];

    $students = User::where('email', 'like', '%@demo.com')->get();
    $projects = Project::whereIn('title', $demoTitles)->get();

    $this->info("Found {$students->count()} demo student(s) and {$projects->count()} demo project(s).");

    if (! $this->confirm('Delete these permanently?', true)) {
        $this->warn('Cancelled — nothing was deleted.');
        return;
    }

    $projects->each->delete(); // cascades to quizzes, questions, applications, submissions
    $students->each->delete(); // cascades to leaderboard_scores, notifications, etc.

    $this->info('✅ Demo data removed. Admin login (admin@skillbridge.com) was kept.');
})->purpose('Delete demo students, demo projects, and their related quizzes/questions/leaderboard rows');
