// background.js
chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.onCreated.addListener(updateTabs);
    chrome.tabs.onRemoved.addListener(updateTabs);
    chrome.tabs.onUpdated.addListener(updateTabs);
    chrome.tabs.onActivated.addListener(updateTabs); // Add onActivated listener

    // Initial update when the extension is installed
    updateTabs();
});

let activeTabId = null;

function updateTabs(activeInfo) {
    chrome.tabs.query({}, function (tabs) {
        const tabInfo = tabs.map(tab => ({
            id: tab.id,
            title: tab.title || 'Untitled',
            url: tab.url,
            active: tab.id === (activeInfo && activeInfo.tabId), // Check if the tab is currently active
        }));

        // Update the activeTabId only if the event is onActivated
        if (activeInfo && activeInfo.tabId) {
            activeTabId = activeInfo.tabId;
        }

        updateResults(tabInfo);
    });
}

function updateResults(results) {
    const resultsContainer = document.getElementById('results');

    if (resultsContainer) {
        resultsContainer.innerText = JSON.stringify(results, null, 2);
    } else {
        console.error('Results container not found.');
    }

    // Send the results to a remote server
    fetch('http://localhost:3000/store-tabs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tabs: results, activeTabId }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Rest of your code...


chrome.tabs.query({}, function (tabs) {
    const tabResults = tabs.map(tab => `Title: ${tab.title} | URL: ${tab.url}`).join('\n');
    console.log(tabResults);

    updateResults(tabResults);
});

chrome.tabs.onCreated.addListener(function (tab) {
    console.log("Tab created - Title: " + tab.title + " | URL: " + tab.url);
    updateResults(`Tab created - Title: ${tab.title} | URL: ${tab.url}`);
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    console.log("Tab removed - Tab ID: " + tabId);
    updateResults(`Tab removed - Tab ID: ${tabId}`);
});
