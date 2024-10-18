// Fetch pending payments and populate the table
window.onload = function() {
    fetch('http://127.0.0.1:3000/api/admin/payments')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#paymentTable tbody');
            tableBody.innerHTML = '';
            data.forEach(payment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${payment.reference_number}</td>
                    <td>${payment.email}</td>
                    <td>${payment.course}</td>
                    <td>ZAR ${payment.amountPaid}</td>
                    <td>
                        <button onclick="verifyPayment(${payment.registration_id})">Verify</button>
                        <button onclick="openRejectionModal(${payment.registration_id})">Reject</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching payments:', error));  // Handle fetch error
};

// Verify Payment
function verifyPayment(registrationId) {
    fetch(`http://127.0.0.1:3000/api/admin/payment/${registrationId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' })  // Corrected status to 'verified'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Payment verified successfully.');
            window.location.reload();  // Reload the page to refresh the table
        } else {
            alert('Error verifying payment.');
        }
    })
    .catch(error => console.error('Error verifying payment:', error));  // Handle errors
}

// Open Rejection Modal
function openRejectionModal(registrationId) {
    document.getElementById('rejectionModal').style.display = 'block';
    document.getElementById('confirmRejectionBtn').onclick = () => rejectPayment(registrationId);  // Set rejection function on confirm button
}

// Close Modal
function closeModal() {
    document.getElementById('rejectionModal').style.display = 'none';  // Hide the rejection modal
}

// Reject Payment
function rejectPayment(registrationId) {
    const reason = document.getElementById('rejectionReason').value;  // Get rejection reason
    if (reason.trim() === '') {
        alert('Rejection reason cannot be empty.');
        return;
    }

    fetch(`http://127.0.0.1:3000/api/admin/payment/${registrationId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', reason: reason })  // Send rejection reason
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Payment rejected successfully.');
            window.location.reload();  // Reload to refresh the table
        } else {
            alert('Error rejecting payment.');
        }
    })
    .catch(error => console.error('Error rejecting payment:', error));  // Handle errors
    closeModal();  // Close the modal after submission
}
