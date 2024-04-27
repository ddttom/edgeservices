/* adobe specific meta data handling */
/* NO CLIENT CODE IN HERE JUST SETUP FOR ADOBE */

import { replaceTokens } from './variables';

function loadAnalyticsDebugPanel() {
  let content = '';
  if (window.cmsplus?.track?.page || window.cmsplus?.track?.content) {
    content = '<h3>Adobe Tracking Data</h3>';
  }
  if (window.cmsplus?.track?.page) {
    content = `${content}<pre>${JSON.stringify(window.cmsplus?.track?.page, null, '\t')}</pre>`;
  }
  if (window.cmsplus?.track?.content) {
    content = `${content}<pre>${JSON.stringify(window.cmsplus?.track?.content, null, '\t')}</pre>`;
  }

  return content;
}
export async function initialize() {
  // eslint-disable-next-line no-use-before-define
  await handleMetadataTracking();
}
async function handleMetadataTracking() {
  let buildscript = '';
  const allowTracking = window.siteConfig?.['$system:allowtracking$'] ?? '';
  if (allowTracking === 'y') {
    const tracking = window.siteConfig?.['$meta:tracking$'] ?? '';
    if (tracking) {
      const trackerlist = tracking;
      const trackers = trackerlist.split(',');
      window.cmsplus.track = {};
      for (let i = 0; i < trackers.length; i += 1) {
        const tracker = trackers[i].trim();
        if (['page', 'content'].includes(tracker)) {
          let trackerUrl = tracker;
          if (trackerUrl) {
            trackerUrl = `${window.location.origin}/config/tracking/datalayer${trackerUrl}view.json`;
            try {
            // eslint-disable-next-line no-await-in-loop
              const resp = await fetch(trackerUrl);
              if (!resp.ok) {
                throw new Error(`Failed to fetch ${trackerUrl} content: ${resp.status}`);
              }
              // eslint-disable-next-line no-await-in-loop
              const json = await resp.json();
              let jsonString = JSON.stringify(json);
              jsonString = replaceTokens(window.siteConfig, jsonString);
              if (jsonString.includes('$meta:')) {
              // eslint-disable-next-line no-console
                console.log(`Found $meta: in ${trackerUrl}, aborting tracker`);
              } else {
                window.cmsplus.track[tracker] = jsonString;
                const fraction = `\nwindow.cmsplus.track["${tracker}"] = ${jsonString};\n`;
                buildscript += fraction;
                if (tracker === 'page') {
                  buildscript += `
                  (function() {
                    const cms = window.cmsplus.track.page;
                    cms.pageQueryString = window.location.search || "";
                    cms.previousPageURL = document.referrer || '';
                    let previousPageName = "none";
                    if (cms.previousPageURL) {
                      try {
                        const url = new URL(cms.previousPageURL);
                        previousPageName = url.pathname; 
                        previousPageName = previousPageName.startsWith("/") ? previousPageName.substring(1) : previousPageName;
                        previousPageName = previousPageName.endsWith("/") ? previousPageName.slice(0, -1) : previousPageName;
                      } catch (error) {
                        console.log("Error parsing URL: ", error);
                        previousPageName = "none";
                      }
                    }
                    cms.previousPageName = previousPageName;
                  })();
`;
                }
              }
            } catch (error) {
              // eslint-disable-next-line no-console
              console.log(`Failed to load ${trackerUrl} content: ${error.message}`);
            }
          }
        } else {
        // eslint-disable-next-line no-console
          console.log(`Unknown tracker type: ${tracker}`);
        }
      }
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.textContent = buildscript;
      document.head.appendChild(script);
    }
    window.cmsplus.callbackDebugAnalytics = loadAnalyticsDebugPanel;
  }
}
