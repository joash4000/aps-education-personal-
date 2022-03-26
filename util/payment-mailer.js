const ejs = require('ejs');
const path = require('path');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID.trim());

module.exports = (user) => {
    ejs.renderFile(path.join(path.dirname(process.mainModule.filename), 'views', 'email', 'paid.ejs'), { errorMessage: 'Payment Successful', user }, function(err, data) {
        if (err) {
            throw new Error(err);
        } else {
            const mainOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Payment Confirmation',
                html: data
            };
            sgMail.send(mainOptions)
                .then(sgData => {
                    console.log("Email Sent");
                }).catch(e => {
                    console.log(e.response.body);
                });
        }
    });
}