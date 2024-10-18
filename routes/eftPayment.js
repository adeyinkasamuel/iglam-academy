const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post('/submit-eft-payment', (req, res) => {
  const {
    reference,
    email,
    course,
    amountPaid,
    firstName,
    lastName,
    program,
    startDate,
    location,
    registrationFee
  } = req.body;

  console.log('Incoming data:', req.body);

  const fullName = `${firstName} ${lastName}`;

  if (!reference || reference.trim() === "" || !amountPaid || isNaN(amountPaid)) {
    console.log('Validation failed: Missing reference or invalid amount.');
    return res.status(400).json({ success: false, message: 'Payment reference and valid amount are required.' });
  }

  const sql = `
  INSERT INTO registrations (
    reference_number,
    email,
    course,
    amountPaid,
    name,
    schedule_type,
    start_date,
    location,
    registrationFee,
    paymentStatus
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending-verification')
`;

const values = [
reference,
email,
course,
amountPaid,
fullName,
program,
startDate,
location,
registrationFee
];

connection.query(sql, values, (err, result) => {
if (err) {
  console.error('Error saving payment:', err);
  return res.status(500).json({ success: false, message: 'Error saving payment information.' });
}

console.log('Payment saved successfully:', result);
res.status(200).json({ success: true, message: 'Payment details submitted successfully. Awaiting verification.' });
});


  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving payment:', err);
      return res.status(500).json({ success: false, message: 'Error saving payment information.' });
    }

    console.log('Payment saved successfully:', result);

    res.status(200).json({ success: true, message: 'Payment details submitted successfully. Awaiting verification.' });
  });
});

module.exports = router;
