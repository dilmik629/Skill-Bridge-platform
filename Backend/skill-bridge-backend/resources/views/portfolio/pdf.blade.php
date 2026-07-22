<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; color: #222; }
        .header { text-align: center; border-bottom: 3px solid #4f46e5; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { color: #4f46e5; margin-bottom: 4px; }
        .header p { color: #666; margin: 2px 0; }
        .stats { display: table; width: 100%; margin-bottom: 20px; }
        .stat-box { display: table-cell; text-align: center; padding: 10px; border: 1px solid #eee; }
        .stat-box .val { font-size: 20px; font-weight: bold; color: #4f46e5; }
        .stat-box .label { font-size: 11px; color: #666; }
        .section-title { font-size: 15px; font-weight: bold; color: #4f46e5; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 20px; }
        .project { border: 1px solid #eee; border-left: 4px solid #4f46e5; padding: 10px; margin-top: 10px; }
        .project h3 { margin: 0 0 4px 0; font-size: 13px; }
        .project .meta { font-size: 10px; color: #666; }
        .skill-row { display: table; width: 100%; margin-top: 6px; font-size: 11px; }
        .skill-row .name { display: table-cell; width: 70%; }
        .skill-row .score { display: table-cell; width: 30%; text-align: right; font-weight: bold; color: #4f46e5; }
        .footer { margin-top: 25px; font-size: 9px; color: #999; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $student->name }}</h1>
        <p>Full-Stack Developer — SkillBridge Portfolio</p>
        <p>{{ $student->email }}</p>
    </div>

    <div class="stats">
        <div class="stat-box">
            <div class="val">{{ $stats['projects_done'] ?? 0 }}</div>
            <div class="label">Projects Done</div>
        </div>
        <div class="stat-box">
            <div class="val">{{ $stats['skill_points'] ?? 0 }}</div>
            <div class="label">Skill Points</div>
        </div>
        <div class="stat-box">
            <div class="val">{{ isset($stats['rank']) && $stats['rank'] ? '#'.$stats['rank'] : '—' }}</div>
            <div class="label">Leaderboard Rank</div>
        </div>
    </div>

    <div class="section-title">📁 Completed Projects</div>
    @forelse($completed_projects as $s)
        <div class="project">
            <h3>{{ $s->project->title ?? 'Project' }}</h3>
            <div class="meta">
                Level: {{ $s->project->level ?? '—' }} &nbsp;|&nbsp;
                Score: {{ $s->admin_score ?? '—' }}/100
                @if($s->github_url) &nbsp;|&nbsp; {{ $s->github_url }} @endif
            </div>
        </div>
    @empty
        <p>No completed projects yet.</p>
    @endforelse

    <div class="section-title">⚡ Skills</div>
    @forelse($skills as $sk)
        <div class="skill-row">
            <div class="name">{{ $sk['category'] }}</div>
            <div class="score">{{ $sk['avg_score'] }}%</div>
        </div>
    @empty
        <p>No skills recorded yet.</p>
    @endforelse

    <div class="footer">Generated on {{ now()->format('Y-m-d H:i') }} — SkillBridge Platform</div>
</body>
</html>