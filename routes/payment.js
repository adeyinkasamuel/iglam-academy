const express = require('express');
const router = express.Router();
const axios = require('axios');
const connection = require('../db');
require('dotenv').config(); // Load the environment variables

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // Use the secret key from .env

// Handle payment verification
router.post('/verify-payment', async (req, res) => {
  const { reference } = req.body;

  try {
    // Verify payment with Paystack using the reference
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` // Use the environment variable key
      }
    });

    const paymentData = response.data.data;

    // Log the payment data for debugging purposes
    console.log('Payment Data:', paymentData);

    // Check if the payment was successful
    if (paymentData.status === 'success') {
      // Ensure that the metadata and course exist
      if (!paymentData.metadata || !paymentData.metadata.course) {
        return res.status(400).send('Course data missing in payment metadata');
      }

      // Update payment status in the database
      const sql = `UPDATE registrations SET paymentStatus = 'paid' WHERE email = ? AND course = ?`;
      connection.query(sql, [paymentData.customer.email, paymentData.metadata.course], (err, result) => {
        if (err) {
          console.error('Error updating payment status:', err);
          return res.status(500).send('Error updating payment status');
        }
        res.status(200).send('Payment verified and registration updated.');
      });
    } else {
      res.status(400).send('Payment verification failed');
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).send('Error verifying payment');
  }
});

module.exports = router;
