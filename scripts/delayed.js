import { sampleRUM, loadScript } from './aem.js';
import { initialize as initLaunch } from './launch.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

// ---- Remove title from link with images ----- //
// Find all <a> tags in the document
const links = document.querySelectorAll('a');
const containsVisualElements = (link) => link.querySelectorAll('img') || link.querySelector('picture') || link.querySelector('i[class^="icon"], i[class*=" icon"], i[class^="fa"], i[class*=" fa"]');

links.forEach((link) => {
  if (containsVisualElements(link)) {
    // If a title attribute exists, remove it
    if (link.hasAttribute('title')) {
      link.removeAttribute('title');
    }
  }
});

if (window.cmsplus.analyticsdelay > 0) {
  initLaunch();
}
if (window.cmsplus.bubbleallowed === true) {
  window.danteEmbed = `https://chat.dante-ai.com/embed?${window.cmsplus.bubble}&mode=false&bubble=true&image=null&bubbleopen=false`;
  // eslint-disable-next-line no-undef
  loadScript('https://chat.dante-ai.com/bubble-embed.js');
  // eslint-disable-next-line no-undef
  loadScript('https://chat.dante-ai.com/dante-embed.js');
}
