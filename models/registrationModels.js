const connection = require('../db'); // Database connection

// Insert new registration into the database
const createRegistration = (data, callback) => {
    const sql = `
        INSERT INTO registrations 
        (name, email, phone, address, course, start_date, schedule_type, paymentStatus, additional_info, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())
    `;
    const params = [
        data.name, data.email, data.phone, data.address, 
        data.course, data.start_date, data.schedule_type, data.additional_info
    ];

    connection.query(sql, params, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Verify if a registration already exists
const getRegistrationByEmailAndCourse = (email, course, callback) => {
    const sql = `SELECT * FROM registrations WHERE email = ? AND course = ?`;
    connection.query(sql, [email, course], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Update registration payment status
const updatePaymentStatus = (email, course, callback) => {
    const sql = `UPDATE registrations SET paymentStatus = 'paid' WHERE email = ? AND course = ?`;
    connection.query(sql, [email, course], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

module.exports = {
    createRegistration,
    getRegistrationByEmailAndCourse,
    updatePaymentStatus
};
