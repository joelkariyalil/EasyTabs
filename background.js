// background.js

chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.onCreated.addListener(updateTabs);
    chrome.tabs.onRemoved.addListener(updateTabs);
    chrome.tabs.onUpdated.addListener(updateTabs);
    chrome.tabs.onActivated.addListener(updateTabs);

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
            active: tab.id === (activeInfo && activeInfo.tabId),
        }));

        if (activeInfo && activeInfo.tabId) {
            activeTabId = activeInfo.tabId;
        }

        updateResults(tabInfo);
    });
}

function updateResults(results) {
    // Send a message to the extension popup to update its content
    chrome.runtime.sendMessage({ type: 'updateResults', results });

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
