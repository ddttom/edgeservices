/* site configuration module */
/* NOTHING iN HERE CAN USE OR DERIVE FROM siteConfig */

import {
  createTitle,
  makeLinksRelative,
  tidyDOM,
  removeCommentBlocks,
  addByLine,
  removeMeta
} from './reModelDom.js';

import {
  // eslint-disable-next-line comma-dangle
  constructGlobal
} from './variables.js';

import { createJSON, handleMetadataJsonLd } from './jsonHandler.js';

const config = require('./config.json');

window.finalUrl = config.host;

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

window.siteConfig = {};

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
await import('./clientConfig.js');

// all configuration completed, make any further callbacks from here

window.cmsplus.loadDelayed = function loadDelayed() {
  window.setTimeout(() => import('../delayed.js'), window.cmsplus.analyticsdelay);
};

export async function initialize() {
  await makeLinksRelative();
  await tidyDOM();
  await createTitle();
  await createJSON();
  await removeCommentBlocks();
  await handleMetadataJsonLd();

  await window.cmsplus?.callbackMetadataTracker?.();
  if (window.cmsplus.environment !== 'final') {
    window.cmsplus.callbackCreateDebug?.();
  }
  await addByLine();
  await removeMeta();
  // eslint-disable-next-line no-restricted-syntax
  for (const callback of window.cmsplus.callbackPageLoadChain) {
    // eslint-disable-next-line no-await-in-loop
    await callback();
  }
}

initialize();
