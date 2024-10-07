const express = require('express');
const multer = require('multer'); // For handling file uploads
const path = require('path');
const connection = require('../db'); // Your database connection

const router = express.Router();

// Configure multer for file uploads (Proof of Payment)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/proof-of-payment'); // Save in this folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with timestamp to avoid name conflicts
  }
});

const upload = multer({ storage: storage });

// Handle EFT Payment Form Submission
router.post('/submit-eft-payment', upload.single('proof'), (req, res) => {
  const { reference, email = 'user@example.com', course = 'Nail Tech' } = req.body; // Pull email and course from form
  
  const proofOfPayment = req.file ? req.file.filename : null; // Get the uploaded file (if exists)

  // Validation logic (ensure reference is not empty)
  if (!reference || reference.trim() === "") {
    return res.status(400).send('Payment reference is required.');
  }

  // Insert EFT payment details into the database
  const sql = `UPDATE registrations SET paymentStatus = 'pending-verification', paymentReference = ?, proofOfPayment = ? WHERE email = ? AND course = ?`;

  connection.query(sql, [reference, proofOfPayment, email, course], (err, result) => {
    if (err) {
      console.error('Error updating payment:', err);
      return res.status(500).send('Error saving payment information.');
    }
    res.status(200).send('Payment details submitted successfully. Awaiting verification.');
  });
});

module.exports = router;
