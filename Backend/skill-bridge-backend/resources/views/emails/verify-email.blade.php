<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#4338ca;padding:24px 32px;">
              <span style="color:#ffffff;font-size:20px;font-weight:bold;">Skill<span style="font-weight:400;">Bridge</span></span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 12px;color:#111827;">Verify your email 📧</h2>
              <p style="color:#374151;font-size:15px;line-height:1.6;">Hi {{ $name }},</p>
              <p style="color:#374151;font-size:15px;line-height:1.6;">
                Thanks for joining SkillBridge! Please confirm this is your email address so you can
                unlock your dashboard, apply for projects and track your progress.
              </p>
              <p style="text-align:center;margin:28px 0;">
                <a href="{{ $verifyUrl }}"
                   style="background:#4338ca;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;display:inline-block;">
                  Verify Email Address
                </a>
              </p>
              <p style="color:#6b7280;font-size:13px;line-height:1.6;">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ $verifyUrl }}" style="color:#4338ca;">{{ $verifyUrl }}</a>
              </p>
              <p style="color:#6b7280;font-size:13px;">This link expires in 24 hours. If you didn't create a SkillBridge account, you can ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
