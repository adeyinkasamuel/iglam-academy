const mysql = require('mysql2');
require('dotenv').config(); // To load environment variables from the .env file

// Create the connection to MySQL database
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'iglam_registration' // Replace with your actual database name
});

// Check if the connection is successful
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

module.exports = connection; // Export the connection to use in other files
