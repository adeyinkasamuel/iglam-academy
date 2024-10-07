function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length > 3 && value.length <= 6) {
        value = value.replace(/(\d{3})(\d+)/, '$1-$2');
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
    }
    input.value = value;
}

function validateStep2() {
    // Clear previous errors
    document.getElementById('streetNameError').style.display = 'none';
    document.getElementById('locationError').style.display = 'none';
    document.getElementById('postalCodeError').style.display = 'none';
    document.getElementById('phoneError').style.display = 'none';
    document.getElementById('emergencyContactNameError').style.display = 'none';
    document.getElementById('emergencyContactPhoneError').style.display = 'none';

    const streetName = document.getElementById('streetName').value.trim();
    const suburb = document.getElementById('suburb').value.trim();
    const city = document.getElementById('city').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const emergencyContactName = document.getElementById('emergencyContactName').value.trim();
    const emergencyContactPhone = document.getElementById('emergencyContactPhone').value.trim();

    let isValid = true;

    if (streetName === "") {
        document.getElementById('streetNameError').style.display = 'block';
        isValid = false;
    }

    if (suburb === "" || city === "") {
        document.getElementById('locationError').style.display = 'block';
        isValid = false;
    }

    if (postalCode === "") {
        document.getElementById('postalCodeError').style.display = 'block';
        isValid = false;
    }

    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    if (phone === "" || !phonePattern.test(phone)) {
        document.getElementById('phoneError').style.display = 'block';
        isValid = false;
    }

    if (emergencyContactName === "") {
        document.getElementById('emergencyContactNameError').style.display = 'block';
        isValid = false;
    }

    if (emergencyContactPhone === "" || !phonePattern.test(emergencyContactPhone)) {
        document.getElementById('emergencyContactPhoneError').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        window.location.href = 'program.html'; // Navigate to program.html
    }
}

function goBack() {
    window.location.href = 'index.html'; // Go back to the index page
}
