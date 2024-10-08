// JavaScript for handling payment options and processing payments

// Retrieve data from local storage to display dynamic values
const selectedCourses = JSON.parse(localStorage.getItem('selectedCourses')) || [];
const originalTotal = parseFloat(localStorage.getItem('originalTotal')) || 0;
const totalFee = parseFloat(localStorage.getItem('totalFee')) || 0;

// Calculate total registration fee
let registrationFee = 0;
selectedCourses.forEach(course => {
    if (course.course !== 'Test Course') {
        registrationFee += parseInt(course.regfee); 
    }
});

// Set values in HTML elements
document.getElementById('selectedCourses').textContent = selectedCourses.map(course => course.course).join(', ');
document.getElementById('totalFeeDisplay').textContent = totalFee.toFixed(2);
document.getElementById('originalTotalDisplay').textContent = originalTotal.toFixed(2);
document.getElementById('registrationFee').textContent = registrationFee.toFixed(2);

// Initialize selected payment option
let selectedPaymentOption = '';

// Handle the change in payment options
function handleCheckboxChange() {
    const fullPayment = document.getElementById('fullPaymentCheckbox').checked;
    const partialPayment = document.getElementById('partialPaymentCheckbox').checked;
    const registrationOnly = document.getElementById('registrationOnlyCheckbox').checked;

    // Only allow one payment option to be selected at a time
    if (fullPayment) {
        document.getElementById('partialPaymentCheckbox').checked = false;
        document.getElementById('registrationOnlyCheckbox').checked = false;
        selectedPaymentOption = 'full';
        document.getElementById('payButton').textContent = "Proceed with Full Payment";
    } else if (partialPayment) {
        document.getElementById('fullPaymentCheckbox').checked = false;
        document.getElementById('registrationOnlyCheckbox').checked = false;
        selectedPaymentOption = 'partial';
        document.getElementById('payButton').textContent = "Proceed with Partial Payment";
    } else if (registrationOnly) {
        document.getElementById('fullPaymentCheckbox').checked = false;
        document.getElementById('partialPaymentCheckbox').checked = false;
        selectedPaymentOption = 'registration';
        document.getElementById('payButton').textContent = "Proceed with Registration Fee Payment";
    } else {
        selectedPaymentOption = '';
        document.getElementById('payButton').textContent = "Pay Now";
    }

    console.log('Selected Payment Option:', selectedPaymentOption); // Log selected payment option
}

// Handle the payment process
function handlePayment() {
    if (!selectedPaymentOption) {
        displayMessage('Please select a payment option.');
        return;
    }

    let paymentAmount = 0;
    if (selectedPaymentOption === 'full') {
        paymentAmount = parseFloat(totalFee) + parseFloat(registrationFee);
    } else if (selectedPaymentOption === 'partial') {
        paymentAmount = parseFloat(totalFee) * 0.5 + parseFloat(registrationFee);
    } else if (selectedPaymentOption === 'registration') {
        paymentAmount = parseFloat(registrationFee);
    }

    console.log('Payment Amount:', paymentAmount); // Log the payment amount for debugging
    processEFTPayment(paymentAmount);
}

// Simulate EFT payment process by showing banking details
function processEFTPayment(amount) {
    const message = `
        Thank you for choosing to pay via EFT. Please use the following details to complete your payment:

        - Amount to pay: R${amount.toFixed(2)}
        - Account Name: iGlam Beauty Lounge
        - Account Number: 63112320667
        - Bank: FNB
        - Branch Code: 250655

        Please upload proof of payment when ready.
    `;
    displayMessage(message);

    // Show payment reference form for user to upload proof
    document.getElementById('paymentDetails').style.display = 'block';
}

// Function for handling form submission using Fetch API
function handlePaymentSubmission(event) {
    event.preventDefault(); // Prevent default form submission

    if (selectedPaymentOption) {
        displayMessage('Submitting your payment details. Please wait...');

        const form = document.getElementById('paymentForm');
        const formData = new FormData(form);

        console.log('Form Data:', formData); // Log FormData for debugging

        // Submit the form using Fetch API
        fetch('http://127.0.0.1:3000/api/payment/submit-eft-payment', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            // Log the full response to check its content
            console.log('Full fetch response:', response);
            
            if (!response.ok) {
                // Log status and statusText to understand why it failed
                console.log('Fetch failed with status:', response.status, response.statusText);
                throw new Error('Network response was not ok');
            }

            // Log the response type (to ensure it is JSON)
            console.log('Fetch response type:', response.headers.get('content-type'));

            return response.json(); // Ensure this is the correct response type
        })
        .then(data => {
            // Log the parsed response data
            console.log('Data received:', data);

            // Check for success and trigger redirection
            if (data.success) {
                console.log('Redirection logic triggered');
                window.location.href = 'registration-successful.html'; // Redirect immediately
            } else {
                displayMessage('Error: ' + data.message);
            }
        })
        .catch(error => {
            // Log any errors that occur during the fetch process
            console.log('Error occurred during fetch:', error); 
            displayMessage('Error submitting payment details: ' + error.message);
        });
    } else {
        displayMessage('Please select a payment option before submitting the form.');
    }
}

// Function to display messages to the user
function displayMessage(message) {
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.style.display = 'block';
    alertMessage.textContent = message;

    // Hide the message after 5 seconds
    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 5000);
}
