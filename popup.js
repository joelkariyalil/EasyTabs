document.addEventListener('DOMContentLoaded', () => {
    const tabList = document.getElementById("tab-list");

    // Request tab overview data from the service worker
    chrome.runtime.sendMessage({ action: "getTabOverview" }, (response) => {
        response.forEach((tabData) => {
            const listItem = document.createElement("li");
            listItem.className = "tab-item";

            const tabTitle = document.createElement("span");
            tabTitle.className = "tab-title";
            tabTitle.textContent = tabData.title;

            const tabUrl = document.createElement("button");
            tabUrl.textContent = "(view)";
            tabUrl.addEventListener('click', () => {
                // Update the current tab to the selected URL
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    const currentTab = tabs[0];
                    chrome.tabs.update(currentTab.id, { url: tabData.url });
                });
            });

            listItem.appendChild(tabTitle);
            listItem.appendChild(tabUrl);

            tabList.appendChild(listItem);
        });
    });
});
