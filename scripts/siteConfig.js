/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
import {
  initialize as initClientConfig,
} from './clientConfig.js';

export const siteConfig = {};

export function logError(message) {
  // eslint-disable-next-line no-console
  console.error(message);
}

export async function loadConfiguration() {
  const configUrl = new URL('/config/variables.json', window.location.origin);

  try {
    const response = await fetch(configUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
    }
    const jsonData = await response.json();
    // eslint-disable-next-line no-restricted-syntax
    for (const entry of jsonData.data) {
      siteConfig[entry.Item] = entry.Value;
    }
    const now = new Date().toISOString();
    const today = now.split('T')[0];
    let href = '';
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) { // Make sure the element was found
      href = canonicalLink.href;
    }
    const pname = new URL(window.location.href).pathname;

    const text = document.body.innerText; // Get the visible text content of the body
    const wordCount = text.split(/\s+/).filter(Boolean).length; // Split by whitespace and count
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const thismonth = new Date().getMonth();
    const winloc = window.location.href;
    siteConfig['$page.location$'] = winloc;
    siteConfig['$page:url$'] = href;
    siteConfig['$page:name$'] = pname;
    siteConfig['$page:path$'] = (`${winloc}?`).split('?')[0];
    siteConfig['$page:wordcount$'] = wordCount;
    siteConfig['$page:linkcount$'] = document.querySelectorAll('a').length;
    siteConfig['$page:readspeed$'] = (Math.ceil(wordCount / 120) + 1).toString();
    siteConfig['$page:title$'] = document.title;
    siteConfig['$page:canonical$'] = href;
    siteConfig['$system:platformVersion$'] = 'Franklin++ 1.0.0';
    siteConfig['$system:date$'] = today;
    siteConfig['$system:isodate$'] = now;
    siteConfig['$system:time$'] = new Date().toLocaleTimeString();
    siteConfig['$system:timezone$'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    siteConfig['$system:locale$'] = Intl.DateTimeFormat().resolvedOptions().locale;
    siteConfig['$system:year$'] = new Date().getFullYear();
    siteConfig['$system:month$'] = thismonth + 1;
    siteConfig['$system:monthinfull$'] = months[thismonth];
    siteConfig['$system:day$'] = new Date().getDate();
    siteConfig['$system:hour$'] = new Date().getHours();
    siteConfig['$system:minute$'] = new Date().getMinutes();
    siteConfig['$system:second$'] = new Date().getSeconds();
    siteConfig['$system:millisecond$'] = new Date().getMilliseconds();
    siteConfig['$system:dateinenglish$'] = `${siteConfig['$system:monthinfull$']} ${siteConfig['$system:day$']}, ${siteConfig['$system:year$']}`;

    const metaTags = document.querySelectorAll('meta');

    metaTags.forEach((metaTag) => {
      let key = metaTag.getAttribute('name') || metaTag.getAttribute('property');
      const value = metaTag.getAttribute('content');
      if (key && value) {
        let prefix = '';
        if (!key.includes(':')) {
          prefix = 'meta:';
        }
        if (key.includes('meta:og:') || key.includes('meta:twitter:')) {
          key.replace('meta:', '');
        }
        if (key === 'og:image:secure_url') {
          key = 'og:image_secure_url';
        }
        siteConfig[`$${prefix}${key}$`] = value;
      }
      if (siteConfig['$meta:author$'] == null) {
        siteConfig['$meta:author$'] = siteConfig['$company:name$'];
      }
      if (siteConfig['$meta:contentauthor$'] == null) {
        siteConfig['$meta:contentauthor$'] = siteConfig['$meta:author$'];
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Configuration load error: ${error.message}`);
    throw error; // Rethrow for potential handling at a higher level
  }
  return siteConfig;
}

export function extractJsonLd(parsedJson) {
  const jsonLd = { };
  const hasDataArray = 'data' in parsedJson && Array.isArray(parsedJson.data);
  if (hasDataArray) {
    parsedJson.data.forEach((item) => {
      let key = item.Item.trim().toLowerCase();
      const reservedKeySet = new Set(['type', 'context', 'id', 'value', 'reverse', 'container', 'graph']);
      if (reservedKeySet.has(key)) {
        key = `@${key}`;
      }
      const value = item.Value.trim();
      jsonLd[key] = value;
    });
    return jsonLd;
  }
  return parsedJson;
}
export function extractJsonTracker(parsedJson) {
  return parsedJson;
}
function replaceTokens(data, text) {
  let ret = text;
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const key in data) {
    const value = data[key];
    ret = ret.replaceAll(key, value);
  }
  return ret;
}

async function handleMetadataTracking() {
  if (siteConfig['$meta:tracking$'] != null) {
    const trackerlist = siteConfig['$meta:tracking$'];
    const trackers = trackerlist.split(',');
    for (let i = 0; i < trackers.length; i += 1) {
      const tracker = trackers[i].trim();
      let trackerUrl = tracker;
      if (trackerUrl) {
        trackerUrl = `${window.location.origin}/config/tracking/datalayer${trackerUrl}view.json`;
        try {
          const resp = await fetch(trackerUrl);
          if (!resp.ok) {
            throw new Error(`Failed to fetch ${trackerUrl} content: ${resp.status}`);
          }
          const json = await resp.json();
          let jsonString = JSON.stringify(json);
          jsonString = replaceTokens(siteConfig, jsonString);
          // Create and append a new script element with the processed JSON
          const script = document.createElement('script');
          script.type = 'text/javascript';
          let buildscript = `let datalayer${tracker} = ${jsonString};`;
          if (tracker === 'page') {
            buildscript += 'datalayerpage.page.pageQueryString = window.location.search;';
            buildscript += 'datalayerpage.page.previousPageURL = document.referrer;';
            buildscript += 'const url = new URL(datalayerpage.page.previousPageURL); const pathname = url.pathname.startsWith("/") ? url.pathname.substring(1) : url.pathname;';
            buildscript += 'datalayerpage.page.previousPageName = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;';
          }
          script.innerHTML = buildscript;
          document.head.appendChild(script);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Failed to load ${trackerUrl} content: ${error.message}`);
        }
      }
    }
  }
}
async function handleMetadataJsonLd() {
  if (!document.querySelector('script[type="application/ld+json"]')) {
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
      let jsonString = JSON.stringify(json);
      jsonString = replaceTokens(siteConfig, jsonString);
      // Create and append a new script element with the processed JSON-LD data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-role', content.split('/').pop().split('.')[0]); // Set role based on the final URL
      script.textContent = jsonString;
      document.head.appendChild(script);
      document.querySelectorAll('meta[name="longdescription"]').forEach((section) => section.remove());
    } catch (error) {
    // no schema.org for your content, just use the content as is
      logError('Error processing JSON-LD metadata:', error);
    }
  }
}
export function removeCommentBlocks() {
  document.querySelectorAll('div.section-metadata.comment').forEach((section) => section.remove());
}

