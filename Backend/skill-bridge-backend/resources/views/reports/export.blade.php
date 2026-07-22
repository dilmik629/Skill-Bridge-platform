<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #222; }
        h1 { font-size: 18px; margin-bottom: 2px; color: #4f46e5; }
        p.sub { color: #666; margin-top: 0; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
        th { background: #4f46e5; color: #fff; font-size: 11px; }
        tr:nth-child(even) { background: #f7f7fb; }
        .footer { margin-top: 20px; font-size: 10px; color: #999; text-align: center; }
    </style>
</head>
<body>
    <h1>SkillBridge — {{ ucfirst($type) }} Report</h1>
    <p class="sub">Generated on {{ now()->format('Y-m-d H:i') }}</p>

    @if($data->isEmpty())
        <p>No data available for this report.</p>
    @else
        <table>
            <thead>
                <tr>
                    @foreach(array_keys($data->first()) as $col)
                        <th>{{ $col }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach($data as $row)
                    <tr>
                        @foreach($row as $cell)
                            <td>{{ $cell }}</td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <div class="footer">SkillBridge Platform — Confidential Report</div>
</body>
</html>