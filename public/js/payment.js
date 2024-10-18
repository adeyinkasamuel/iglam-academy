// JavaScript for handling payment options and processing payments

// Retrieve data from localStorage to display dynamic values
const selectedCourses = JSON.parse(localStorage.getItem('selectedCourses')) || [];
const originalTotal = parseFloat(localStorage.getItem('originalTotal')) || 0;
const totalFee = parseFloat(localStorage.getItem('totalFee')) || 0; // Ensure totalFee is properly retrieved
const basicInfo = JSON.parse(localStorage.getItem('basicInfo')) || {}; // Get basic info (name, email)
const programInfo = JSON.parse(localStorage.getItem('programInfo')) || {}; // Get program info (program and start date)
const selectedLocation = localStorage.getItem('selectedLocation') || ''; // Get location

// Calculate total registration fee (flat fee of 250)
let registrationFee = 250; // Flat fee

// Set initial values in HTML elements
document.getElementById('selectedCourses').textContent = selectedCourses.map(course => course.course).join(', ');
document.getElementById('originalTotalDisplay').textContent = `ZAR ${originalTotal.toFixed(2)}`;
document.getElementById('totalFeeDisplay').textContent = `ZAR ${totalFee.toFixed(2)}`; // Display the special course fee
document.getElementById('registrationFee').textContent = `ZAR ${registrationFee.toFixed(2)}`; // Flat registration fee

// Pre-fill hidden fields with user info from localStorage
document.getElementById('email').value = basicInfo.email || ''; 
document.getElementById('course').value = selectedCourses[0] ? selectedCourses[0].course : ''; 
document.getElementById('firstName').value = basicInfo.firstName || ''; 
document.getElementById('lastName').value = basicInfo.lastName || ''; 
document.getElementById('program').value = programInfo.program || ''; 
document.getElementById('startDate').value = programInfo.startDate || ''; 
document.getElementById('location').value = selectedLocation || ''; 
document.getElementById('registrationFee').value = registrationFee.toFixed(2);

// Initialize selected payment option
let selectedPaymentOption = '';

// Handle the change in payment options
function handleCheckboxChange() {
    // Uncheck all the checkboxes initially
    const fullPayment = document.getElementById('fullPaymentCheckbox');
    const partialPayment = document.getElementById('partialPaymentCheckbox');
    const registrationOnly = document.getElementById('registrationOnlyCheckbox');

    // Uncheck all others when one is selected
    fullPayment.addEventListener('change', () => {
        if (fullPayment.checked) {
            partialPayment.checked = false;
            registrationOnly.checked = false;
            selectedPaymentOption = 'full';
            updateFinalFee();
        }
    });

    partialPayment.addEventListener('change', () => {
        if (partialPayment.checked) {
            fullPayment.checked = false;
            registrationOnly.checked = false;
            selectedPaymentOption = 'partial';
            updateFinalFee();
        }
    });

    registrationOnly.addEventListener('change', () => {
        if (registrationOnly.checked) {
            fullPayment.checked = false;
            partialPayment.checked = false;
            selectedPaymentOption = 'registration';
            updateFinalFee();
        }
    });

    function updateFinalFee() {
        let finalFee = 0;

        if (selectedPaymentOption === 'full') {
            finalFee = totalFee + registrationFee; // Full payment includes course fee + flat registration fee
            document.getElementById('payButton').textContent = "Proceed with Full Payment";
        } else if (selectedPaymentOption === 'partial') {
            finalFee = (totalFee * 0.5) + registrationFee; // Partial payment is 50% of the course fee + flat registration fee
            document.getElementById('payButton').textContent = "Proceed with Partial Payment";
        } else if (selectedPaymentOption === 'registration') {
            finalFee = registrationFee; // Only the registration fee for this option
            document.getElementById('payButton').textContent = "Proceed with Registration Fee Payment";
        }

        document.getElementById('amountPaid').value = finalFee.toFixed(2);
        console.log('Selected Payment Option:', selectedPaymentOption); 
        console.log('Final Fee:', finalFee); 
    }
}

// Attach event listener for form submission
document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmission);

// Handle the payment submission
function handlePaymentSubmission(event) {
    event.preventDefault(); 

    // Fetch form field values directly
    const reference = document.getElementById('reference').value.trim();
    const amountPaid = parseFloat(document.getElementById('amountPaid').value.trim());
    const email = document.getElementById('email').value.trim();
    const course = document.getElementById('course').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();

    console.log(`Form Submitted. Reference: ${reference}, Amount Paid: ${amountPaid}, Name: ${firstName} ${lastName}, Course: ${course}`);

    if (reference && !isNaN(amountPaid)) {
        displayMessage('Submitting your payment details. Please wait...');

        const formData = new URLSearchParams(); 
        formData.append('reference', reference);
        formData.append('amountPaid', amountPaid);
        formData.append('email', email);
        formData.append('course', course);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);

        // Store the email and totalPaid in localStorage for later use
        localStorage.setItem('email', email);
        localStorage.setItem('totalPaid', amountPaid);

        fetch('http://127.0.0.1:3000/api/payment/submit-eft-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString() 
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);

            if (data.success) {
                window.location.href = 'registration-successful.html'; 
            } else {
                displayMessage('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error in submission:', error);
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

// Initialize the checkbox change handler
handleCheckboxChange();
