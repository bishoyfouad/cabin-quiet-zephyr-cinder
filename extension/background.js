chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "WHO") {
    sendResponse({ tabId: sender.tab ? sender.tab.id : null });
    return false;
  }
  return false;
});
