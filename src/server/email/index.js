import { reportInternalErrors } from '@server/reportInternalErrors';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const verifyTransporter = async () => {
  try {
    await transporter.verify();
    return { ok: true };
  } catch (e) {
    reportInternalErrors({
      section: 'server/email',
      message: 'SMTP Verify Error: ' + e.message,
    });
    return { ok: false, error: 'SMTP_VERIFY_FAILED', devMessage: e.message };
  }
};

const sendMail = async (
  { displayName = '', to, subject, html },
  timeoutMs = 5000
) => {
  try {
    const verifyResult = await verifyTransporter();
    if (!verifyResult.ok) return verifyResult;

    const sendPromise = transporter.sendMail({
      from: displayName,
      to,
      subject,
      html,
    });

    const result = await Promise.race([
      sendPromise.then(() => ({ ok: true, message: 'EMAIL_SENT' })),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email send timed out')), timeoutMs)
      ),
    ]);

    return result;
  } catch (e) {
    reportInternalErrors({
      section: 'server/email',
      message: 'sendMail Error: ' + e.message,
    });
    return { ok: false, message: 'EMAIL_NOT_SENT', devMessage: e.message };
  }
};

export default sendMail;
