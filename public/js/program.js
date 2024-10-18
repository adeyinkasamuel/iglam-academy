let selectedProgram = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Flatpickr
    flatpickr("#startDate", {
        dateFormat: "Y-m-d", 
        minDate: "today",
        altInput: true,
        altFormat: "F j, Y", 
        theme: "material_orange"
    });

    // Hide date picker by default
    document.getElementById('startDate').style.display = 'none';

    // Pre-fill data from localStorage if available
    const programData = JSON.parse(localStorage.getItem('programInfo'));
    if (programData) {
        selectedProgram = programData.program;
        document.getElementById(programData.program).classList.add('selected');
        document.getElementById('startDate').value = programData.startDate;
        
        // Show the date picker if fullTime or partTime was previously selected
        if (selectedProgram === 'fullTime' || selectedProgram === 'partTime') {
            document.getElementById('startDate').style.display = 'block';
        }
    }
});

function selectOption(option) {
    selectedProgram = option;

    // Clear selected state from all buttons
    document.getElementById('workshop').classList.remove('selected');
    document.getElementById('fullTime').classList.remove('selected');
    document.getElementById('partTime').classList.remove('selected');

    // Apply selected state to the clicked option
    document.getElementById(option).classList.add('selected');

    // Show or hide the date picker based on the selected option
    const datePicker = document.getElementById('startDate');
    if (option === 'fullTime' || option === 'partTime') {
        datePicker.style.display = 'block'; // Show the date picker
    } else {
        datePicker.style.display = 'none'; // Hide the date picker for workshop option
    }
}

function validateAndNext() {
    // Clear previous errors
    document.getElementById('programError').style.display = 'none';
    document.getElementById('dateError').style.display = 'none';

    const startDate = document.getElementById('startDate').value;
    let isValid = true;

    // Validate selected program
    if (!selectedProgram) {
        document.getElementById('programError').style.display = 'block';
        isValid = false;
    }

    // Validate date only if Full Time or Part Time is selected
    if ((selectedProgram === 'fullTime' || selectedProgram === 'partTime') && !startDate) {
        document.getElementById('dateError').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        // Store selected program and start date in localStorage
        localStorage.setItem('programInfo', JSON.stringify({
            program: selectedProgram,
            startDate: startDate
        }));

        // If workshop is selected, skip to payment.html
        if (selectedProgram === 'workshop') {
            window.location.href = 'payment.html'; // Navigate to payment.html
        } else {
            window.location.href = 'location.html'; // Otherwise, navigate to location.html
        }
    }
}
