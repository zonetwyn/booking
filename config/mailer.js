const nodemailer = require('nodemailer');
const keys = require('../config/keys');
const consolidate = require('consolidate');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: keys.mailer.email,
        pass: keys.mailer.password
    }
});

const mailer = (to, subject, html) => {
    return transporter.sendMail({
        from: keys.mailer.email,
        to: to,
        subject: subject,
        html: html
    });
}

const cons = (file, locals) => {
    const filePath = path.join(__dirname, '../', 'templates', file);
    return consolidate.ejs(filePath, locals);
}

module.exports = { mailer, cons };