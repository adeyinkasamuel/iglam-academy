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

    // Update the "Amount Paid" input field with the calculated fee (without ZAR)
    document.getElementById('amountPaid').value = finalFee.toFixed(2);

    console.log('Selected Payment Option:', selectedPaymentOption); // Log selected payment option
    console.log('Final Fee:', finalFee); // Log the calculated final fee for debugging
}

// Attach event listener for form submission
document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmission);

// Handle the payment submission
function handlePaymentSubmission(event) {
    event.preventDefault(); // Prevent default form submission

    // Fetch form field values directly
    const reference = document.getElementById('reference').value.trim();
    const amountPaid = parseFloat(document.getElementById('amountPaid').value.trim()); // Ensure it's a number
    const email = document.getElementById('email').value.trim();
    const course = document.getElementById('course').value.trim();

    // Log form data for debugging
    console.log(`Form Submitted. Reference: ${reference}, Amount: ${amountPaid}, Email: ${email}, Course: ${course}`);

    if (selectedPaymentOption && reference && !isNaN(amountPaid)) {
        displayMessage('Submitting your payment details. Please wait...');

        // Manually create form data
        const formData = new URLSearchParams(); // Use URLSearchParams to properly format the data
        formData.append('reference', reference);
        formData.append('amountPaid', amountPaid); // Ensure it's a number
        formData.append('email', email);
        formData.append('course', course);

        fetch('http://127.0.0.1:3000/api/payment/submit-eft-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Proper content-type for form data
            },
            body: formData.toString() // Convert formData to query string
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data); // Log the server response

            if (data.success) {
                console.log('Redirection to success page triggered.');
                localStorage.setItem('totalPaid', amountPaid); // Store amountPaid in localStorage
                window.location.href = 'registration-successful.html'; 
            } else {
                displayMessage('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error in submission:', error); // Log fetch error
            displayMessage('Error submitting payment details: ' + error.message);
        });
    } else {
        displayMessage('Please complete all fields before submitting the form.');
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
