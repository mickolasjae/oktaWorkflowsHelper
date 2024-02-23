chrome.action.disable();
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "flowgram");
  port.onMessage.addListener(function(request) {
      console.log(request);

      if (request.type === "getText") {
          // Here you can send a message back to the popup script
          port.postMessage(/* your response data */);
      }
      chrome.action.enable()
  });
});

