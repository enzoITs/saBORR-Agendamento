// barbeiro-dashboard.js

// Function to fetch and display barber schedules
const fetchBarberSchedules = async () => {
    // Fetch schedules from an API or database
    try {
        const response = await fetch('https://api.example.com/schedules');
        const schedules = await response.json();
        displaySchedules(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
    }
};

// Function to display schedules on the dashboard
const displaySchedules = (schedules) => {
    const schedulesContainer = document.getElementById('schedules');
    schedulesContainer.innerHTML = '';
    schedules.forEach(schedule => {
        const scheduleItem = document.createElement('div');
        scheduleItem.classList.add('schedule-item');
        scheduleItem.innerText = `Barber: ${schedule.barber}, Time: ${schedule.time}`;
        schedulesContainer.appendChild(scheduleItem);
    });
};

// Call the fetch function on page load
window.onload = fetchBarberSchedules;
