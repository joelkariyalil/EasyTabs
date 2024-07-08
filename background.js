let tabOverview = [];

// Function to update the tab overview
const updateTabOverview = () => {
    chrome.tabs.query({}, (tabs) => {
        tabOverview = tabs.map((tab) => ({
            title: tab.title || "(no title)",
            url: tab.url,
            favIconUrl: tab.favIconUrl
        }));
    });
};

// Update the tab overview initially
updateTabOverview();

// Update the tab overview whenever a tab is updated or removed
chrome.tabs.onUpdated.addListener(updateTabOverview);
chrome.tabs.onRemoved.addListener(updateTabOverview);

// Listener to respond to messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTabOverview") {
        sendResponse(tabOverview);
    }
});
