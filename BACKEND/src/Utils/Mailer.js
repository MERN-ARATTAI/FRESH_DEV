// // import nodemailer from 'nodemailer';
// // import {
// //     EMAIL_VERIFY_TEMPLATE,
// //     PASSWORD_RESET_TEMPLATE
// // } from '../config/EmailTemplates.js';
// // import 'dotenv/config';

// // const transport = nodemailer.createTransport({
// //     host:"smtp.gmail.com",
// //     port: 587,
// //     secure: false,
// //     auth: {
// //         user: process.env.MAIL_USER,
// //         pass: process.env.MAIL_PASS
// //     }
// // })

// // const sendMail = async (options) => {
// //     try {
// //         const info = await transport.sendMail({
// //             from: process.env.MAIL_USER,
// //             ...options
// //         });
// //         console.log("Mail sent:", info.messageId);
// //     } catch (error) {
// //         console.error("Mail error:", error);
// //     }
// // };

// // export const sendWelcomeMail = (email) =>
// //     sendMail({
// //         to: email,
// //         subject: 'Welcome to Menzo Mens Wear',
// //         text: `Account created with ${email}\nThank you for registering!`
// //     })

// // export const sendOtpMail = (email, otp) =>
// //     sendMail({
// //         to: email,
// //         subject: 'Account verification OTP',
// //         html: EMAIL_VERIFY_TEMPLATE
// //             .replace('{{otp}}', otp)
// //             .replace('{{email}}', email)
// //     })

// export const resetOtpMail = (email, otp) =>
//     sendMail({
//         to: email,
//         subject: 'Password Reset OTP',
//         html: PASSWORD_RESET_TEMPLATE
//             .replace('{{otp}}', otp)
//             .replace('{{email}}', email)
//     })
import nodemailer from "nodemailer";
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "a20188001@smtp-brevo.com",  // Your SMTP login email
    pass: "xsmtpsib-493e5bbf62c858e94f78d3fbf0b2d6b841f8b2ee1bd8389504ea6ee44ba02066-yNZPG5Gk5OTUIWJD"  // Your SMTP key
  },
});

// Or if you prefer using environment variables:
// Make sure your .env file has these exact names:
// BREVO_SMTP_USER=a20188001@smtp-brevo.com
// BREVO_SMTP_KEY=xsmtpsib-...your-key-here

const transporterWithEnv = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY 
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
