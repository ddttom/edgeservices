function findTitleElement() {
  const h1 = document.querySelector('h1'); // Prioritize H1
  if (h1) return h1;

  // Look in more specific areas (adjust selectors as needed)
  const mainContent = document.querySelector('main') || document.querySelector('article');
  if (mainContent) {
    const potentialText = mainContent.firstChild;
    if (potentialText && potentialText.nodeType === Node.TEXT_NODE) {
      return potentialText;
    }
  }
  return null; // No suitable title found
}

export function createTitle() {
  const metaTitle = document.querySelector('meta[name="title"]');
  if (!metaTitle) {
    const titleElement = findTitleElement();
    if (titleElement) {
      const defaultTitle = titleElement.textContent.trim();
      const title = document.createElement('meta');
      title.name = 'title';
      title.content = defaultTitle;
      document.head.appendChild(title);
    }
  }
}
export async function cleanDom() {
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
}
export function removeCommentBlocks() {
  document.querySelectorAll('div.section-metadata.comment').forEach((section) => section.remove());
}
function sanitize(url) {
  let ret = url.trim();
  if (!ret.endsWith('/')) {
    ret = `${ret}/`;
  }
  return ret;
}
export function makeLinksRelative() {
  const domains = [];
  domains.push(sanitize(window.location.origin));
  const finalUrl = window.siteConfig['$system:url$'];
  if (finalUrl) {
    domains.push(sanitize(finalUrl));
  }
  const links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i += 1) {
    const link = links[i];
    const href = link.getAttribute('href');
    if (href) {
      for (let j = 0; j < domains.length; j += 1) {
        const domain = domains[j];
        if (href.startsWith(domain)) {
          const relativePath = href.slice(domain.length);
          link.setAttribute('href', relativePath);
          break;
        }
      }
    }
  }
}
export function addByLine() {
  if (window.siteConfig['$system:addbyline$'] === 'true') {
    const firstH1 = document.querySelector('h1');
    if (window.siteConfig['$system:addbyline$'] === 'true') {
      if (!window.siteConfig['$meta:suppressbyline$']) {
        if (firstH1) {
          const appendString = `Published: ${window.siteConfig['$system:dateinenglish$']}; By ${window.siteConfig['$meta:author$']},  ${window.siteConfig['$page:readspeed$']} </strong>minute(s) reading.`;
          // Append the constructed string to the h1 element's current content
          const newElement = document.createElement('div');
          newElement.className = 'byLine';
          newElement.innerHTML = appendString;
          firstH1.insertAdjacentElement('afterend', newElement);
        }
      }
    }
  }
}
export function removeMeta() {
  const metadataNames = [
    'description',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
    'referrer',
    'viewport',
    'og:title',
    'og:description',
    'og:image',
    'og:type',
    'og:url',
    'og:site_name',
    'keywords'
  ];
  const elements = document.querySelectorAll('meta[name]');

  elements.forEach((element) => {
    const name = element.getAttribute('name');
    if (!metadataNames.includes(name)) {
      element.remove();
    }
  });
}

export function initialize() {
}
initialize();
