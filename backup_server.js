require('dotenv').config(); // Make sure this is at the top of your file

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const express = require('express');
const bodyParser = require('body-parser');
const registrationRoutes = require('./routes/registration');
const paymentRoutes = require('./routes/payment');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', registrationRoutes);
app.use('/api', paymentRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
