import nodemailer from 'nodemailer';

// ✅ إعداد الـ transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ دالة إرسال الإيميل
export const sendResetEmail = async (email: string, resetToken: string): Promise<void> => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '🔐 Password Reset Request - Medical Inventory',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #2563eb;">
          <h1 style="color: #2563eb; font-size: 24px; margin: 0;">🏥 Medical Inventory</h1>
          <p style="color: #6b7280; font-size: 14px;">Secure Password Reset</p>
        </div>

        <div style="padding: 20px 0;">
          <p style="font-size: 16px; color: #1f2937;">Hello,</p>
          <p style="font-size: 16px; color: #1f2937;">
            We received a request to reset your password for your Medical Inventory account.
          </p>
          <p style="font-size: 16px; color: #1f2937;">
            Click the button below to reset your password:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              🔑 Reset Password
            </a>
          </div>

          <p style="font-size: 14px; color: #6b7280;">
            This link will expire in <strong>1 hour</strong>.
          </p>
          <p style="font-size: 14px; color: #6b7280;">
            If you didn't request this, please ignore this email.
          </p>
        </div>

        <div style="padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af;">
          <p>Medical Inventory System &copy; ${new Date().getFullYear()}</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};