/* eslint-disable no-await-in-loop */
/* adobe specific meta data handling */
import { replaceTokens } from './meta-helper.js';
// eslint-disable-next-line import/prefer-default-export
export async function handleMetadataTracking(siteConfig) {
  if (siteConfig['$meta:tracking$'] != null) {
    const trackerlist = siteConfig['$meta:tracking$'];
    const trackers = trackerlist.split(',');
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
          jsonString = replaceTokens(siteConfig, jsonString);
          // Create and append a new script element with the processed JSON
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.textContent = jsonString;

          let buildscript = `window.opt.datalayer${tracker} = ${jsonString};`;
          if (tracker === 'page') {
            buildscript += 'window.opt.datalayerpage.page.pageQueryString = window.location.search;';
            buildscript += 'window.opt.datalayerpage.page.previousPageURL = document.referrer;';
            buildscript += 'const url = new URL(datalayerpage.page.previousPageURL); const pathname = url.pathname.startsWith("/") ? url.pathname.substring(1) : url.pathname;';
            buildscript += 'window.opt.datalayerpage.page.previousPageName = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;';
          }
          script.innerHTML = `${buildscript}'; // console.log(JSON.stringify(window.datalayerpage));`;
          document.head.appendChild(script);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Failed to load ${trackerUrl} content: ${error.message}`);
        }
      }
    }
  }
}
