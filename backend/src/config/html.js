/**
 * emailTemplates.js
 *
 * Provides HTML templates for sending emails such as OTP verification and account verification.
 */

/**
 * Generates OTP email HTML content.
 *
 * @param {Object} params
 * @param {string} params.email - Recipient's email address
 * @param {string|number} params.otp - OTP code to display
 * @returns {string} HTML string for OTP email
 */
export const getOtpHtml = ({ email, otp }) => {
  const appName = process.env.APP_NAME || "Authentication App";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>${appName} Verification Code</title>
<style>
  /* Base reset */
  html, body { margin: 0; padding: 0; }
  body {
    background: #f6f7fb;
    color: #111;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  table { border-collapse: collapse; width: 100%; }
  .container {
    width: 600px; max-width: 100%; background: #fff; border-radius: 12px; overflow: hidden;
    border: 1px solid #e9ecf3; margin: 0 auto;
  }
  .header { background: #111827; padding: 18px 24px; text-align: center; }
  .brand { color: #fff; font-weight: 700; font-size: 16px; text-decoration: none; }
  .p-24 { padding: 24px; }
  .p-32 { padding: 32px; }
  .title { font-size: 22px; font-weight: 700; color: #111; margin: 0 0 12px 0; }
  .text { font-size: 15px; line-height: 1.6; color: #444; margin: 0 0 16px 0; }
  .muted { color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0; }
  .otp-wrap { margin: 20px 0; text-align: center; }
  .otp {
    display: inline-block; background: #f3f4f6; border: 1px solid #e5e7eb;
    border-radius: 10px; padding: 14px 18px; font-size: 32px; letter-spacing: 10px;
    font-weight: 700; color: #111; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  @media only screen and (max-width: 600px) {
    .p-32 { padding: 24px !important; }
    .otp { font-size: 28px !important; letter-spacing: 6px !important; }
  }
</style>
</head>
<body>
  <table role="presentation" class="wrapper" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" class="p-24">
        <table role="presentation" class="container" border="0" cellspacing="0" cellpadding="0">
          <!-- Header -->
          <tr><td class="header"><span class="brand">${appName}</span></td></tr>

          <!-- Body -->
          <tr>
            <td class="p-32">
              <h1 class="title">Verify your email - ${email}</h1>
              <p class="text">Use the verification code below to complete your sign-in to ${appName}.</p>

              <!-- OTP -->
              <div class="otp-wrap">
                <div class="otp">${otp}</div>
              </div>

              <p class="muted">This code will expire in <strong>5 minutes</strong>.</p>
              <p class="muted">If this wasn’t you, this email can be safely ignored.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="p-24 muted" style="text-align:center; font-size:12px; color:#6b7280;">
              © ${new Date().getFullYear()} ${appName}. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Generates account verification email HTML content.
 *
 * @param {Object} params
 * @param {string} params.email - Recipient's email address
 * @param {string} params.token - Unique verification token
 * @returns {string} HTML string for verification email
 */
export const getVerifyEmailHtml = ({ email, token }) => {
  const appName = process.env.APP_NAME || "Authentication App";
  const baseUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(
    /\/+$/,
    ""
  );
  const verifyUrl = `${baseUrl}/token/${encodeURIComponent(token)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${appName} Verify Your Account</title>
<style>
  html, body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f6f7fb; color: #111; }
  table { border-collapse: collapse; width: 100%; }
  .container { width: 600px; max-width: 100%; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e9ecf3; margin: 0 auto; }
  .header { background: #111827; padding: 18px 24px; text-align: center; }
  .brand { color: #fff; font-weight: 700; font-size: 16px; text-decoration: none; }
  .p-24 { padding: 24px; }
  .p-32 { padding: 32px; }
  .title { font-size: 22px; font-weight: 700; color: #111; margin: 0 0 12px 0; }
  .text { font-size: 15px; line-height: 1.6; color: #444; margin: 0 0 16px 0; }
  .muted { color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0; }
  .btn { display: inline-block; background: #111827; color: #fff !important; text-decoration: none; padding: 12px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; }
  .link { color: #111827; text-decoration: underline; word-break: break-all; }
  @media only screen and (max-width: 600px) { .p-32 { padding: 24px !important; } }
</style>
</head>
<body>
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" class="p-24">
        <table role="presentation" class="container" border="0" cellspacing="0" cellpadding="0">
          <!-- Header -->
          <tr><td class="header"><span class="brand">${appName}</span></td></tr>

          <!-- Body -->
          <tr>
            <td class="p-32">
              <h1 class="title">Verify your account - ${email}</h1>
              <p class="text">Thanks for registering with ${appName}. Click the button below to verify your account.</p>

              <p style="text-align:center; margin: 16px 0 20px 0;">
                <a class="btn" href="${verifyUrl}" target="_blank" rel="noopener">Verify account</a>
              </p>

              <p class="muted">If the button doesn’t work, copy and paste this link into your browser:</p>
              <p class="muted"><a class="link" href="${verifyUrl}" target="_blank" rel="noopener">${verifyUrl}</a></p>
              <p class="muted">If this wasn’t you, you can safely ignore this email.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="p-24 muted" style="text-align:center; font-size:12px; color:#6b7280;">
              © ${new Date().getFullYear()} ${appName}. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
