function validateAndNext() {
    // Clear previous errors
    document.getElementById('firstNameError').style.display = 'none';
    document.getElementById('lastNameError').style.display = 'none';
    document.getElementById('emailError').style.display = 'none';
    document.getElementById('genderError').style.display = 'none';
    document.getElementById('dataConsentError').style.display = 'none';

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const gender = document.getElementById('gender').value;
    const dataConsent = document.getElementById('dataConsent').checked;

    let isValid = true;

    if (firstName === "") {
        document.getElementById('firstNameError').style.display = 'block';
        isValid = false;
    }

    if (lastName === "") {
        document.getElementById('lastNameError').style.display = 'block';
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || !emailPattern.test(email)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

    if (gender === "") {
        document.getElementById('genderError').style.display = 'block';
        isValid = false;
    }

    if (!dataConsent) {
        document.getElementById('dataConsentError').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        // Store basic info in localStorage
        localStorage.setItem('basicInfo', JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            gender: gender,
        }));

        // Navigate to the next page
        window.location.href = 'program.html';
    }
}

// Pre-fill the form if the data exists in localStorage
window.onload = function() {
    const basicInfo = JSON.parse(localStorage.getItem('basicInfo'));
    if (basicInfo) {
        document.getElementById('firstName').value = basicInfo.firstName || '';
        document.getElementById('lastName').value = basicInfo.lastName || '';
        document.getElementById('email').value = basicInfo.email || '';
        document.getElementById('gender').value = basicInfo.gender || '';
    }
}

function goBack() {
    window.history.back(); // Ensure that the previous page's data is not cleared
}
