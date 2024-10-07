const courseList = document.getElementById('courseList');
const scrollIndicatorUp = document.getElementById('scrollIndicatorUp');
const scrollIndicatorDown = document.getElementById('scrollIndicatorDown');
const backToTop = document.getElementById('backToTop');
const totalFeeElement = document.getElementById('totalFee');
const originalTotalElement = document.getElementById('originalTotal');
const totalDurationElement = document.getElementById('totalDuration');
const totalFeeError = document.getElementById('totalFeeError');
const registrationFeeElement = document.getElementById('registrationFee');

// On page load, populate form with saved data if available
window.onload = function() {
    const savedCourses = JSON.parse(localStorage.getItem('selectedCourses'));
    if (savedCourses) {
        savedCourses.forEach(course => {
            const checkbox = document.querySelector(`input[data-course="${course.course}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        updateSummary();
    }
};

// Function to scroll the course list up by 100px smoothly
function scrollUp() {
    courseList.scrollBy({
        top: -100, // Scroll up by 100px
        behavior: 'smooth' // Smooth scrolling behavior
    });
}

// Function to scroll the course list down by 100px smoothly
function scrollDown() {
    courseList.scrollBy({
        top: 100, // Scroll down by 100px
        behavior: 'smooth' // Smooth scrolling behavior
    });
}

// Throttle the scroll event to improve performance
let isScrolling;
courseList.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    
    // Throttle the scroll event listener
    isScrolling = setTimeout(() => {
        if (courseList.scrollTop > 0) {
            scrollIndicatorUp.style.display = 'block';
        } else {
            scrollIndicatorUp.style.display = 'none';
        }

        if (courseList.scrollTop + courseList.clientHeight < courseList.scrollHeight) {
            scrollIndicatorDown.style.display = 'block';
        } else {
            scrollIndicatorDown.style.display = 'none';
        }

        if (courseList.scrollTop > 0) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    }, 66); // Execute the scroll behavior every 66ms
});

// Function to validate selected courses and move to the next step
function validateAndNext() {
    const selectedCourses = [];
    const courseCheckboxes = document.querySelectorAll('.course');
    courseCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedCourses.push({
                course: checkbox.getAttribute('data-course'),
                fee: checkbox.getAttribute('data-fee'),
                special: checkbox.getAttribute('data-special'),
                duration: checkbox.getAttribute('data-duration'),
                regfee: checkbox.getAttribute('data-regfee')
            });
        }
    });

    if (selectedCourses.length === 0) {
        totalFeeError.style.display = 'block';
        return;
    }

    // Save selected courses and total fee to localStorage
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    localStorage.setItem('originalTotal', originalTotalElement.textContent);
    localStorage.setItem('totalFee', totalFeeElement.textContent);
    localStorage.setItem('totalDuration', totalDurationElement.textContent);
    localStorage.setItem('registrationFee', registrationFeeElement.textContent);

    // Redirect to the Basic Info page instead of Payment
    window.location.href = 'basic_info.html';
}

// Function to go back to the previous step (location selection page)
function goBack() {
    window.location.href = 'location.html';
}

// Function to scroll back to the top of the course list
function scrollToTop() {
    courseList.scrollTop = 0;
}

// Event listener to update course selection and summary
const courseCheckboxes = document.querySelectorAll('.course');
courseCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        this.closest('.course-card').classList.toggle('selected', this.checked);
        updateSummary();
    });
});

// Function to update the total fee and duration summary
function updateSummary() {
    let totalFee = 0;
    let originalTotal = 0;
    let totalDuration = 0;
    let registrationFee = 0;

    const selectedCourses = [];
    const courseCheckboxes = document.querySelectorAll('.course');
    courseCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const originalFee = parseInt(checkbox.getAttribute('data-fee'));
            const specialFee = parseInt(checkbox.getAttribute('data-special'));
            const regFee = parseInt(checkbox.getAttribute('data-regfee'));
            originalTotal += originalFee;
            totalFee += specialFee ? specialFee : originalFee;
            selectedCourses.push({
                fee: specialFee ? specialFee : originalFee,
                regFee: regFee,
                course: checkbox.getAttribute('data-course')
            });
            totalDuration += parseInt(checkbox.getAttribute('data-duration'));
        }
    });

    // Logic for short courses
    const shortCourseCount = selectedCourses.filter(course => course.regFee === 250).length;

    if (shortCourseCount === 1) {
        totalFee = 1000;
        registrationFee = 250;
    } else if (shortCourseCount === 2) {
        totalFee = 1500;
        registrationFee = 250;
    } else if (shortCourseCount === 3) {
        totalFee = 1500 + 1000;
        registrationFee = 500;
    } else if (shortCourseCount === 4) {
        totalFee = 1500 + 1500;
        registrationFee = 500;
    } else if (shortCourseCount > 4) {
        let blocksOfTwoCourses = Math.floor(shortCourseCount / 2);
        let remainingCourses = shortCourseCount % 2;
        totalFee = blocksOfTwoCourses * 1500;
        registrationFee = blocksOfTwoCourses * 250;

        if (remainingCourses === 1) {
            totalFee += 1000;
            registrationFee += 250;
        }
    }

    // Logic for non-short courses
    selectedCourses.forEach(course => {
        switch (course.course) {
            case "Full Beauty Therapy":
                registrationFee += 700;
                break;
            case "Microblading":
                registrationFee += 500;
                break;
            case "Ombre":
                registrationFee += 1000;
                break;
            case "Combo of Microblading and Ombre":
                totalFee += 5500;
                registrationFee += 1500;
                break;
            case "Piercings":
                registrationFee += 800;
                break;
            case "Tattoo":
                registrationFee += 2000;
                break;
            default:
                // Short courses already handled
                break;
        }
    });

    // Update the DOM with the calculated values
    originalTotalElement.textContent = originalTotal;
    totalFeeElement.textContent = totalFee;
    totalDurationElement.textContent = totalDuration;
    registrationFeeElement.textContent = registrationFee;

    if (totalFee > 0) {
        totalFeeError.style.display = 'none';
    }
}
