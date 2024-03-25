/* eslint-disable import/prefer-default-export */

// Place any Client- Centered Code/  Configuration in here /

import { initialize as initTracker } from './adobe-metadata.js';

export async function initialize() {
  window.siteConfig['$system:analyticsdelay$'] = 3000;
  window.cmsplus.bubbleallowed = false; // window.cmsplus.environment === 'production';
  window.metadataTracker = initTracker;
}
export async function loadClientDebugPanel() {
  let content = 'Client = Digital Domain Technologies Test Site<br> Sample Tracking Data for Adobe Analytics<br>';
  try {
    if (window.cmsplus.track) {
      if (window.cmsplus.track.page) {
        content += window.cmsplus.track.page;
      }
      if (window.cmsplus.track.content) {
        content += window.cmsplus.track.content;
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('failed to add cmsplus data to debug', e);
  }
  return content;
}
