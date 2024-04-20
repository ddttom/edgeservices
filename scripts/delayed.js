/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { sampleRUM } from './aem.js';
// import { initialize as initLaunch } from './launch.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
// If you need any delayed stuff client-side add it to the callbackDelayedChain- see clientConfig.js
for (let i = 0; i < window.cmsplus.callbackDelayedChain.length; i++) {
  await window.cmsplus.callbackDelayedChain[i]();
}

function initialize() {
}
initialize();
