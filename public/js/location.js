let selectedLocation = localStorage.getItem('selectedLocation') || null;

// Pre-fill the location if previously selected
if (selectedLocation) {
    document.getElementById(selectedLocation).classList.add('selected');
}

function selectLocation(location) {
    selectedLocation = location;
    localStorage.setItem('selectedLocation', selectedLocation);  // Store selected location
    document.getElementById('location1').classList.remove('selected');
    document.getElementById('location2').classList.remove('selected');
    document.getElementById(location).classList.add('selected');
}

function validateAndNext() {
    // Clear previous errors
    document.getElementById('locationError').style.display = 'none';

    let isValid = true;

    if (!selectedLocation) {
        document.getElementById('locationError').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        // Store in localStorage to retain across pages
        localStorage.setItem('selectedLocation', selectedLocation);
        window.location.href = 'payment.html'; // Navigate to the payment page
    }
}

function goBack() {
    window.location.href = 'program.html'; // Go back to the program selection page
}

function goToCourses() {
    window.location.href = 'index.html'; // Navigate back to the course selection page
}
