// // // import nodemailer from 'nodemailer';
// // // import {
// // //     EMAIL_VERIFY_TEMPLATE,
// // //     PASSWORD_RESET_TEMPLATE
// // // } from '../config/EmailTemplates.js';
// // // import 'dotenv/config';

// // // const transport = nodemailer.createTransport({
// // //     host:"smtp.gmail.com",
// // //     port: 587,
// // //     secure: false,
// // //     auth: {
// // //         user: process.env.MAIL_USER,
// // //         pass: process.env.MAIL_PASS
// // //     }
// // // })

// // // const sendMail = async (options) => {
// // //     try {
// // //         const info = await transport.sendMail({
// // //             from: process.env.MAIL_USER,
// // //             ...options
// // //         });
// // //         console.log("Mail sent:", info.messageId);
// // //     } catch (error) {
// // //         console.error("Mail error:", error);
// // //     }
// // // };

// // // export const sendWelcomeMail = (email) =>
// // //     sendMail({
// // //         to: email,
// // //         subject: 'Welcome to Menzo Mens Wear',
// // //         text: `Account created with ${email}\nThank you for registering!`
// // //     })

// // // export const sendOtpMail = (email, otp) =>
// // //     sendMail({
// // //         to: email,
// // //         subject: 'Account verification OTP',
// // //         html: EMAIL_VERIFY_TEMPLATE
// // //             .replace('{{otp}}', otp)
// // //             .replace('{{email}}', email)
// // //     })

// // export const resetOtpMail = (email, otp) =>
// //     sendMail({
// //         to: email,
// //         subject: 'Password Reset OTP',
// //         html: PASSWORD_RESET_TEMPLATE
// //             .replace('{{otp}}', otp)
// //             .replace('{{email}}', email)
// //     })


// // import nodemailer from "nodemailer";
// // import 'dotenv/config';

// // const transporter = nodemailer.createTransport({
// //   host: "smtp-relay.brevo.com",
// //   port: 587,
// //   secure: false,
// //   auth: {
// //     user: "a20188001@smtp-brevo.com",  // Your SMTP login email
// //     pass: "xsmtpsib-493e5bbf62c858e94f78d3fbf0b2d6b841f8b2ee1bd8389504ea6ee44ba02066-yNZPG5Gk5OTUIWJD"  // Your SMTP key
// //   },
// // });

// // // Or if you prefer using environment variables:
// // // Make sure your .env file has these exact names:
// // // BREVO_SMTP_USER=a20188001@smtp-brevo.com
// // // BREVO_SMTP_KEY=xsmtpsib-...your-key-here

// // const transporterWithEnv = nodemailer.createTransport({
// //   host: "smtp-relay.brevo.com",
// //   port: 587,
// //   secure: false,
// //   auth: {
// //     user: process.env.BREVO_SMTP_USER,
// //     pass: process.env.BREVO_SMTP_KEY 
// //   },

  
// // });

// // export const sendWelcomeMail = async (email, name) => {
// //   return await transporter.sendMail({
// //     from: `"MENZO" <${process.env.BREVO_EMAIL}>`,
// //     to: email,
// //     subject: "Welcome to MENZO 👋",
// //     html: `
// //       <h2>Hello ${name}</h2>
// //       <p>Your account has been created successfully.</p>
// //     `,
// //   });
// // };

// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_FROM,
//     pass: process.env.BREVO_API_KEY
//   },
// });


// export const sendWelcomeMail = async (email, name) => {
//   try {
//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_FROM,  // SIMPLE STRING - NO DISPLAY NAME
//       to: email,
//       subject: "Welcome to MENZO 👋",
//       html: `
//         <h2>Hello ${name}</h2>
//         <p>Your account has been created successfully.</p>
//       `,
//     });
//     console.log("✅ Email sent:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("❌ Email error:", error.message);
//     throw error;
//   }
// };


// sendMail.js
// const axios = require("axios");

import axios from "axios";

export const sendWelcomeEmail = async (email,name) => {
  try {

    

    
    const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }
        .header {
          background: #6366f1;
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: 2px;
        }
        .content {
          padding: 30px;
        }
        .content h2 {
          color: #333;
          font-size: 20px;
          margin-top: 0;
        }
        .content p {
          color: #555;
          margin: 15px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #6366f1;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .info-box {
          background: #f9f9f9;
          padding: 15px;
          border-left: 3px solid #6366f1;
          margin: 20px 0;
        }
        .footer {
          background: #f4f4f4;
          padding: 20px;
          text-align: center;
          color: #777;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>MENZO</h1>
          <p style="margin: 5px 0 0 0;">Welcome Aboard! 🎉</p>
        </div>
        
        <div class="content">
          <h2>Hello ${name},</h2>
          
          <p>Thank you for joining Menzo! Your account has been successfully created and you're ready to get started.</p>
          
          <p>We're excited to have you as part of our community!</p>
          
          <p style="text-align: center;">
            <a href="#" class="button">Get Started</a>
          </p>
          
          <div class="info-box">
            <strong>Your Account Details:</strong><br><br>
            <strong>Email:</strong> ${email}<br>
            <strong>Registered:</strong> ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          
          <p>If you have any questions, feel free to reach out. We're here to help!</p>
          
          <p>Best regards,<br>
          <strong>The Menzo Team</strong></p>
        </div>
        
        <div class="footer">
          <p>This email was sent to ${email}</p>
          <p>If you didn't create this account, please ignore this email.</p>
          <p style="margin-top: 15px;">© ${new Date().getFullYear()} Menzo. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name:"Menzo", email: process.env.EMAIL_USER },
        to: [{ email, name }],
        subject: "Welcome to MENZO !!!",
        htmlContent: htmlContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error("Status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    console.error("Error message:", error.message);
    throw error;
  }
};

// module.exports = { sendWelcomeEmail };