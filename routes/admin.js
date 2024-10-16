const express = require('express');
const connection = require('../db'); // Your database connection

const router = express.Router();

// Fetch all pending payments for manual verification
router.get('/payments', (req, res) => {
    const sql = `SELECT * FROM registrations WHERE paymentStatus = 'pending'`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching payments:', err);
            return res.status(500).json({ success: false, message: 'Error fetching payments.' });
        }

        res.status(200).json(results);
    });
});

// Update payment status manually
router.post('/payment/:id/status', (req, res) => {
    const { status } = req.body;  // Expecting 'verified' or 'rejected'
    const paymentId = req.params.id;

    // Validate the status input
    if (!['verified', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status provided.' });
    }

    const sql = `UPDATE registrations SET paymentStatus = ? WHERE registration_id = ?`;

    connection.query(sql, [status, paymentId], (err, result) => {
        if (err) {
            console.error('Error updating payment status:', err);
            return res.status(500).json({ success: false, message: 'Error updating payment status.' });
        }

        res.status(200).json({ success: true, message: `Payment status updated to '${status}'` });
    });
});

module.exports = router;
