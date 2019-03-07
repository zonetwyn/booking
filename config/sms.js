const keys = require('./keys');
const client = require('twilio')(keys.twilio.sid, keys.twilio.token);

const sendSMS = (body, to) => {
    return client.messages.create({
        body: body,
        from: keys.twilio.phone,
        to: to
    });
}

module.exports = sendSMS;