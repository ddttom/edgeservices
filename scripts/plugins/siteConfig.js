/* eslint-disable no-console */
/* site configuration module */
import {
  createTitle,
  cleanDom,
  makeLinksRelative,
  removeCommentBlocks,
  addByLine,
  removeMeta
} from './reModelDom.js';
import {
  constructGlobal
} from './variables.js';
import { createJSON, handleMetadataJsonLd } from './jsonHandler.js';

window.siteConfig = window.siteConfig || {};
window.cmsplus = window.cmsplus || {};

if (window.cmsplus.environment === 'preview') {
  await import('./debugPanel.js');
}
await import('./clientConfig.js');

// all configuration completed, make any further callbacks from here

window.cmsplus.loadDelayed = function loadDelayed() {
  window.setTimeout(() => import('../delayed.js'), window.cmsplus.analyticsdelay);
};

export async function initialize() {
  await constructGlobal();
  await createTitle();
  await createJSON();
  await handleMetadataJsonLd();
  if (window.cmsplus.analyticsdelay > 0) {
    await import('./launch-dyn.js');
  }
  await removeCommentBlocks();
  await makeLinksRelative();
  await cleanDom();

  await window.cmsplus?.callbackMetadataTracker?.();
  if (window.cmsplus.environment !== 'final') {
    window.cmsplus?.callbackCreateDebug?.();
  }
  await addByLine();
  await removeMeta();
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
initialize();
