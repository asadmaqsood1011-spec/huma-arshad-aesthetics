const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP environment variables are not fully configured.");
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  return transporter;
}

async function sendEmail({ to, subject, text, html }) {
  const adminEmail = to || process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!adminEmail) {
    throw new Error("ADMIN_NOTIFICATION_EMAIL is not configured.");
  }

  const mailer = getTransporter();

  return mailer.sendMail({
    from: process.env.SMTP_USER,
    to: adminEmail,
    subject,
    text,
    html
  });
}

async function sendBookingNotification(booking) {
  const createdTime = new Date(booking.createdAt).toLocaleString();
  const subject = "New Booking Request – Huma Arshad Website";
  const text = [
    "New booking request received.",
    `Full Name: ${booking.fullName}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone}`,
    `Service: ${booking.service}`,
    `Preferred Date: ${booking.preferredDate || ""}`,
    `Preferred Time: ${booking.preferredTime || ""}`,
    `Message: ${booking.message || ""}`,
    `Created Time: ${createdTime}`
  ].join("\n");
  const html = `
    <h2>New Booking Request</h2>
    <p><strong>Full Name:</strong> ${booking.fullName}</p>
    <p><strong>Email:</strong> ${booking.email}</p>
    <p><strong>Phone:</strong> ${booking.phone}</p>
    <p><strong>Service:</strong> ${booking.service}</p>
    <p><strong>Preferred Date:</strong> ${booking.preferredDate || "-"}</p>
    <p><strong>Preferred Time:</strong> ${booking.preferredTime || "-"}</p>
    <p><strong>Message:</strong> ${booking.message || "-"}</p>
    <p><strong>Created Time:</strong> ${createdTime}</p>
  `;

  return sendEmail({ subject, text, html });
}

async function sendInquiryNotification(inquiry) {
  const createdTime = new Date(inquiry.createdAt).toLocaleString();
  const subject = "New Contact Inquiry – Huma Arshad Website";
  const text = [
    "New contact inquiry received.",
    `Full Name: ${inquiry.fullName}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone || ""}`,
    `Subject: ${inquiry.subject || ""}`,
    `Message: ${inquiry.message}`,
    `Created Time: ${createdTime}`
  ].join("\n");
  const html = `
    <h2>New Contact Inquiry</h2>
    <p><strong>Full Name:</strong> ${inquiry.fullName}</p>
    <p><strong>Email:</strong> ${inquiry.email}</p>
    <p><strong>Phone:</strong> ${inquiry.phone || "-"}</p>
    <p><strong>Subject:</strong> ${inquiry.subject || "-"}</p>
    <p><strong>Message:</strong> ${inquiry.message}</p>
    <p><strong>Created Time:</strong> ${createdTime}</p>
  `;

  return sendEmail({ subject, text, html });
}

module.exports = {
  sendEmail,
  sendBookingNotification,
  sendInquiryNotification
};
