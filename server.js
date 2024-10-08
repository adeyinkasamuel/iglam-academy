require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS package
const registrationRoutes = require('./routes/registration');
const eftPaymentRoutes = require('./routes/eftPayment'); // Import EFT payment route

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/api/registration', registrationRoutes); // Organized registration route
app.use('/api/payment', eftPaymentRoutes); // Organized payment route

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
