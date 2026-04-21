const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; color: #333333;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e0e0e0; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background: linear-gradient(135deg, #6d28d9, #8b5cf6, #a78bfa); padding: 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: 2px;">🎬 VauraPlay</h1>
              <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Your Premium Streaming Experience</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; background-color: #ffffff;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; text-align: center; border-top: 1px solid #eeeeee; background-color: #fafafa;">
              <p style="margin: 0 0 8px; color: #999999; font-size: 12px;">&copy; ${new Date().getFullYear()} VauraPlay. All rights reserved.</p>
              <p style="margin: 0; color: #999999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
    <p style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin: 0 0 16px;">Hey ${username}! 👋</p>
    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">Your one-time verification code to <strong>${purposeText[purpose] || 'verify'}</strong> is:</p>
    <div style="background: linear-gradient(135deg, #1e1e3a, #2d1b69); border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
      <div style="font-size: 36px; font-weight: 800; color: #a78bfa; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
    </div>
    <div style="background-color: #f3f0ff; border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
      <p style="color: #4a4a6a; line-height: 1.6; margin: 0 0 8px;">⏰ This code expires in <strong>10 minutes</strong></p>
      <p style="color: #4a4a6a; line-height: 1.6; margin: 0;">🔒 Never share this code with anyone</p>
    </div>
  `);
};

// Welcome Email Template
const welcomeEmail = (username) => {
  return baseTemplate(`
    <p style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin: 0 0 16px;">Welcome to the family, ${username}! 🍿</p>
    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">Your VauraPlay account has been successfully verified. Get ready for a premium streaming experience like never before!</p>
    
    <div style="background: linear-gradient(135deg, #1e1e3a, #2d1b69); border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0;">
      <p style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 6px;">Unlimited Movies & TV Shows</p>
      <p style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 0;">Anytime. Anywhere. On Any Device.</p>
    </div>

    <p style="color: #333333; line-height: 1.6; margin: 0 0 12px;"><strong>Here's what you can enjoy with VauraPlay:</strong></p>
    <div style="background-color: #f3f0ff; border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0 0 8px;">🎬 <strong>Massive Library:</strong> Access to over 50,000+ movies and trending TV shows updated daily.</p>
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0 0 8px;">💎 <strong>Premium Quality:</strong> Stream your favorite content in stunning 4K and HDR quality.</p>
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0 0 8px;">📋 <strong>Smart Watchlist:</strong> Add movies to your list and get personalized recommendations.</p>
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0;">⏯️ <strong>Sync Progress:</strong> Start watching on your phone and finish on your laptop seamlessly.</p>
    </div>

    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">We're thrilled to have you with us. Sit back, grab some popcorn, and start your binge-watching journey!</p>
    
    <p style="text-align: center; margin: 24px 0;">
      <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: linear-gradient(135deg, #6d28d9, #8b5cf6); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Start Watching Now →</a>
    </p>
    
    <p style="font-size: 13px; color: #999999; text-align: center; margin: 20px 0 0;">
      Need help? Visit our <a href="${process.env.FRONTEND_URL}/help" style="color: #8b5cf6; text-decoration: none;">Help Center</a> or reply to this email.
    </p>
  `);
};

// Login Notification Email
const loginNotificationEmail = (username, ip, userAgent, timestamp, location) => {
  const locationStr = location ? [location.city, location.region, location.country].filter(Boolean).join(', ') : 'Unknown';
  return baseTemplate(`
    <p style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin: 0 0 16px;">New Login Detected 🔔</p>
    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">Hey ${username}, we noticed a new login to your VauraPlay account.</p>
    <div style="background-color: #f3f0ff; border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0 0 8px;">📅 <strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0 0 8px;">📍 <strong>Location:</strong> ${locationStr}</p>
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0 0 8px;">🌐 <strong>IP Address:</strong> ${ip}</p>
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0;">💻 <strong>Device:</strong> ${userAgent}</p>
    </div>
    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">If this wasn't you, please change your password immediately.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${process.env.FRONTEND_URL}/profile?tab=activity" style="display: inline-block; background: linear-gradient(135deg, #6d28d9, #8b5cf6); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Review Account →</a>
    </p>
  `);
};

// Forgot Password Email
const forgotPasswordEmail = (username, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  return baseTemplate(`
    <p style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin: 0 0 16px;">Password Reset Request 🔐</p>
    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">Hey ${username}, we received a request to reset your password.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #6d28d9, #8b5cf6); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Reset Password →</a>
    </p>
    <div style="background-color: #f3f0ff; border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0 0 8px;">⏰ This link expires in <strong>30 minutes</strong></p>
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0;">🔒 If you didn't request this, ignore this email</p>
    </div>
    <p style="font-size: 12px; color: #999999; margin: 12px 0 0;">Or copy this link: ${resetUrl}</p>
  `);
};

// Account Status Email
const accountStatusEmail = (username, status, reason) => {
  const isActive = status === 'active';
  return baseTemplate(`
    <p style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin: 0 0 16px;">Account ${isActive ? 'Activated' : 'Suspended'} ${isActive ? '✅' : '⚠️'}</p>
    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">Hey ${username}, your VauraPlay account has been <strong>${isActive ? 'activated' : 'suspended'}</strong>.</p>
    ${reason ? `<div style="background-color: #f3f0ff; border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0;"><p style="color: #4a4a6a; margin: 0;"><strong>Reason:</strong> ${reason}</p></div>` : ''}
    ${isActive
      ? `<p style="text-align: center; margin: 24px 0;"><a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: linear-gradient(135deg, #6d28d9, #8b5cf6); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Continue Watching →</a></p>`
      : '<p style="color: #444444; line-height: 1.6; margin: 0;">If you believe this is a mistake, please contact our support team.</p>'}
  `);
};

// Movie Update Email
const movieUpdateEmail = (username, movies) => {
  const movieList = movies.map(m => `
    <div style="margin-bottom: 12px; background-color: #f3f0ff; border-radius: 8px; padding: 12px;">
      <p style="font-weight: 600; color: #1a1a2e; margin: 0 0 4px;">${m.title}</p>
      <p style="font-size: 12px; color: #777777; margin: 0;">${m.overview ? m.overview.substring(0, 100) + '...' : 'New content available'}</p>
    </div>
  `).join('');

  return baseTemplate(`
    <p style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin: 0 0 16px;">New Content Alert! 🍿</p>
    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">Hey ${username}, check out what's new on VauraPlay:</p>
    ${movieList}
    <p style="text-align: center; margin: 24px 0;">
      <a href="${process.env.FRONTEND_URL}/browse" style="display: inline-block; background: linear-gradient(135deg, #6d28d9, #8b5cf6); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Browse Now →</a>
    </p>
  `);
};

// Email Change OTP Template
const emailChangeOtpEmail = (username, otp, newEmail) => {
  return baseTemplate(`
    <p style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin: 0 0 16px;">Email Change Request 📧</p>
    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">Hey ${username}, you requested to change your email address to <strong>${newEmail}</strong>.</p>
    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">Use the code below to verify this change:</p>
    <div style="background: linear-gradient(135deg, #1e1e3a, #2d1b69); border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
      <div style="font-size: 36px; font-weight: 800; color: #a78bfa; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
    </div>
    <div style="background-color: #f3f0ff; border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0 0 8px;">⏰ This code expires in <strong>10 minutes</strong></p>
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0;">🔒 If you didn't request this change, ignore this email</p>
    </div>
  `);
};

// Delete Account OTP Template
const deleteAccountOtpEmail = (username, otp) => {
  return baseTemplate(`
    <p style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin: 0 0 16px;">Account Deletion Confirmation ⚠️</p>
    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">Hey ${username}, you requested to <strong>permanently delete</strong> your VauraPlay account.</p>
    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">To confirm this action, enter the verification code below:</p>
    <div style="background: linear-gradient(135deg, #1e1e3a, #2d1b69); border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
      <div style="font-size: 36px; font-weight: 800; color: #a78bfa; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
    </div>
    <div style="background-color: #fff3f3; border-left: 4px solid #ef4444; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
      <p style="color: #7a3030; line-height: 1.8; margin: 0 0 8px;">⏰ This code expires in <strong>10 minutes</strong></p>
      <p style="color: #7a3030; line-height: 1.8; margin: 0 0 8px;">⚠️ This action is <strong>irreversible</strong></p>
      <p style="color: #7a3030; line-height: 1.8; margin: 0;">🗑️ All your data, watchlists, and progress will be permanently removed</p>
    </div>
    <p style="color: #444444; line-height: 1.6; margin: 12px 0 0;">If you didn't request this, please secure your account immediately.</p>
  `);
};

// Account Deleted Confirmation Email
const accountDeletedEmail = (username, email) => {
  return baseTemplate(`
    <p style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin: 0 0 16px;">Account Deleted 👋</p>
    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">Hey ${username}, your VauraPlay account (<strong>${email}</strong>) has been permanently deleted.</p>
    <div style="background-color: #f3f0ff; border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
      <p style="color: #4a4a6a; margin: 0 0 8px;"><strong>What happens next:</strong></p>
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0 0 8px;">📋 All your watchlists and preferences have been removed</p>
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0 0 8px;">📊 Your watch history has been cleared</p>
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0 0 8px;">🔐 Your login credentials have been invalidated</p>
      <p style="color: #4a4a6a; line-height: 1.8; margin: 0;">📧 You will no longer receive emails from us</p>
    </div>
    <p style="color: #444444; line-height: 1.6; margin: 0 0 12px;">If you ever want to come back, you can create a new account at any time.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${process.env.FRONTEND_URL}/signup" style="display: inline-block; background: linear-gradient(135deg, #6d28d9, #8b5cf6); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Create New Account →</a>
    </p>
    <p style="font-size: 12px; color: #999999; margin: 0;">If you didn't request this deletion, please contact us immediately at support@vauraplay.com</p>
  `);
};

module.exports = {
  otpEmail,
  welcomeEmail,
  loginNotificationEmail,
  forgotPasswordEmail,
  accountStatusEmail,
  movieUpdateEmail,
  emailChangeOtpEmail,
  deleteAccountOtpEmail,
  accountDeletedEmail,
};
