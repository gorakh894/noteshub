const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"EngiNotes Hub" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const emailTemplates = {
  verifyEmail: (name, verificationUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">EngiNotes Hub</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2>Welcome, ${name}! 🎓</h2>
        <p>Please verify your email address to get started.</p>
        <a href="${verificationUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
      </div>
    </div>
  `,

  resetPassword: (name, resetUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">EngiNotes Hub</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2>Reset Your Password</h2>
        <p>Hi ${name}, you requested a password reset.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    </div>
  `,

  noteApproved: (name, noteTitle) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">✅ Note Approved!</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2>Congratulations, ${name}!</h2>
        <p>Your note "<strong>${noteTitle}</strong>" has been approved and is now available to all students.</p>
        <p>Keep contributing to help fellow engineers! 🚀</p>
      </div>
    </div>
  `,

  noteRejected: (name, noteTitle, reason) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Note Review Result</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2>Hi ${name},</h2>
        <p>Your note "<strong>${noteTitle}</strong>" was not approved.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please revise and resubmit. If you believe this is a mistake, contact support.</p>
      </div>
    </div>
  `,
};

module.exports = { sendEmail, emailTemplates };
