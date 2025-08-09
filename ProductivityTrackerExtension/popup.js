document.addEventListener('DOMContentLoaded', () => {
    const viewDashboardButton = document.getElementById('viewDashboardButton');
    const statusDiv = document.getElementById('status');

    viewDashboardButton.addEventListener('click', () => {
        // Open dashboard.html in a new tab
        chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
        statusDiv.textContent = 'Opening dashboard...';
    });

    // You could add logic here to show current tracking status or last recorded site
    statusDiv.textContent = 'Tracking active.';
});