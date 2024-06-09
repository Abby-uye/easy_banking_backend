require('dotenv').config();

const nodemailer = require('nodemailer');
const retry = require('async-retry');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host:"smtp.gmail.com",
    port:465,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendWelcomeEmail = async (email, fullName,subject,text) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });

    // await retry(async (bail) => {
    //     transporter.sendMail(mailOptions, (error, info) => {
    //         if (error) {
    //             if (error.permanent) {
    //                 bail(error);
    //                 return;
    //             }
    //             throw error;
    //         }
    //         return info;
    //     });
    // }, {
    //     retries: 3,
    //     minTimeout: 1000,
    //     factor: 2
    // });
}
module.exports = {
    sendWelcomeEmail
};
