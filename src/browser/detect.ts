export function detectBrowser(): 'chrome' | 'firefox' | 'edge' | 'opera' | 'unknown' {
  const userAgent = navigator.userAgent;
  
  if (userAgent.indexOf("Firefox") > -1) {
    return 'firefox';
  } else if (userAgent.indexOf("Edg") > -1) {
    return 'edge';
  } else if (userAgent.indexOf("OPR") > -1 || userAgent.indexOf("Opera") > -1) {
    return 'opera';
  } else if (userAgent.indexOf("Chrome") > -1) {
    return 'chrome';
  }
  return 'unknown';
}

export function isChromium(): boolean {
  const browser = detectBrowser();
  return browser === 'chrome' || browser === 'edge' || browser === 'opera';
}

export function isFirefox(): boolean {
  return detectBrowser() === 'firefox';
}
