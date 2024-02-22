chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "flowgram");
    port.onMessage.addListener(function(msg) {
    console.log(msg)
    });
  });