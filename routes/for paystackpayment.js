const express = require('express');
const router = express.Router(); // Ensure router is defined
const connection = require('../db'); // Your database connection

// Handle EFT Payment Form Submission
router.post('/submit-eft-payment', (req, res) => {
  const { reference, email, course, amountPaid, firstName, lastName, program, startDate, location, registrationFee } = req.body; // Pull data from form

  // Add console logs for debugging
  console.log('Incoming data:', req.body);
  console.log('Reference:', reference);
  console.log('Email:', email);
  console.log('Course:', course);
  console.log('Amount Paid:', amountPaid);
  console.log('First Name:', firstName);
  console.log('Last Name:', lastName);
  console.log('Program:', program);
  console.log('Start Date:', startDate);
  console.log('Location:', location);
  console.log('Registration Fee:', registrationFee);

  // Validation logic (ensure reference and amountPaid are not empty)
  if (!reference || reference.trim() === "" || !amountPaid || isNaN(amountPaid)) {
    console.log('Validation failed: Missing reference or invalid amount.');
    return res.status(400).json({ success: false, message: 'Payment reference and valid amount are required.' });
  }

  // Insert EFT payment details into the database
  const sql = `
      INSERT INTO registrations (reference_number, email, course, amountPaid, firstName, lastName, program, startDate, location, registrationFee, paymentStatus)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending-verification')
  `;

  const values = [reference, email, course, amountPaid, firstName, lastName, program, startDate, location, registrationFee];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving payment:', err);
      return res.status(500).json({ success: false, message: 'Error saving payment information.' });
    }

    // Log the result for debugging
    console.log('Payment saved successfully:', result);

    // Ensure redirection logic is properly handled in the frontend
    res.status(200).json({ success: true, message: 'Payment details submitted successfully. Awaiting verification.' });
  });
});

module.exports = router;
