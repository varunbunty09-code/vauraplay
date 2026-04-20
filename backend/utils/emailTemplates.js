const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0f; color: #e0e0e0; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #12121a 0%, #1a1a2e 100%); border-radius: 16px; overflow: hidden; border: 1px solid rgba(139, 92, 246, 0.2); }
    .header { background: linear-gradient(135deg, #6d28d9, #8b5cf6, #a78bfa); padding: 32px; text-align: center; }
    .header h1 { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: 2px; }
    .header p { color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 4px; }
    .body-content { padding: 32px; }
    .otp-box { background: linear-gradient(135deg, #1e1e3a, #2d1b69); border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0; border: 1px solid rgba(139, 92, 246, 0.3); }
    .otp-code { font-size: 36px; font-weight: 800; color: #a78bfa; letter-spacing: 8px; font-family: 'Courier New', monospace; }
    .btn { display: inline-block; background: linear-gradient(135deg, #6d28d9, #8b5cf6); color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 16px 0; }
    .info-box { background: rgba(139, 92, 246, 0.1); border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; }
    .footer { padding: 24px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); color: #888; font-size: 12px; }
    .footer a { color: #8b5cf6; text-decoration: none; }
    p { line-height: 1.6; margin-bottom: 12px; }
    .greeting { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎬 VauraPlay</h1>
      <p>Your Premium Streaming Experience</p>
    </div>
    <div class="body-content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} VauraPlay. All rights reserved.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  </div>
</body>
</html>`;

// OTP Email Template
const otpEmail = (username, otp, purpose) => {
  const purposeText = {
    signup: 'verify your account',
    login: 'complete your login',
    reset: 'reset your password',
  };

  return baseTemplate(`
    <p class="greeting">Hey ${username}! 👋</p>
    <p>Your one-time verification code to <strong>${purposeText[purpose] || 'verify'}</strong> is:</p>
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
    </div>
    <div class="info-box">
      <p>⏰ This code expires in <strong>10 minutes</strong></p>
      <p>🔒 Never share this code with anyone</p>
    </div>
  `);
};

// Welcome Email Template
const welcomeEmail = (username) => {
  return baseTemplate(`
    <p class="greeting">Welcome to VauraPlay, ${username}! 🎉</p>
    <p>Your account has been successfully verified and is ready to use.</p>
    <p>Here's what you can do now:</p>
    <div class="info-box">
      <p>🎬 Browse 50,000+ movies and 25,000+ TV shows</p>
      <p>📋 Create your personal watchlist</p>
      <p>⏯️ Continue watching where you left off</p>
      <p>🎨 Customize your player experience</p>
    </div>
    <p style="text-align: center;">
      <a href="${process.env.FRONTEND_URL}" class="btn">Start Watching Now →</a>
    </p>
  `);
};

// Login Notification Email
const loginNotificationEmail = (username, ip, userAgent, timestamp) => {
  return baseTemplate(`
    <p class="greeting">New Login Detected 🔔</p>
    <p>Hey ${username}, we noticed a new login to your VauraPlay account.</p>
    <div class="info-box">
      <p>📅 <strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
      <p>🌐 <strong>IP Address:</strong> ${ip}</p>
      <p>💻 <strong>Device:</strong> ${userAgent}</p>
    </div>
    <p>If this wasn't you, please change your password immediately.</p>
    <p style="text-align: center;">
      <a href="${process.env.FRONTEND_URL}/profile" class="btn">Review Account →</a>
    </p>
  `);
};

// Forgot Password Email
const forgotPasswordEmail = (username, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  return baseTemplate(`
    <p class="greeting">Password Reset Request 🔐</p>
    <p>Hey ${username}, we received a request to reset your password.</p>
    <p style="text-align: center;">
      <a href="${resetUrl}" class="btn">Reset Password →</a>
    </p>
    <div class="info-box">
      <p>⏰ This link expires in <strong>30 minutes</strong></p>
      <p>🔒 If you didn't request this, ignore this email</p>
    </div>
    <p style="font-size: 12px; color: #888;">Or copy this link: ${resetUrl}</p>
  `);
};

// Account Status Email
const accountStatusEmail = (username, status, reason) => {
  const isActive = status === 'active';
  return baseTemplate(`
    <p class="greeting">Account ${isActive ? 'Activated' : 'Suspended'} ${isActive ? '✅' : '⚠️'}</p>
    <p>Hey ${username}, your VauraPlay account has been <strong>${isActive ? 'activated' : 'suspended'}</strong>.</p>
    ${reason ? `<div class="info-box"><p><strong>Reason:</strong> ${reason}</p></div>` : ''}
    ${isActive 
      ? `<p style="text-align: center;"><a href="${process.env.FRONTEND_URL}" class="btn">Continue Watching →</a></p>` 
      : '<p>If you believe this is a mistake, please contact our support team.</p>'}
  `);
};

// Movie Update Email
const movieUpdateEmail = (username, movies) => {
  const movieList = movies.map(m => `
    <div style="display: flex; align-items: center; margin-bottom: 12px; background: rgba(139,92,246,0.1); border-radius: 8px; padding: 12px;">
      <div>
        <p style="font-weight: 600; color: #fff; margin-bottom: 2px;">${m.title}</p>
        <p style="font-size: 12px; color: #888;">${m.overview ? m.overview.substring(0, 100) + '...' : 'New content available'}</p>
      </div>
    </div>
  `).join('');

  return baseTemplate(`
    <p class="greeting">New Content Alert! 🍿</p>
    <p>Hey ${username}, check out what's new on VauraPlay:</p>
    ${movieList}
    <p style="text-align: center;">
      <a href="${process.env.FRONTEND_URL}/browse" class="btn">Browse Now →</a>
    </p>
  `);
};

module.exports = {
  otpEmail,
  welcomeEmail,
  loginNotificationEmail,
  forgotPasswordEmail,
  accountStatusEmail,
  movieUpdateEmail,
};
