const userAgent =
  'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Mobile Safari/537.36';

const requestFilter = {
  urls: ['<all_urls>'],
};

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const headers = details.requestHeaders;
    let i, l;
    for (i = 0, l = headers.length; i < l; ++i) {
      if (headers[i].name == 'User-Agent') {
        break;
      }
    }
    if (i < headers.length) {
      headers[i].value = userAgent;
    }
    return { requestHeaders: headers };
  },
  requestFilter,
  ['requestHeaders', 'blocking']
);
