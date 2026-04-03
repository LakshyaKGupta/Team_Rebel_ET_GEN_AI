import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  // If not configured, print to console as fallback.
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("EMAIL_USER and EMAIL_PASS are not set. Simulating email sending:");
    console.warn(`To: ${to}\nSubject: ${subject}\nText: ${text}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    // You can use other services like SendGrid or AWS SES here
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"The Economic Times" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}
