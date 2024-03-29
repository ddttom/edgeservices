/* eslint-disable import/prefer-default-export */
/* eslint-disable no-await-in-loop */
/* adobe specific meta data handling */
/* NO CLIENT CODE IN HERE JUST SETUP FOR ADOBE */

let buildscript = '';
function replaceTokens(data, text) {
  let ret = text;
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const item = key;
      const value = data[item];
      ret = ret.replaceAll(item, value);
    }
  }
  return ret;
}
export async function initialize() {
  // eslint-disable-next-line no-use-before-define
  await handleMetadataTracking();
}
export async function handleMetadataTracking() {
  // eslint-disable-next-line prefer-destructuring
  if (window.siteConfig['$meta:tracking$'] != null) {
    const trackerlist = window.siteConfig['$meta:tracking$'];
    const trackers = trackerlist.split(',');
    window.cmsplus.track = {};
    for (let i = 0; i < trackers.length; i += 1) {
      const tracker = trackers[i].trim();
      let trackerUrl = tracker;
      if (trackerUrl) {
        trackerUrl = `${window.location.origin}/config/tracking/datalayer${trackerUrl}view.json`;
        try {
          // eslint-disable-next-line no-await-in-loop
          const resp = await fetch(trackerUrl);
          if (!resp.ok) {
            throw new Error(`Failed to fetch ${trackerUrl} content: ${resp.status}`);
          }
          const json = await resp.json();
          let jsonString = JSON.stringify(json);
          jsonString = replaceTokens(window.siteConfig, jsonString);
          window.cmsplus.track[tracker] = jsonString;
          const fraction = `\nwindow.cmsplus.track["${tracker}"] = ${jsonString};\n`;
          buildscript += fraction;
          if (tracker === 'page') {
            buildscript += `
window.cmsplus.track.page.pageQueryString = "";
if (window.location.search) {
  window.cmsplus.track.page.pageQueryString = window.location.search;
}
window.cmsplus.track.page.previousPageURL = document.referrer;
const url = new URL(document.referrer);
let pathname = url.pathname.startsWith("/") ? url.pathname.substring(1) : url.pathname;
pathname = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
window.cmsplus.track.page.previousPageName = pathname;
`;
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Failed to load ${trackerUrl} content: ${error.message}`);
        }
      }
    }
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = buildscript;
    document.head.appendChild(script);
  }
}
export function loadAnalyticsDebugPanel() {
  let content = '<h3>Adobe Tracking Data</h3>';
  if (window.cmsplus.track.page) {
    content = `${content}<pre>${JSON.stringify(window.cmsplus.track.page, null, '\t')}</pre>`;
  }
  if (window.cmsplus.track.content) {
    content = `${content}<pre>${JSON.stringify(window.cmsplus.track.content, null, '\t')}</pre>`;
  }
  return content;
}
