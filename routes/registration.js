const express = require('express');
const router = express.Router();
const connection = require('../db');
const validator = require('validator');
const sanitizeRequestData = require('../helpers/sanitize');

// Define your course details, including the corresponding course_id, registration_fee, and total_fee
const courseDetails = {
    'Nail Tech': { course_id: 1, registration_fee: 250, total_fee: 1000 },
    'Wig Installation': { course_id: 2, registration_fee: 300, total_fee: 1500 },
    'Pedicure and Manicure': { course_id: 3, registration_fee: 200, total_fee: 1200 },
    // Add more courses as needed
};

// Handle registration form submissions
router.post('/submit-registration', (req, res) => {
    const sanitizedData = sanitizeRequestData(req.body);
    const { name, email, phone, address, course, start_date, schedule_type, additional_info } = sanitizedData;

    // Validation logic...
    if (!name || !name.trim() || !email || !email.trim() || !phone || !phone.trim() || !course || !course.trim() || !start_date || !start_date.trim() || !schedule_type || !schedule_type.trim()) {
        console.log('Validation Failed: Missing Required Fields');
        return res.status(400).send('All required fields must be filled.');
    }

    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
        return res.status(400).send('Name must be between 2 and 50 characters and contain only letters and spaces.');
    }

    const isValidEmail = validator.isEmail(email);
    if (!isValidEmail) {
        return res.status(400).send('Invalid email format.');
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).send('Phone number must be between 10 and 15 digits and contain only numbers.');
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const inputDate = new Date(start_date);
    const today = new Date();
    if (!dateRegex.test(start_date) || inputDate <= today) {
        return res.status(400).send('Start date must be in the future and in YYYY-MM-DD format.');
    }

    if (!courseDetails[course]) {
        return res.status(400).send('Selected course is not valid.');
    }

    // Extract course details
    const { course_id, registration_fee, total_fee } = courseDetails[course];

    // Insert into DB, including course_id, registration_fee, and total_fee
    const sql = `
      INSERT INTO registrations 
      (name, email, phone, address, course, start_date, schedule_type, paymentStatus, additional_info, course_id, registration_fee, total_fee, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, NOW())
    `;
    connection.query(sql, [name, email, phone, address, course, start_date, schedule_type, additional_info, course_id, registration_fee, total_fee], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error saving registration data');
        }
        res.status(200).send('Registration submitted successfully');
    });
});

module.exports = router;
