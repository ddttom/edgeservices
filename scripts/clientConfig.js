/* eslint-disable import/prefer-default-export */

// Place any Client- Centered Code/  Configuration in here /

import { initialize as initTracker } from './adobe-metadata.js';

export async function initialize() {
  window.siteConfig['$system:analyticsdelay$'] = 3000;
  window.cmsplus.bubbleallowed = false; // window.cmsplus.environment === 'production';
  window.metadataTracker = initTracker;
}
export function loadClientDebugPanel() {
  const content = 'Client = Digital Domain Technologies Test Site<br>';
  return content;
}
