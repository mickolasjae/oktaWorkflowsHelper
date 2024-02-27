
chrome.action.disable()
// Define storage utility functions globally
function setLocalStorageKey(key, value) {
  chrome.storage.local.set({ [key]: value }, function() {
    console.log('Value is set to ', value);
  });
}

function getLocalStorageKeyValue(key, onGetStorageKeyValue) {
  chrome.storage.local.get([key], function(result) {
    onGetStorageKeyValue(result[key]);
  });
}

// Listen for connections and messages
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "flowgram");
  port.onMessage.addListener(function(request) {
    var workflowsdata = request;
    console.log(JSON.stringify(workflowsdata));
    // Save the data to local storage
    setLocalStorageKey("workflowsdata", workflowsdata);
  });
});
chrome.action.enable()
// Example usage of getLocalStorageKeyValue
// This can be called wherever you need to access the stored data
getLocalStorageKeyValue("workflowsdata", function(data) {
  if (data) {
    console.log("Retrieved workflowsdata:", data);

    // Use the workflowsdata as needed
  } else {
    console.log("No workflowsdata found");
  }
});