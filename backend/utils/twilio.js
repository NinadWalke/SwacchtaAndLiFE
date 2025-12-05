const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(to, body) {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${to}`, // India format (adjust if global)
    });

    console.log("SMS sent:", message.sid);
    return message;
  } catch (err) {
    console.error("Twilio SMS Error:", err);
    throw err;
  }
}

module.exports = { sendSMS };
