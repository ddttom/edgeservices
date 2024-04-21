/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
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
export default async function possibleMobileFix(container) {
  // Select the element by its class

  const firstPicture = document.querySelector(`.${container} > div:first-of-type picture`);
  const secondPicture = document.querySelector(`.${container} > div:first-of-type > div:nth-of-type(2) picture`);

  if (firstPicture && secondPicture) {
    // Select the second source element from the second picture element
    const secondSource = secondPicture.querySelector('source:nth-of-type(2)');

    if (secondSource) {
      const newSource = secondSource.cloneNode(true);
      const firstPictureSecondSource = firstPicture.querySelector('source:nth-of-type(2)');

      if (firstPictureSecondSource) {
        firstPicture.replaceChild(newSource, firstPictureSecondSource);
      } else {
        firstPicture.appendChild(newSource);
      }

      secondPicture.remove();
    }
  }
}
/**
 * Adds a <meta> element to the <head> of the document with the given name and content.
 * If a meta element with the given name already exists, it is not added.
 * @param {string} name The name of the meta element.
 * @param {string} content The content of the meta element.
 */
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

export async function tidyDOM() {
  if (document.querySelector('coming-soon')) {
    DocumentFragment.body.classList.add('hide');
  }
  // ---- Remove title from link with images ----- //
  // Find all <a> tags in the document
  const links = document.querySelectorAll('a');
  const containsVisualElements = (link) => link.querySelectorAll('img') || link.querySelector('picture') || link.querySelector('i[class^="icon"], i[class*=" icon"], i[class^="fa"], i[class*=" fa"]');

  // Remove title from link
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

  // Open external link in the new window
  links.forEach((link) => {
    const linkDomain = new URL(link.href).hostname;
    if (linkDomain !== siteDomain && !link.href.startsWith('/') && !link.href.startsWith('#')) {
      link.setAttribute('target', '_blank');
    }
  });

  // Add current class to any current visited
  links.forEach((link) => {
    if (link.href === currentPage) {
      link.classList.add('current');
    }
  });

  // Add dynamic width a nd height to all SVG image
  const imgSvg = document.querySelectorAll('img[src$=".svg"]');
  imgSvg.forEach((img) => {
    const imgWidth = img.clientWidth;
    const imgHeight = img.clientHeight;
    img.setAttribute('width', imgWidth);
    img.setAttribute('height', imgHeight);
  });

  // Script fetching Lighthouse result via API
  function setUpQuery(category) {
    const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    const apiKey = `${window.siteConfig['$system:.lighthousekey$']}`;
    const parameters = {
      url: encodeURIComponent(`${window.cmsplus.siteConfig['$system:lighthouseurl']}`),
      key: apiKey, // Include the API key in the parameters.
      category,
      strategy: 'DESKTOP'
    };
    let query = `${api}?`;
    for (const key in parameters) { // Correctly declare key with let
      query += `${key}=${parameters[key]}&`;
    }
    return query.slice(0, -1); // Remove the trailing '&' from the query string
  }

  function wrapper(category, results) {
    const url = setUpQuery(category);
    return fetch(url)
      .then((response) => response.json())
      .then((json) => {
        // Push the category and analysisUTCTimestamp to results array
        results.push({ category, data: json.lighthouseResult.categories });
      })
      .catch((error) => console.error('Error fetching PageSpeed Insights:', error));
  }

  async function run() {
    const categories = [
      'ACCESSIBILITY',
      'BEST_PRACTICES',
      'PERFORMANCE',
      'SEO'
    ];
    const promises = [];
    const results = [];
    categories.forEach((category) => {
      promises.push(wrapper(category, results)); // Pass current timestamp
    });
    await Promise.all(promises);

    results.forEach((item) => {
      const categoryObject = item.data;
      for (const category in categoryObject) {
        const details = categoryObject[category];
        const scoreValue = `${details.score * 100}`;
        const elementId = category.toLowerCase();
        const element = document.getElementById(elementId);

        if (element) {
          element.innerText = `${scoreValue}%`;
          element.setAttribute('aria-valuenow', scoreValue);
          element.setAttribute('style', `--value: ${scoreValue}`);
        }

        // Dynamically inject style for progress animation and content counter
        const dynamicStyleId = 'dynamicScoreStyle';
        let styleTag = document.getElementById(dynamicStyleId);
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = dynamicStyleId;
          document.head.appendChild(styleTag);
        }
        styleTag.textContent = `
          .score-value::after {
              content: '${scoreValue}%' !important;
              counter-reset: percentage ${scoreValue} !important;
          }
          `;
      }
    });

    // Function to reset score styles to zero
    function resetScoreStyles() {
      const styleTag = document.getElementById('dynamicScoreStyle');
      if (styleTag) {
        styleTag.textContent = `
          .score-value::after {
              content: '0%';
              counter-reset: percentage 0;
          }
      `;
      }
    }

    function initializeObserver() {
      const body = document.querySelector('body');
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const modalOpen = body.classList.contains('modal-open');
            if (modalOpen) {
              run(); // Run the PageSpeed tests when modal is opened
            } else {
              resetScoreStyles(); // Reset styles when modal is closed
            }
          }
        });
      });

      const observerConfig = {
        attributes: true,
        attributeFilter: ['class'],
        subtree: true
      };

      observer.observe(body, observerConfig);
    }

    // Set everything up
    initializeObserver();

    const modalBox = document.querySelector('.modal-content');
    const heroItem = modalBox.querySelector('.modal-hero div');

    // Get the current date and time
    const now = new Date();

    // Options for formatting the date and time
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };

    // Create a formatter for the locale 'en-US' (you can change this to match your user's locale)
    const formatter = new Intl.DateTimeFormat('en-UK', options);

    // Format the current date and time
    const prettyDate = formatter.format(now);

    // Create a paragraph element to display the formatted date and time
    const currentTestDataPar = document.createElement('p');
    currentTestDataPar.textContent = prettyDate;

    // Append the paragraph to the hero item
    heroItem.appendChild(currentTestDataPar);
  }
  possibleMobileFix('hero');
  if ((window.cmsplus?.siteConfig?.['$system:lighthouseurl'] ?? '') !== '') {
    run();
  }
}
/*
export async function cleanDOM() {

  // ---- Remove title from link with images ----- //
  // Find all <a> tags in the document
  const links = document.querySelectorAll('a');
  const containsVisualElements = (link) => link.querySelectorAll('img') ||
   link.querySelector('picture') ||
   link.querySelector('i[class^="icon"], i[class*=" icon"], i[class^="fa"], i[class*=" fa"]');

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
  possibleMobileFix('hero');
}
*/
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
