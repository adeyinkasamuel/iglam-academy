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

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/; // Allow specific file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: File type not supported.');
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

// Handle EFT Payment Form Submission
router.post('/submit-eft-payment', upload.single('proof'), (req, res) => {
  const { reference, email = 'user@example.com', course = 'Nail Tech', amountPaid } = req.body; // Pull email, course, and amountPaid from form
  const proofOfPayment = req.file ? req.file.filename : null; // Get the uploaded file (if exists)

  // Add console logs for debugging
  console.log('Reference:', reference);
  console.log('Email:', email);
  console.log('Course:', course);
  console.log('Amount Paid:', amountPaid);
  console.log('Proof of Payment:', proofOfPayment);

  // Validation logic (ensure reference and amountPaid are not empty)
  if (!reference || reference.trim() === "" || !amountPaid || isNaN(amountPaid)) {
    return res.status(400).json({ success: false, message: 'Payment reference and valid amount are required.' });
  }

  // Insert EFT payment details into the database
  const sql = `
      INSERT INTO payments (email, course, paymentReference, amountPaid, proofOfPayment, paymentStatus)
      VALUES (?, ?, ?, ?, ?, 'pending-verification')
  `;

  connection.query(sql, [email, course, reference, amountPaid, proofOfPayment], (err, result) => {
    if (err) {
      console.error('Error saving payment:', err);
      return res.status(500).json({ success: false, message: 'Error saving payment information.' });
    }

    res.status(200).json({ success: true, message: 'Payment details submitted successfully. Awaiting verification.' });
  });
});

module.exports = router;
