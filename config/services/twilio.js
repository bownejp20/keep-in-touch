// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure

const client = require("twilio")(process.env.Account_Sid, process.env.Auth_Token);

const Reminder = class {
  constructor(to, message) {
    this.to = to,
      this.message = message?? "This is a reminder"
      console.log(to, 'twilio number', message, "message")
  }
  sendReminder() {
    client.messages
      .create({ body: this.message, from: process.env.Twilio_Number, to: this.to })
      .then(message => console.log(message))
      .catch(error => console.log(error))
  }
}


module.exports = {Reminder};