// `initialize` function to kick things off
export async function initialize() {
  await loadConfiguration();
  initClientConfig();
  const main = document.querySelector('main');
  if (main) {
    removeCommentBlocks(main);
    handleMetadataJsonLd(main);
    handleMetadataTracking(main);
    const metadataNames = [
      'pagereviewdate',
      'pageembargodate',
      'pagepublisheddate',
      'pagecopyright',
      'pagecopyright-cc',
      'videourl',
      'contenttype',
      'contenttopic',
      'contenttechnology',
      'contentcompany',
      'contentindustry',
      'tracking',
      'category',
      'contenttitle',
      'contenttype',
      'contenttopic',
      'contenttechnology',
      'contentcompany',
      'contentindustry',
      'contentauthor',
    ];
    if (siteConfig['$system:addbyline$'] === 'true') {
      const firstH1 = document.querySelector('h1');
      if (firstH1) {
        const appendString = `Published: ${siteConfig['$system:dateinenglish$']}; By ${siteConfig['$meta:author$']},  ${siteConfig['$page:readspeed$']} </strong>minute(s) reading.`;
        // Append the constructed string to the h1 element's current content
        const newElement = document.createElement('div');
        newElement.className = 'byLine';
        newElement.innerHTML = appendString;
        firstH1.insertAdjacentElement('afterend', newElement);
      }
    }
    // Loop through the array of metadata names
    metadataNames.forEach((name) => {
      // Select all elements with the specified name attribute
      const elements = document.querySelectorAll(`meta[name="${name}"]`);

      // Loop through the NodeList of elements and remove each one
      elements.forEach((element) => {
        element.remove();
      });
    });
  }
}
