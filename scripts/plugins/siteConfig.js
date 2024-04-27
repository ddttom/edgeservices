/* site configuration module */
/*

   ++++++++++++++++++++++++++++++++++++++++++++++++++

   NOTHING iN HERE CAN USE OR DERIVE FROM siteConfig
   i.e no use of siteConfig['$meta:author$'] etc
   The stuff in here has to be supe4r fast
   do not use ffetch or loading 3rd party libs
   all such things should be done in their own plugin

   ++++++++++++++++++++++++++++++++++++++++++++++++++
*/

import {
  tidyDOM
} from './reModelDom.js';

import {
  // eslint-disable-next-line comma-dangle
  constructGlobal
} from './variables.js';

import { initialize as initClientConfig } from './clientConfig.js';

import { handleMetadataJsonLd, createJSON } from './jsonHandler.js';

await import('../../config/config.js');

function noAction() {
}

// Determine the environment and locality based on the URL
const getEnvironment = () => {
  if (window.location.href.includes('.html')) {
    return 'final';
  } if (window.location.href.includes('hlx.page')) {
    return 'preview';
  } if (window.location.href.includes('hlx.live')) {
    return 'live';
  }
  return 'unknown';
};

const getLocality = () => {
  if (window.location.href.includes('localhost')) {
    return 'local';
  } if (window.location.href.includes('stage')) {
    return 'stage';
  } if (window.location.href.includes('prod')) {
    return 'prod';
  } if (window.location.href.includes('dev')) {
    return 'dev';
  }
  return 'unknown';
};

window.cmsplus = {
  environment: getEnvironment(),
  locality: getLocality(),
};
window.cmsplus.callbackPageLoadChain = [];
window.cmsplus.callbackAfter3SecondsChain = [];

window.cmsplus.callbackAfter3SecondsChain.push(noAction); // set up nop.
window.cmsplus.callbackPageLoadChain.push(noAction); // set up nop.

constructGlobal();

if (window.cmsplus.environment === 'preview') {
  await import('./debugPanel.js');
}

initClientConfig(); // *********   siteConfig is ready now *******

// all configuration completed, make any further callbacks from here

// window.cmsplus.loadDelayed = function loadDelayed() {
// window.setTimeout(() => import('../delayed.js'), window.cmsplus.analyticsdelay);
// };

export async function initialize() {
  await tidyDOM();
  await createJSON();
  await handleMetadataJsonLd();
  await window.cmsplus?.callbackMetadataTracker?.();
  if (window.cmsplus.environment !== 'final') {
    window.cmsplus.callbackCreateDebug?.();
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const callback of window.cmsplus.callbackPageLoadChain) {
    // eslint-disable-next-line no-await-in-loop
    await callback();
  }
}

initialize();
