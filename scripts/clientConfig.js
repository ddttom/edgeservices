/* eslint-disable import/prefer-default-export */

// Place any Client- Centered Code/  Configuration in here /

// eslint-disable-next-line import/extensions
import { initialize as initTracker } from './adobe-metadata.js';

export async function initialize() {
  window.siteConfig['$system:analyticsdelay$'] = 3000;
  window.metadataTracker = initTracker;
}
