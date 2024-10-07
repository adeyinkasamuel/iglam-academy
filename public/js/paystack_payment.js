const selectedCourses = JSON.parse(localStorage.getItem('selectedCourses')) || [];
const originalTotal = parseFloat(localStorage.getItem('originalTotal')) || 0;
const totalFee = parseFloat(localStorage.getItem('totalFee')) || 0;

// Calculate total registration fee
let registrationFee = 0;
selectedCourses.forEach(course => {
    // Bypass registration fee for Test Course
    if (course.course !== 'Test Course') {
        registrationFee += parseInt(course.regfee); 
    }
});

document.getElementById('selectedCourses').textContent = selectedCourses.map(course => course.course).join(', ');
document.getElementById('totalFeeDisplay').textContent = totalFee.toFixed(2); // Ensure correct format
document.getElementById('originalTotalDisplay').textContent = originalTotal.toFixed(2); // Ensure correct format
document.getElementById('registrationFee').textContent = registrationFee.toFixed(2); // Ensure correct format

let selectedPaymentOption = '';

function handleCheckboxChange() {
    const fullPayment = document.getElementById('fullPaymentCheckbox').checked;
    const partialPayment = document.getElementById('partialPaymentCheckbox').checked;
    const registrationOnly = document.getElementById('registrationOnlyCheckbox').checked;

    if (fullPayment) {
        selectedPaymentOption = 'full';
        document.getElementById('payButton').textContent = "Pay Full Course Fee";
    } else if (partialPayment) {
        selectedPaymentOption = 'partial';
        document.getElementById('payButton').textContent = "Pay Partial Fee";
    } else if (registrationOnly) {
        selectedPaymentOption = 'registration';
        document.getElementById('payButton').textContent = "Pay Registration Fee";
    } else {
        selectedPaymentOption = '';
        document.getElementById('payButton').textContent = "Pay Now";
    }
}

function handlePayment() {
    if (selectedPaymentOption === 'full') {
        processPayment(parseFloat(totalFee) + parseFloat(registrationFee)); // Ensure correct data type
    } else if (selectedPaymentOption === 'partial') {
        const partialAmount = parseFloat(totalFee) * 0.5;
        processPayment(partialAmount + parseFloat(registrationFee));
    } else if (selectedPaymentOption === 'registration') {
        processPayment(parseFloat(registrationFee));
    } else {
        alert('Please select a payment option.');
    }
}

function processPayment(amount) {
    let handler = PaystackPop.setup({
        key: 'pk_live_3570bf07b126b8dbd9e7c98a87456740d0042f88', // Use your live public key
        email: 'user@example.com', // You can dynamically set the user email
        amount: amount * 100, // Convert rands to cents
        currency: "ZAR",
        callback: function (response) {
            alert('Payment Successful! Transaction Reference: ' + response.reference);
        },
        onClose: function () {
            alert('Transaction was not completed.');
        }
    });
    handler.openIframe();
}
