// Bridge script: runs in ISOLATED world, has access to chrome.storage
// Communicates with interceptor.js (MAIN world) via window.postMessage

function sendRulesToPage() {
  chrome.storage.local.get(['rules', 'globalEnabled'], (result) => {
    const data = {
      type: '__fetch_interceptor_rules_update__',
      rules: result.rules || [],
      globalEnabled: result.globalEnabled !== undefined ? result.globalEnabled : true
    };
    window.postMessage(data, '*');
  });
}

// Listen for rule requests from MAIN world
window.addEventListener('message', (e) => {
  if (e.source === window && e.data && e.data.type === '__fetch_interceptor_get_rules__') {
    sendRulesToPage();
  }
});

// Listen for storage changes and push updates
chrome.storage.onChanged.addListener((changes) => {
  if (changes.rules || changes.globalEnabled) {
    sendRulesToPage();
  }
});

// Send rules on load
sendRulesToPage();
