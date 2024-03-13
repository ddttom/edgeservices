/* eslint-disable import/prefer-default-export */

// Place any Client- Centered Code/  Configuration in here /

import { initialize as initTracker } from './adobe-metadata.js';

export async function initialize() {
  window.cmsplus.bubbleallowed = false; // window.cmsplus.environment === 'production';
  window.metadataTracker = initTracker();
}
