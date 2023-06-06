const Env = require("../env");

const request = require("request");

const SG_API_KEY = Env.SENDGRID_API_KEY;
const SUPPORT_SG_MAIL = "support@sableassent.net";
const sendgridUrl = 'https://api.sendgrid.com/v3/mail/send';

const passwordResetTemplate = 'd-36b9ffb4796a4645bbb5d7da0e27a284'
const contactUsTemplate     = 'd-ecb6bab141a743648e7264fc918144fa'

const headers = {
    "Authorization": `Bearer ${SG_API_KEY}`,
    "content-type": "application/json"
};


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
        url: sendgridUrl,
        headers,
        body:
            { personalizations:
                    [{ to: [ { email: email, name: user.name } ],
                        dynamic_template_data:
                            {
                                OTP: otp ,
                                account_name: user.name
                            },
                        subject: 'Password Reset Help' } ],
                from: { email: SUPPORT_SG_MAIL, name: 'Sable Assent' },
                reply_to: { email: 'support@sableaccent.co', name: 'Sable Assent' },
                template_id: passwordResetTemplate},
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
        url: sendgridUrl,
        headers,
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
                from: { email: SUPPORT_SG_MAIL, name: 'Sable Assent' },
                reply_to: { email: user_email, name: user_name },
                template_id: contactUsTemplate },
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




