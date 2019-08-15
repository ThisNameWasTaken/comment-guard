export default function() {
  const userAgent =
    'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Mobile Safari/537.36';
  const vendor = 'Google Inc.';
  const platform = 'Android';

  Object.defineProperty(window.navigator, 'userAgent', {
    get: () => userAgent,
  });

  Object.defineProperty(window.navigator, 'appVersion', {
    get: () => userAgent,
  });

  Object.defineProperty(window.navigator, 'vendor', {
    get: () => vendor,
  });

  Object.defineProperty(window.navigator, 'platform', {
    get: () => platform,
  });
}
