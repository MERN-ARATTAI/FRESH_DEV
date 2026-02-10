// import nodemailer from 'nodemailer';
// import {
//     EMAIL_VERIFY_TEMPLATE,
//     PASSWORD_RESET_TEMPLATE
// } from '../config/EmailTemplates.js';
// import 'dotenv/config';

// const transport = nodemailer.createTransport({
//     host:"smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS
//     }
// })

// const sendMail = async (options) => {
//     try {
//         const info = await transport.sendMail({
//             from: process.env.MAIL_USER,
//             ...options
//         });
//         console.log("Mail sent:", info.messageId);
//     } catch (error) {
//         console.error("Mail error:", error);
//     }
// };

// export const sendWelcomeMail = (email) =>
//     sendMail({
//         to: email,
//         subject: 'Welcome to Menzo Mens Wear',
//         text: `Account created with ${email}\nThank you for registering!`
//     })

// export const sendOtpMail = (email, otp) =>
//     sendMail({
//         to: email,
//         subject: 'Account verification OTP',
//         html: EMAIL_VERIFY_TEMPLATE
//             .replace('{{otp}}', otp)
//             .replace('{{email}}', email)
//     })

// export const resetOtpMail = (email, otp) =>
//     sendMail({
//         to: email,
//         subject: 'Password Reset OTP',
//         html: PASSWORD_RESET_TEMPLATE
//             .replace('{{otp}}', otp)
//             .replace('{{email}}', email)
//     })
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,     // login email
    pass: process.env.BREVO_SMTP_KEY,  // smtp key
  },
});

export const sendWelcomeMail = async (email, name) => {
  return await transporter.sendMail({
    from: `"MENZO" <${process.env.BREVO_EMAIL}>`,
    to: email,
    subject: "Welcome to MENZO 👋",
    html: `
      <h2>Hello ${name}</h2>
      <p>Your account has been created successfully.</p>
    `,
  });
};
