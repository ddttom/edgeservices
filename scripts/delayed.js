/* eslint-disable import/extensions */
import { sampleRUM } from './aem.js';
// import { initialize as initLaunch } from './launch.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

// any client with dante ai chatbot will need to add this
if (window.cmsplus.bubble.trim().length > 0) {
  window.danteEmbed = `https://chat.dante-ai.com/embed?${window.cmsplus.bubble}&mode=false&bubble=true&image=null&bubbleopen=false`;
  // eslint-disable-next-line no-undef
  loadScript('https://chat.dante-ai.com/bubble-embed.js');
  // eslint-disable-next-line no-undef
  loadScript('https://chat.dante-ai.com/dante-embed.js');
}
