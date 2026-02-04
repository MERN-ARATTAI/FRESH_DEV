import nodemailer from 'nodemailer';
import {
    EMAIL_VERIFY_TEMPLATE,
    PASSWORD_RESET_TEMPLATE
} from '../config/EmailTemplates.js';
import 'dotenv/config';

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

const sendMail = (options) => transport.sendMail({
    from: process.env.MAIL_USER,
    ...options
})

export const sendWelcomeMail = (email) =>
    sendMail({
        to: email,
        subject: 'Welcome to Dressxx',
        text: `Account created with ${email}\nThank you for registering!`
    })

export const sendOtpMail = (email, otp) =>
    sendMail({
        to: email,
        subject: 'Account verification OTP',
        html: EMAIL_VERIFY_TEMPLATE
            .replace('{{otp}}', otp)
            .replace('{{email}}', email)
    })

export const resetOtpMail = (email, otp) =>
    sendMail({
        to: email,
        subject: 'Password Reset OTP',
        html: PASSWORD_RESET_TEMPLATE
            .replace('{{otp}}', otp)
            .replace('{{email}}', email)
    })
