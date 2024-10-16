const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'finance.iglamacademy@gmail.com', // Your Gmail account
    pass: 'wvvk bmeg rmco qrji',       // The app password you generated
  },
});

// Function to send an email
const sendPaymentConfirmation = (toEmail, course, amount) => {
  const mailOptions = {
    from: 'finance.iglamacademy@gmail.com',  // Sender email
    to: toEmail,                      // Recipient email
    subject: 'Payment Confirmation',  // Subject line
    text: `Dear Learner,

    We have successfully received your payment of R${amount} for the ${course} course.

    Your registration is now confirmed, and we look forward to seeing you in class soon!

    Regards,
    iGlam Academy`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = sendPaymentConfirmation;

