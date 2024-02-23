chrome.action.disable();

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "flowgram");
    port.onMessage.addListener(function(response) {
    console.log(response)
    chrome.action.enable()
    });
  });

  

