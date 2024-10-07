let selectedProgram = null;

// Initialize Flatpickr
document.addEventListener('DOMContentLoaded', function() {
    flatpickr("#startDate", {
        dateFormat: "Y-m-d", 
        minDate: "today",
        altInput: true,
        altFormat: "F j, Y", 
        theme: "material_orange"
    });

    // Pre-fill data from localStorage if available
    const programData = JSON.parse(localStorage.getItem('programInfo'));
    if (programData) {
        selectedProgram = programData.program;
        document.getElementById(programData.program).classList.add('selected');
        document.getElementById('startDate').value = programData.startDate;
    }
});

function selectOption(option) {
    selectedProgram = option;
    document.getElementById('fullTime').classList.remove('selected');
    document.getElementById('partTime').classList.remove('selected');
    document.getElementById(option).classList.add('selected');
}

function validateAndNext() {
    // Clear previous errors
    document.getElementById('programError').style.display = 'none';
    document.getElementById('dateError').style.display = 'none';

    const startDate = document.getElementById('startDate').value;
    let isValid = true;

    if (!selectedProgram) {
        document.getElementById('programError').style.display = 'block';
        isValid = false;
    }

    if (!startDate) {
        document.getElementById('dateError').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        // Store selected program and start date in localStorage
        localStorage.setItem('programInfo', JSON.stringify({
            program: selectedProgram,
            startDate: startDate
        }));

        window.location.href = 'location.html'; // Navigate to location.html
    }
}

function goBack() {
    window.location.href = 'contact.html'; // Go back to the contact page
}
