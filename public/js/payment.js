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

// Set initial values in HTML elements
document.getElementById('selectedCourses').textContent = selectedCourses.map(course => course.course).join(', ');
document.getElementById('originalTotalDisplay').textContent = `ZAR ${originalTotal.toFixed(2)}`;
document.getElementById('registrationFee').textContent = `ZAR ${registrationFee.toFixed(2)}`;

// Initialize selected payment option
let selectedPaymentOption = '';

// Handle the change in payment options
function handleCheckboxChange() {
    const fullPayment = document.getElementById('fullPaymentCheckbox').checked;
    const partialPayment = document.getElementById('partialPaymentCheckbox').checked;
    const registrationOnly = document.getElementById('registrationOnlyCheckbox').checked;

    let finalFee = 0; // To store the calculated total based on payment selection

    // Only allow one payment option to be selected at a time
    if (fullPayment) {
        document.getElementById('partialPaymentCheckbox').checked = false;
        document.getElementById('registrationOnlyCheckbox').checked = false;
        selectedPaymentOption = 'full';
        finalFee = totalFee + registrationFee; // Full payment is total fee + registration fee
        document.getElementById('payButton').textContent = "Proceed with Full Payment";
    } else if (partialPayment) {
        document.getElementById('fullPaymentCheckbox').checked = false;
        document.getElementById('registrationOnlyCheckbox').checked = false;
        selectedPaymentOption = 'partial';
        finalFee = (totalFee * 0.5) + registrationFee; // Partial payment is 50% of total fee + registration fee
        document.getElementById('payButton').textContent = "Proceed with Partial Payment";
    } else if (registrationOnly) {
        document.getElementById('fullPaymentCheckbox').checked = false;
        document.getElementById('partialPaymentCheckbox').checked = false;
        selectedPaymentOption = 'registration';
        finalFee = registrationFee; // Registration only is just the registration fee
        document.getElementById('payButton').textContent = "Proceed with Registration Fee Payment";
    } else {
        selectedPaymentOption = '';
        document.getElementById('payButton').textContent = "Pay Now";
        finalFee = 0;
    }

    // Update the "Amount Paid" input field with the calculated fee
    document.getElementById('amountPaid').value = `ZAR ${finalFee.toFixed(2)}`;

    console.log('Selected Payment Option:', selectedPaymentOption); // Log selected payment option
    console.log('Final Fee:', finalFee); // Log the calculated final fee for debugging
}

// Handle the payment submission without file upload
function handlePaymentSubmission(event) {
    event.preventDefault(); // Prevent default form submission

    if (selectedPaymentOption) {
        displayMessage('Submitting your payment details. Please wait...');

        const form = document.getElementById('paymentForm');
        const formData = new FormData(form);

        fetch('http://127.0.0.1:3000/api/payment/submit-eft-payment', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'registration-successful.html'; 
            } else {
                displayMessage('Error: ' + data.message);
            }
        })
        .catch(error => {
            displayMessage('Error submitting payment details: ' + error.message);
        });
    } else {
        displayMessage('Please select a payment option before submitting the form.');
    }
}

// Function to display messages
function displayMessage(message) {
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.style.display = 'block';
    alertMessage.textContent = message;

    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 5000);
}
