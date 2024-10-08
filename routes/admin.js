const express = require('express');
const connection = require('../db'); // Your database connection

const router = express.Router();

// Fetch all pending payments
router.get('/payments', (req, res) => { // Shortened path to just '/payments'
    const sql = `SELECT * FROM registrations WHERE paymentStatus = 'pending-verification'`; // Adjusted table name

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching payments:', err);
            return res.status(500).json({ success: false, message: 'Error fetching payments.' });
        }

        res.status(200).json(results);
    });
});

// Update payment status
router.post('/payment/:id/status', (req, res) => { // Simplified route path
    const { status } = req.body;
    const paymentId = req.params.id;

    const sql = `UPDATE registrations SET paymentStatus = ? WHERE id = ?`; // Adjusted table name

    connection.query(sql, [status, paymentId], (err, result) => {
        if (err) {
            console.error('Error updating payment status:', err);
            return res.status(500).json({ success: false, message: 'Error updating payment status.' });
        }

        res.status(200).json({ success: true, message: 'Payment status updated.' });
    });
});

module.exports = router;
