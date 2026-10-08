import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.EMAIL_USER,
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    refreshToken: config.REFRESH_TOKEN,
  },
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email server connection failed:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"The Choason Tech" <${config.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Registration email
const sendRegistrationEmail = async (userEmail, name) => {
  const subject = "Welcome to The Choason Tech!";

  const text = `
Hello ${name},

Thank you for registering at The Choason Tech.

We're happy to have you with us!

Regards,
The Choason Tech Team
`;

  const html = `
    <div>
      <h2>Welcome to The Choason Tech!</h2>

      <p>Hello ${name},</p>

      <p>
        Thank you for registering at <strong>The Choason Tech</strong>.
      </p>

      <p>We're happy to have you with us!</p>

      <br />

      <p>
        Regards,<br />
        <strong>The Choason Tech Team</strong>
      </p>
    </div>
  `;

  return await sendEmail(userEmail, subject, text, html);
};

const sendTransactionEmail = async (userEmail, name, amount, toAccount) => {
  const subject = "Transaction update from The Choason Tech!";
  const text = `Hello ${name}, /n/n your transaction of amount ${amount} to account ${toAccount} has been successfully processed. /n/n Regards, /n The Choason Tech Team`;
  const html = `<p> ${name} </p> <p> your transaction is succcessfully processed </p> `;
  return await sendEmail(userEmail, subject, text, html);
};

const sendTransactionFailureEmail = async (
  userEmail,
  name,
  amount,
  toAccount,
) => {
  const subject = "Transaction Failure Notification from The Choason Tech!";
  const text = `Hello ${name}, /n/n your transaction of amount ${amount} to account ${toAccount} has failed. Please try again or contact support for assistance. /n/n Regards, /n The Choason Tech Team`;
  const html = `<p> ${name} </p> <p> your transaction has failed. Please try again or contact support for assistance. </p> `;
  return await sendEmail(userEmail, subject, text, html);
};

export {
  sendEmail,
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};
