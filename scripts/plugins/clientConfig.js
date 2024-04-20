// Place any Client- Centered Code/  Configuration in here /
import { initialize as initTracker } from './adobe-metadata.js';

function enableDanteChat() {
  window.danteEmbed = `https://chat.dante-ai.com/embed?${window.cmsplus.helpapi}&mode=false&bubble=true&image=null&bubbleopen=false`;
  // eslint-disable-next-line no-undef
  loadScript('https://chat.dante-ai.com/bubble-embed.js');
  // eslint-disable-next-line no-undef
  loadScript('https://chat.dante-ai.com/dante-embed.js');
}

export async function initialize() {
  window.cmsplus.callbackMetadataTracker = initTracker;
  if (((window.cmsplus.helpapi) || '').length > 0) {
    window.cmsplus.callbackChain.push(enableDanteChat);
  }
}
initialize();
