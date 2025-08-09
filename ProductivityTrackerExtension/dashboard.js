const backendUrl = 'http://localhost:5000';

let dailyTrendChart;
let topSitesChart;

document.addEventListener('DOMContentLoaded', () => {
    const datePicker = document.getElementById('datePicker');
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');

    // Set date picker to today's date initially
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(today.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;
    datePicker.value = todayString;
    selectedDateDisplay.textContent = todayString;

    // Load initial data
    loadData();
    loadDailyActivity(todayString);

    // Add event listener for date picker changes
    datePicker.addEventListener('change', (event) => {
        const selectedDate = event.target.value;
        selectedDateDisplay.textContent = selectedDate;
        loadDailyActivity(selectedDate);
    });
});

async function loadData() {
    try {
        const response = await fetch(`${backendUrl}/api/analytics`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Analytics data received:", data); // Log the received data

        // Process data for charts
        renderDailyTrendChart(data.dailyTrend);
        renderTopSitesChart(data.topSites);

    } catch (error) {
        console.error('Error fetching data from backend:', error);
        document.querySelector('.container').innerHTML = `
            <h1>Error Loading Dashboard</h1>
            <p style="color: red;">Could not connect to the backend server or fetch data.</p>
            <p>Please ensure your Node.js backend server is running:</p>
            <p>1. Open your terminal.</p>
            <p>2. Navigate to <code>ProductivityTrackerProject/ProductivityTrackerBackend</code></p>
            <p>3. Run <code>node server.js</code></p>
            <p>4. Check the terminal for "Server running..." and "MongoDB Connected!".</p>
        `;
    }
}

async function loadDailyActivity(date) {
    const dailyActivityList = document.getElementById('dailyActivityList');
    dailyActivityList.innerHTML = '<li>Loading daily activity...</li>'; // Show loading state

    try {
        const response = await fetch(`${backendUrl}/api/daily-activity?date=${date}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Daily activity for ${date}:`, data); // Log the received daily data

        dailyActivityList.innerHTML = ''; // Clear previous list

        if (Object.keys(data).length === 0) {
            dailyActivityList.innerHTML = '<li>No activity recorded for this date.</li>';
            return;
        }

        for (const url in data) {
            const durationMs = data[url];
            const durationMinutes = (durationMs / 1000 / 60).toFixed(2); // Convert ms to minutes
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span>${url}</span> <span class="duration">${durationMinutes} min</span>`;
            dailyActivityList.appendChild(listItem);
        }

    } catch (error) {
        console.error('Error fetching daily activity:', error);
        dailyActivityList.innerHTML = `<li>Error loading daily activity. ${error.message}</li>`;
    }
}


function renderDailyTrendChart(dailyTrendData) {
    const ctx = document.getElementById('dailyTrendChart').getContext('2d');
    const labels = Object.keys(dailyTrendData);
    const data = Object.values(dailyTrendData).map(ms => (ms / 1000 / 60).toFixed(2)); // Convert ms to minutes

    if (dailyTrendChart) {
        dailyTrendChart.destroy(); // Destroy previous chart instance if exists
    }

    dailyTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Active Time (minutes)',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' min';
                        }
                    }
                }
            }
        }
    });
}

function renderTopSitesChart(topSitesData) {
    const ctx = document.getElementById('topSitesChart').getContext('2d');
    const labels = Object.keys(topSitesData);
    const data = Object.values(topSitesData).map(ms => (ms / 1000 / 60).toFixed(2)); // Convert ms to minutes

    if (topSitesChart) {
        topSitesChart.destroy(); // Destroy previous chart instance if exists
    }

    topSitesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Active Time (minutes)',
                data: data,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Make it a horizontal bar chart
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Website'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.x + ' min';
                        }
                    }
                }
            }
        }
    });
}