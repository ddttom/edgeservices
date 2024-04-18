// Place any Client- Centered Code/  Configuration in here /

// eslint-disable-next-line import/extensions
import { initialize as initTracker } from './adobe-metadata.js';

export async function initialize() {
  window.metadataTracker = initTracker;
}
initialize();
