let activeTabId = null;
let lastActiveTime = {}; // Stores last active time for each tab
const IDLE_THRESHOLD = 5000; // 5 seconds of inactivity to consider idle
const SAVE_INTERVAL = 60000; // Save every 1 minute (60 seconds)

// Function to send activity data to backend
async function sendActivityToBackend(url, duration) {
    if (!url || duration <= 0) {
        return;
    }

    console.log(`Sending activity: ${url}, Duration: ${duration}ms`);

    try {
        const response = await fetch('http://localhost:5000/api/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, duration, timestamp: new Date() }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        } else {
            const data = await response.json();
            console.log('Activity saved:', data);
        }
    } catch (error) {
        console.error('Error sending activity to backend:', error);
    }
}

// Function to calculate and send duration for a tab
function processTabActivity(tabId, url) {
    const now = Date.now();
    if (lastActiveTime[tabId] && url) {
        // Only count if the tab was considered active for a reasonable duration
        const duration = now - lastActiveTime[tabId];
        if (duration > 1000 && duration < SAVE_INTERVAL + 5000) { // Avoid huge durations from system sleep
            sendActivityToBackend(url, duration);
        }
    }
    lastActiveTime[tabId] = now;
}

// Listener for tab updates (e.g., URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.active) {
        processTabActivity(tabId, tab.url);
    }
});

// Listener for tab activation (user switches tabs)
chrome.tabs.onActivated.addListener(activeInfo => {
    // Process activity for the previously active tab
    if (activeTabId && lastActiveTime[activeTabId]) {
        chrome.tabs.get(activeTabId, (prevTab) => {
            if (prevTab && prevTab.url) {
                processTabActivity(activeTabId, prevTab.url);
            }
        });
    }
    activeTabId = activeInfo.tabId;
    lastActiveTime[activeTabId] = Date.now(); // Mark new active tab's start time
});

// Listener for tab removal (tab closed)
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (lastActiveTime[tabId]) {
        // No URL available directly on removal, so we can't send final data if it's the only change.
        // Data is primarily sent on tab updates/activations/interval.
        delete lastActiveTime[tabId];
        if (activeTabId === tabId) {
            activeTabId = null;
        }
    }
});

// Periodic check for active tab and saving data
setInterval(() => {
    if (activeTabId) {
        chrome.tabs.get(activeTabId, (tab) => {
            if (tab && tab.url) {
                processTabActivity(activeTabId, tab.url);
            }
        });
    }
}, SAVE_INTERVAL);


// Initial setup when the service worker starts
chrome.runtime.onInstalled.addListener(() => {
    console.log('Productivity Tracker installed.');
});

chrome.runtime.onStartup.addListener(() => {
    console.log('Productivity Tracker started.');
    // On startup, find the active tab and initialize tracking
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            activeTabId = tabs[0].id;
            lastActiveTime[activeTabId] = Date.now();
        }
    });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'HEARTBEAT' && sender.tab && sender.tab.active) {
        // This is a fallback/additional check, processTabActivity is primary
        if (activeTabId === sender.tab.id) {
             // Update the last active time for the current active tab
            lastActiveTime[activeTabId] = Date.now();
        }
    }
});