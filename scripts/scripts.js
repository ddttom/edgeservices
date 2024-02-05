/* eslint-disable no-unused-vars */
import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  createOptimizedPicture as libCreateOptimizedPicture,
  loadCSS,
  decorateBlock,
  loadBlock, updateSectionsStatus,
} from './aem.js';

const setDelayed = true; // do (true) or not do (false) final load.
const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */

function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', {
      elems: [picture, h1],
    }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // eslint-disable-next-line no-use-before-define
    removeCommentBlocks(main);
  } catch (error) {
  // eslint-disable-next-line no-console
    console.error('remove comments failed', error);
  }
  // eslint-disable-next-line no-use-before-define
  try {
    // eslint-disable-next-line no-use-before-define
    findMetadataJsonLdBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('find metadata block failed', error);
  }
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // eslint-disable-next-line no-use-before-define
  decorateExternalImages(main, '//External Image//');
  // eslint-disable-next-line no-use-before-define
  decorateExternalImages(main);
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);

  // START *THC*
  //
  //
  //
  const path = window.location.pathname;

  function alert(message, error) {
    // eslint-disable-next-line no-console
    console.error(message, error);
  }
  async function configure() {
    const jsonDataUrl = `${window.location.origin}/config/config.json`;
    let json = null;
    try {
      const resp = await fetch(jsonDataUrl);
      if (!resp.ok) {
        throw new Error(`Failed to fetch config: ${resp.status}`);
      }
      json = await resp.json();
    } catch (error) {
      alert(`Failed  ${error.message}`, '');
    }
    json.data.forEach((item) => {
      const key = (item.Item);
      window.config[key] = item.Value;
    });
  }
  window.siteconfig = {};
  configure();

  if (path.includes('webasto')) {
    document.body.classList.add('webasto');
  }
  if (path.includes('techem')) {
    document.body.classList.add('techem');
  }
}

function extractJsonLd(parsedJson) {
  const jsonLd = {
    // eslint-disable-next-line quotes
    "@context": "https://schema.org",
    // eslint-disable-next-line quotes
    "@type": "Organization",
  };

  parsedJson.data.forEach((item) => {
    const key = Object.keys(item)[1]; // Assuming the second key is the property key
    let value = item[key];

    // Remove the leading and trailing quotes
    if (typeof value === 'string') {
      // eslint-disable-next-line no-useless-escape
      value = value.replace(/^\"|\"$/g, '');
    }

    // eslint-disable-next-line quotes
    jsonLd[item["@context"]] = value;
  });

  return jsonLd;
}

function replacePlaceHolders(contentString) {
  // Initialize ret with the contentString value
  let ret = contentString;
  //
  const twitterImagePlaceholder = '$twitter:image';
  if (ret.includes(twitterImagePlaceholder)) {
    const metaElement = document.querySelector('meta[name="twitter:image"]');
    const twitterImageContent = metaElement ? metaElement.getAttribute('content') : '';
    ret = ret.replace(twitterImagePlaceholder, twitterImageContent);
  }
  const datePlaceholder = '$system:date';
  // Replace $date with today's date if it exists
  if (ret.includes(datePlaceholder)) {
    const today = new Date();
    // Format today's date as YYYY-MM-DD or any other preferred format
    const dateString = today.toISOString().split('T')[0];
    ret = ret.replace(datePlaceholder, dateString);
  }
  if (ret.includes('$company:name')) {
    ret = ret.replace('$company:name', window.siteconfig.company.name);
  }
  if (ret.includes('$company:logo')) {
    ret = ret.replace('$company:logo', window.siteconfig.company.logo);
  }
  if (ret.includes('$company:url')) {
    ret = ret.replace('$company:url', window.siteconfig.company.url);
  }
  if (ret.includes('$company:email')) {
    ret = ret.replace('$company:email', window.siteconfig.company.email);
  }
  if (ret.includes('$company:phone')) {
    ret = ret.replace('$company:phone', window.siteconfig.company.phone);
  }
  return ret;
}

async function findMetadataJsonLdBlock() {
  // Check if a script of type application/ld+json is already present in the document
  const existingJsonLdScript = document.querySelector('script[type="application/ld+json"]');
  if (!existingJsonLdScript) {
    let jsonLdMetaElement = document.querySelector('meta[name="json-ld"]');
    if (!jsonLdMetaElement) {
      jsonLdMetaElement = document.createElement('meta');
      jsonLdMetaElement.setAttribute('name', 'json-ld');
      jsonLdMetaElement.setAttribute('content', 'owner'); // Default role
      document.head.appendChild(jsonLdMetaElement);
    }
    const content = jsonLdMetaElement.getAttribute('content');
    jsonLdMetaElement.remove();
    // assume we have an url, if not we have a role -  construct url on the fly
    let jsonDataUrl = content;
    try {
      // Attempt to parse the content as a URL
      // eslint-disable-next-line no-new
      new URL(content);
    } catch (error) {
      // Content is not a URL, construct the JSON-LD URL based on content and current domain
      jsonDataUrl = `${window.location.origin}/config/json-ld/${content}.json`;
    }
    try {
      const resp = await fetch(jsonDataUrl);
      if (!resp.ok) {
        throw new Error(`Failed to fetch JSON-LD content: ${resp.status}`);
      }
      let json = await resp.json();
      json = extractJsonLd(json);
      let jsonString = JSON.stringify(json).replaceAll('ld@', '@');
      jsonString = replacePlaceHolders(jsonString);
      // Create and append a new script element with the processed JSON-LD data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-role', content.split('/').pop().split('.')[0]); // Set role based on the final URL
      script.textContent = jsonString;
      document.head.appendChild(script);
    } catch (error) {
      // no schema.org for your content, just use the content as is
      // eslint-disable-next-line no-console
      console.error('Error processing JSON-LD metadata:', error);
    }
  }
}
function removeCommentBlocks(main) {
  const sections = document.querySelectorAll('div.section-metadata.comment');
  sections.forEach((section) => {
    section.remove();
  });
}

// END *THC*
/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const {
    hash,
  } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  if (!window.hlx.suppressFrame) {
    loadHeader(doc.querySelector('header'));
    loadFooter(doc.querySelector('footer'));
  }

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  if (setDelayed) {
    window.setTimeout(() => import('./delayed.js'), 3000);
  }
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('suppressFrame')) {
    window.hlx.suppressFrame = true;
    document.body.querySelector('header').remove();
    document.body.querySelector('footer').remove();
  }

  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

