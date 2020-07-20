const nodemailer = require('nodemailer');

/**
 * Create a SMTP nodemailer transport for sending mails.
 * Temporary mailtrap credentials TODO: Add actual credentials
 */
const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "829ace89a6c30b",
        pass: "53940fa6babf89"
    }
});


/**
 * Send password reset email to user
 * @param user  {string}
 * @param email {string}
 * @param otp   {string}
 * @returns     {Promise<any>}
 */
module.exports.sendPasswordResetMail = async function(user, email, otp) {

    const mailOptions = {
        from: '"Sable Assent👻" <info@sableassent.co>',
        to: `${email}`,
        subject: 'Password Reset help',
        text: `Hey, you (or someone else) requested a password reset. Enter the following otp into the app to continue.` +
                `\n ${otp} \n` +
                `If this was not you, you can safely ignore this email`,
    };

    return transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}