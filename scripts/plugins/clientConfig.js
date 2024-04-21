// Place any Client- Centered Code/  Configuration in here /
import { loadScript } from '../aem.js';

import { initialize as initTracker } from './adobe-metadata.js';

function enableDanteChat() {
  window.danteEmbed = `https://chat.dante-ai.com/embed?${window.cmsplus.helpapi}&mode=false&bubble=true&image=null&bubbleopen=false`;
  // eslint-disable-next-line no-undef
  loadScript('https://chat.dante-ai.com/bubble-embed.js');
  // eslint-disable-next-line no-undef
  loadScript('https://chat.dante-ai.com/dante-embed.js');
}

export default async function enableTracking() {
  //  Comwrap Specific
  const attrs = {
    id: 'Cookiebot',
    'data-cbid': '747c7864-bf4d-4b8f-9e92-69d5eb6be267',
    'data-blockingmode': 'auto',
  };
  await loadScript('https://consent.cookiebot.com/uc.js', attrs);
  await loadScript('https://assets.adobedtm.com/d4e187856f02/84a8f19b48f1/launch-9fc11833104d.min.js', {});
  loadScript('https://try.abtasty.com/54d41c1c745275ad6d723c2122a0693d.js', {});

  window.adobeDataLayer = window.adobeDataLayer || [];
  try {
    if (window.cmsplus.track) {
      if (window.cmsplus.track.page) {
        window.adobeDataLayer.push(window.cmsplus.track.page);
      }
      if (window.cmsplus.track.content) {
        window.adobeDataLayer.push(window.cmsplus.track.content);
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('failed to add cmsplus data to adobeDataLayer', e);
  }
}

export async function initialize() {
  window.cmsplus.callbackMetadataTracker = initTracker;
  if (window.siteConfig['$system:allowtracking$'] === 'y') {
    window.cmsplus.callbackLastChanceChain.push(enableTracking);
  }
  if (((window.cmsplus.helpapi) || '').length > 0) {
    window.cmsplus.callbackDelayedChain.push(enableDanteChat);
  }
}
initialize();