/**
 * Gets the extension of a URL.
 * @param {string} url The URL
 * @returns {string} The extension
 * @private
 * @example
 * get_url_extension('https://example.com/foo.jpg');
 * // returns 'jpg'
 * get_url_extension('https://example.com/foo.jpg?bar=baz');
 * // returns 'jpg'
 * get_url_extension('https://example.com/foo');
 * // returns ''
 * get_url_extension('https://example.com/foo.jpg#qux');
 * // returns 'jpg'
 */
function getUrlExtension(url) {
  return url.split(/[#?]/)[0].split('.').pop().trim();
}

/**
 * Checks if an element is an external image.
 * @param {Element} element The element
 * @param {string} externalImageMarker The marker for external images
 * @returns {boolean} Whether the element is an external image
 * @private
 */
function isExternalImage(element, externalImageMarker) {
  // if the element is not an anchor, it's not an external image
  if (element.tagName !== 'A') return false;

  // if the element is an anchor with the external image marker as text content,
  // it's an external image
  if (element.textContent.trim() === externalImageMarker) {
    return true;
  }

  // if the element is an anchor with the href as text content and the href has
  // an image extension, it's an external image
  if (element.textContent.trim() === element.getAttribute('href')) {
    const ext = getUrlExtension(element.getAttribute('href'));
    return ext && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext.toLowerCase());
  }

  return false;
}

/*
 * Appends query params to a URL
 * @param {string} url The URL to append query params to
 * @param {object} params The query params to append
 * @returns {string} The URL with query params appended
 * @private
 * @example
 * appendQueryParams('https://example.com', { foo: 'bar' });
 * // returns 'https://example.com?foo=bar'
 */
function appendQueryParams(url, params) {
  const {
    searchParams,
  } = url;
  params.forEach((value, key) => {
    searchParams.set(key, value);
  });
  url.search = searchParams.toString();
  return url.toString();
}

/**
 * Creates an optimized picture element for an image.
 * If the image is not an absolute URL, it will be passed to libCreateOptimizedPicture.
 * @param {string} src The image source URL
 * @param {string} alt The image alt text
 * @param {boolean} eager Whether to load the image eagerly
 * @param {object[]} breakpoints The breakpoints to use
 * @returns {Element} The picture element
 *
 */
export function createOptimizedPicture(src, alt = '', eager = false, breakpoints = [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]) {
  const isAbsoluteUrl = /^https?:\/\//i.test(src);

  // Fallback to createOptimizedPicture if src is not an absolute URL
  if (!isAbsoluteUrl) return libCreateOptimizedPicture(src, alt, eager, breakpoints);

  const url = new URL(src);
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    const searchParams = new URLSearchParams({ width: br.width, format: 'webply' });
    source.setAttribute('srcset', appendQueryParams(url, searchParams));
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    const searchParams = new URLSearchParams({ width: br.width, format: ext });

    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', appendQueryParams(url, searchParams));
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
      img.setAttribute('src', appendQueryParams(url, searchParams));
    }
  });

  return picture;
}

/*
 * Decorates external images with a picture element
 * @param {Element} ele The element
 * @param {string} deliveryMarker The marker for external images
 * @private
 * @example
 * decorateExternalImages(main, '//External Image//');
 */
function decorateExternalImages(ele, deliveryMarker) {
  const extImages = ele.querySelectorAll('a');
  extImages.forEach((extImage) => {
    if (isExternalImage(extImage, deliveryMarker)) {
      const extImageSrc = extImage.getAttribute('href');
      const extPicture = createOptimizedPicture(extImageSrc);

      /* copy query params from link to img */
      const extImageUrl = new URL(extImageSrc);
      const {
        searchParams,
      } = extImageUrl;
      extPicture.querySelectorAll('source, img').forEach((child) => {
        if (child.tagName === 'SOURCE') {
          const srcset = child.getAttribute('srcset');
          if (srcset) {
            child.setAttribute('srcset', appendQueryParams(new URL(srcset, extImageSrc), searchParams));
          }
        } else if (child.tagName === 'IMG') {
          const src = child.getAttribute('src');
          if (src) {
            child.setAttribute('src', appendQueryParams(new URL(src, extImageSrc), searchParams));
          }
        }
      });
      extImage.parentNode.replaceChild(extPicture, extImage);
    }
  });
}

loadPage();
