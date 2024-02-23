chrome.action.onClicked.addListener(function(tab) {
  chrome.tabs.create({
      'url': chrome.runtime.getURL("popup.html#window")
  });
});

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "flowgram");
    port.onMessage.addListener(function(msg) {
    console.log(msg)
    });
  });

