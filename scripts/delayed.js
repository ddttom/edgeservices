import { sampleRUM } from './aem.js';
// import { initialize as initLaunch } from './launch.js';

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
  let initialize;
  const module = await import('./launch-dyn.js');
  // eslint-disable-next-line prefer-const
  initialize = module.default;
  initialize();
  // initLaunch(); // only client code in here
}
// Add button="role" to every blink with button class
const buttonRole = document.querySelectorAll('.button');
buttonRole.forEach((button) => {
  button.setAttribute('role', 'button');
});

// Add target blank to all external website linked on the website
// Get the current site's domain
const siteDomain = window.location.hostname;
const currentPage = window.location.href;

links.forEach((link) => {
  const linkDomain = new URL(link.href).hostname;
  if (linkDomain !== siteDomain && !link.href.startsWith('/') && !link.href.startsWith('#')) {
    link.setAttribute('target', '_blank');
  }
});

links.forEach((link) => {
  if (link.href === currentPage) {
    link.classList.add('current');
  }
});
