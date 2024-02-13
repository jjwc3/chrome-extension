chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (details.url.endsWith('playlist.m3u8')) {
        if (details.url.includes('hls')) {
          chrome.tabs.sendMessage(details.tabId, {url: details.url});
          console.log(details.url);
        }
      }
    },
    {urls: ['<all_urls>']}
  );