// Place any Client- Centered Code/  Configuration in here /

import { initialize as initTracker } from './adobe-metadata.js';

export async function initialize() {
  window.cmsplus.callbackMetadataTracker = initTracker;
}
initialize();
