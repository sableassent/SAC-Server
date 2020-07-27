const nodemailer = require('nodemailer');
const request = require("request");

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
 * @param user  {User}
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

const SG_API_KEY = process.env.SENDGRID_API_KEY;

/**
 * Send password reset email to user
 * @param user  {User}
 * @param email {string}
 * @param otp   {string}
 * @param callback {function}
 * @returns     {Promise<any>}
 */
module.exports.sendPasswordResetMailSG = function (user, email, otp, callback) {

    let options = { method: 'POST',
        url: 'https://api.sendgrid.com/v3/mail/send',
        headers:
            {
                "Authorization": `Bearer ${SG_API_KEY}`,
                "content-type": "application/json"
            },
        body:
            { personalizations:
                    [{ to: [ { email: email, name: user.name } ],
                        dynamic_template_data:
                            {
                                OTP: otp ,
                                account_name: user.name
                            },
                        subject: 'Password Reset Help' } ],
                from: { email: 'support@sableaccent.co', name: 'Sable Assent' },
                reply_to: { email: 'support@sableaccent.co', name: 'Sable Assent' },
                template_id: 'd-36b9ffb4796a4645bbb5d7da0e27a284' },
        json: true };

    request(options, callback);
}

/**
 * Send contact us email to user
 * @param user_name         {String}
 * @param contact_type      {String}
 * @param user_phone        {string}
 * @param user_email        {String}
 * @param user_message      {String}
 * @param callback          {function}
 * @returns                 {Promise<any>}
 */
module.exports.sendContactUsEmailSG = function (user_name, contact_type, user_phone, user_email, user_message, callback) {

    let options = { method: 'POST',
        url: 'https://api.sendgrid.com/v3/mail/send',
        headers:
            {
                "Authorization": `Bearer ${SG_API_KEY}`,
                "content-type": "application/json"
            },
        body:
            { personalizations:
                    [{ to: [ { email: 'chaitanya@cakesofttech.com', name: 'Sable Accent Admin' } ],
                        dynamic_template_data:
                            {
                                contact_type,
                                user_phone,
                                user_email,
                                user_message,
                                user_name
                            },
                        subject: `Contact Us Request from ${user_name}` } ],
                from: { email: 'support@sableaccent.com', name: 'Sable Assent' },
                reply_to: { email: user_email, name: user_name },
                template_id: 'd-ecb6bab141a743648e7264fc918144fa' },
        json: true };

    request(options, callback);
}


// /**
//  * Send mnemonic to user
//  * @param mnemonic         {String}
//  * @param callback          {function}
//  * @returns                 {Promise<any>}
//  */
// module.exports.sendMnemonicToUser = function (mnemonic, callback) {
//
//     let options = { method: 'POST',
//         url: 'https://api.sendgrid.com/v3/mail/send',
//         headers:
//             {
//                 "Authorization": `Bearer ${SG_API_KEY}`,
//                 "content-type": "application/json"
//             },
//         body:
//             { personalizations:
//                     [{ to: [ { email: 'chaitanya@cakesofttech.com', name: 'Sable Accent Admin' } ],
//                         dynamic_template_data:
//                             {
//                                 mnemonic
//                             },
//                         subject: `Your backup mnemonic for Sable assent wallet` } ],
//                 from: { email: 'support@sableaccent.com', name: 'Sable Assent' },
//                 reply_to: { email: user_email, name: user_name },
//                 template_id: 'd-e0cb589bec4a4221b8df884ed25fd9c8' },
//         json: true };
//
//     request(options, callback);
// }
//




