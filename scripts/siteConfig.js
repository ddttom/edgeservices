/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
import {
  initialize as initClientConfig
} from './clientConfig.js';

export const siteConfig = {};
export const dc = {};
export const co = {};

window.cmsplus = window.cmsplus || {};

// Determine the environment based on the URL
let environment = 'unknown'; // Start with the default

// Use simple string checks for each environment
if (window.location.href.includes('.html')) {
  environment = 'final';
} else if (window.location.href.includes('.page')) {
  environment = 'preview';
} else if (window.location.href.includes('.live')) {
  environment = 'live';
}
window.cmsplus.environment = environment;
function replaceTokens(data, text) {
  let ret = text;
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const item = key;
      const value = data[item];
      ret = ret.replaceAll(item, value);
    }
  }
  return ret;
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

async function handleMetadataJsonLd() {
  let jsonString = '';
  if (!document.querySelector('script[type="application/ld+json"]')) {
    let jsonLdMetaElement = document.querySelector('meta[name="json-ld"]');
    if (!jsonLdMetaElement) {
      jsonLdMetaElement = document.createElement('meta');
      jsonLdMetaElement.setAttribute('name', 'json-ld');
      jsonLdMetaElement.setAttribute('content', 'owner');
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
      jsonString = JSON.stringify(json, null, '\t');
      jsonString = replaceTokens(siteConfig, jsonString);
      // Create and append a new script element with the processed JSON-LD data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-role', content.split('/').pop().split('.')[0]); // Set role based on the final URL
      jsonLdMetaElement.setAttribute('id', 'ldMeta');
      script.textContent = jsonString;
      document.head.appendChild(script);
      document.querySelectorAll('meta[name="longdescription"]').forEach((section) => section.remove());
    } catch (error) {
    // no schema.org for your content, just use the content as is
      console.error('Error processing JSON-LD metadata:', error);
    }
  }
  return jsonString;
}

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
const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

function getMonthNumber(monthName) {
  return monthName ? months.indexOf(monthName.toLowerCase()) + 1 : null;
}

function convertToISODate(input) {
  // First, try to directly parse the input using the Date constructor.
  // This works well for ISO and some common formats.
  const parsedDate = new Date(input);
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString();
  }

  // Custom parsing for more specific formats
  const regex = /^(\d{1,2})?\s*([a-zA-Z]+)?\s*(\d{1,2})[,\s]?\s*(\d{4})(?:\s*([0-9:]+\s*[aApP][mM])?)?\s*$/i;
  const match = regex.exec(input);

  if (match) {
    const day = parseInt(match[3], 10);
    const month = getMonthNumber(match[2]);
    const year = parseInt(match[4], 10);
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    // Extract time components if present
    if (match[5]) {
      const [time, meridiem] = match[5].split(/\s+/);
      const [hrs, mins, secs] = time.split(':').map((num) => parseInt(num, 10));

      hours = hrs % 12;
      if (meridiem.toLowerCase() === 'pm') hours += 12;
      minutes = mins || 0;
      seconds = secs || 0;
    }

    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    return date.toISOString();
  }

  // For formats not covered, attempt to use Date.parse and check for validity
  const fallbackParsedDate = Date.parse(input);
  if (!Number.isNaN(fallbackParsedDate)) {
    return new Date(fallbackParsedDate).toISOString();
  }

  // Return original input if all parsing attempts fail
  return input;
}
function toggleDebugPanel() {
  const debugPanel = document.getElementById('debug-panel');
  debugPanel.style.display = debugPanel.style.display === 'block' ? 'none' : 'block';
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
    let href = '';
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      href = canonicalLink.href;
    }
    const pname = new URL(window.location.href).pathname;

    const text = document.body.innerText; // Get the visible text content of the body
    const wordCount = text.split(/\s+/).filter(Boolean).length; // Split by whitespace and count
    const thismonth = new Date().getMonth();
    const winloc = window.location.href;

    siteConfig['$co:defaultreviewperiod'] = 365;
    siteConfig['$co:defaultexpiryperiod'] = 365 * 2;
    siteConfig['$co:defaultstartdatetime'] = now;
    siteConfig['$co:defaultrestrictions'] = 'none';
    siteConfig['$co:defaulttags$'] = 'none';

    siteConfig['$system:environment$'] = window.cmsplus.environment;

    siteConfig['$page:location$'] = winloc;
    siteConfig['$page:url$'] = href;
    siteConfig['$page:name$'] = pname;
    siteConfig['$page:path$'] = (`${winloc}?`).split('?')[0];
    siteConfig['$page:wordcount$'] = wordCount;
    siteConfig['$page:linkcount$'] = document.querySelectorAll('a').length;
    siteConfig['$page:readspeed$'] = (Math.ceil(wordCount / 140) + 1).toString();
    siteConfig['$page:title$'] = document.title;
    siteConfig['$page:canonical$'] = href;

    siteConfig['$system:platformVersion$'] = 'AI Optiflow 1.0.0';
    siteConfig['$system:date$'] = now;
    siteConfig['$system:isodate$'] = now;
    siteConfig['$system:time$'] = new Date().toLocaleTimeString();
    siteConfig['$system:timezone$'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    siteConfig['$system:locale$'] = Intl.DateTimeFormat().resolvedOptions().locale;
    siteConfig['$system:year$'] = new Date().getFullYear();
    siteConfig['$system:month$'] = thismonth + 1;
    siteConfig['$system:day$'] = new Date().getDate();
    siteConfig['$system:hour$'] = new Date().getHours();
    siteConfig['$system:minute$'] = new Date().getMinutes();
    siteConfig['$system:second$'] = new Date().getSeconds();
    siteConfig['$system:millisecond$'] = new Date().getMilliseconds();

    const month = months[thismonth];
    const firstLetter = month.charAt(0).toUpperCase();
    const restOfWord = month.slice(1);
    const capitalizedMonth = firstLetter + restOfWord;
    siteConfig['$system:monthinfull$'] = capitalizedMonth;
    siteConfig['$system:monthinshort$'] = capitalizedMonth.slice(0, 3);

    siteConfig['$system:dateinenglish$'] = `${capitalizedMonth} ${siteConfig['$system:day$']}, ${siteConfig['$system:year$']}`;

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
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach((metaTag) => {
      let key = metaTag.getAttribute('name') || metaTag.getAttribute('property');
      let value = metaTag.getAttribute('content');
      key = key.replaceAll(' ', '');
      if (key.includes('date')) {
        value = convertToISODate(value);
      }

      if (key.startsWith('dc-')) {
        dc[key.replace('dc-', 'dc:').replaceAll(' ', '')] = value;
      }
      if (key.startsWith('co-')) {
        co[key.replace('co-', 'co:').replaceAll(' ', '')] = value;
      }
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
    throw error;
  }

  // decode the language
  const defaultLang = 'en';
  const metaProperties = [
    '$meta:lang$',
    '$meta:language$',
    '$meta:dc-language$',
  ];

  const lang = metaProperties.reduce((acc, prop) => acc || siteConfig[prop], '') || window.navigator.language || defaultLang;

  siteConfig['$system:language$'] = lang;
  document.querySelector('html').setAttribute('lang', lang);
  if (lang === 'ar') {
    document.querySelector('html').setAttribute('dir', 'rtl');
  }

  co['co:language'] = lang;
  co['co:author'] = siteConfig['$meta:author$'];

  // make the required globals
  let buildscript = '\nwindow.cmsplus = window.cmsplus || {};\n';
  const delay = siteConfig['$meta:analyticsdelay1$'] === undefined ? 3000 : siteConfig['$meta:analyticsdelay1$'];
  const bubbleapikey = siteConfig['$system:bubbleapikey$'] === undefined ? '' : siteConfig['$system:bubbleapikey$'];
  buildscript += `window.cmsplus.analyticsdelay = ${delay};\nwindow.cmsplus.bubble = "${bubbleapikey}";\n`;
  buildscript += `window.cmsplus.environment = "${window.cmsplus.environment}";\n`;
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.textContent = buildscript;
  document.head.appendChild(script);

  const dcString = JSON.stringify(dc, null, '\t');
  if (dcString.length > 0) {
    script = document.createElement('script');
    script.type = 'application/dc+json';
    script.setAttribute('data-role', 'dublin core');
    script.textContent = replaceTokens(siteConfig, dcString);
    document.head.appendChild(script);
  }

  const currentDate = new Date();
  let futureDate = new Date();
  let futurePeriod = '';
  if (!co['co:reviewdatetime']) {
    futurePeriod = siteConfig['$co:defaultreviewperiod'];
    futureDate = new Date(currentDate.getTime() + futurePeriod * 24 * 60 * 60 * 1000);
    co['co:reviewdatetime'] = futureDate.toISOString();
  }
  if (!co['co:startdatetime']) {
    co['co:startdatetime'] = currentDate.toISOString();
  }
  if (!co['co:publisheddatetime']) {
    co['co:publisheddatetime'] = currentDate.toISOString();
  }
  if (!co['co:expirydatetime']) {
    futurePeriod = siteConfig['$co:defaultexpiryperiod'];
    futureDate = new Date(currentDate.getTime() + futurePeriod * 24 * 60 * 60 * 1000);
    co['co:expirydatetime'] = futureDate.toISOString();
  }
  if (!co['co:restrictions']) {
    co['co:restrictions'] = siteConfig['$co:defaultrestrictions'];
  }
  if (!co['co:tags']) {
    co['co:tags'] = siteConfig['$co:defaulttags'];
  }
  const coString = JSON.stringify(co, null, '\t');
  if (coString.length > 0) {
    script = document.createElement('script');
    script.type = 'application/co+json';
    script.setAttribute('data-role', 'content ops');
    script.textContent = replaceTokens(siteConfig, coString);
    document.head.appendChild(script);
  }
  // **** all variables must be declared by now ******
  const jsonldString = await handleMetadataJsonLd();
  if (!window.location.search.includes('skipdebug')) {
    if (environment === 'preview') {
      const debugPanel = document.createElement('div');
      debugPanel.id = 'debug-panel';

      // Set initial styles for the debug panel
      debugPanel.style.display = 'none';
      debugPanel.style.position = 'fixed';
      debugPanel.style.top = '0';
      debugPanel.style.left = '0';
      debugPanel.style.width = '50%';
      debugPanel.style.height = '100vh';
      debugPanel.style.overflowY = 'auto';
      debugPanel.style.zIndex = '9998';
      debugPanel.style.backgroundColor = 'white';
      debugPanel.style.margin = '2em 10px';
      debugPanel.style.border = '1px solid black';

      // Build the content of the debug panel
      let content = '<h3>Variables, Shift-Ctrl-d to close</h3>';

      if (jsonldString.length > 0) {
        content += `<p><strong>JSON-LD:</strong> <pre>${jsonldString}</pre></p>`;
      }
      if (dcString.length > 0) {
        content += `<p><strong>Dublin Core:</strong> <pre>${dcString}</pre></p>`;
      }
      if (coString.length > 0) {
        content += `<p><strong>Content Ops:</strong> <pre>${coString}</pre></p>`;
      }
      content += '<h3>site configuration</h3>';
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const key in siteConfig) {
        content += `<strong>${key}:</strong> ${siteConfig[key]}<br>`;
      }

      // Set the content
      debugPanel.innerHTML = content;

      // Append to body
      document.body.appendChild(debugPanel);

      // Event listener for keyboard shortcut
      document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === 'D') { // Ctrl + Shift + D
          toggleDebugPanel();
        }
      });
    }
  }
  window.siteConfig = siteConfig;
  return siteConfig;
}
export function removeCommentBlocks() {
  document.querySelectorAll('div.section-metadata.comment').forEach((section) => section.remove());
}

// `initialize` function to kick things off
export async function initialize() {
  await loadConfiguration();
  initClientConfig();
  removeCommentBlocks();
  if (window.metadataTracker) {
    window.metadataTracker();
  }

  if (window.cmsplus.environment !== 'final') {
    if (siteConfig['$system:addbyline$'] === 'true') {
      const firstH1 = document.querySelector('h1');
      if (siteConfig['$system:addbyline$'] === 'true') {
        if (!siteConfig['$meta:suppressbyline$']) {
          if (firstH1) {
            const appendString = `Published: ${siteConfig['$system:dateinenglish$']}; By ${siteConfig['$meta:author$']},  ${siteConfig['$page:readspeed$']} </strong>minute(s) reading.`;
            // Append the constructed string to the h1 element's current content
            const newElement = document.createElement('div');
            newElement.className = 'byLine';
            newElement.innerHTML = appendString;
            firstH1.insertAdjacentElement('afterend', newElement);
          }
        }
      }
    }
    const metadataNames = [
      'description',
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image',
      'referrer',
      'viewport',
      'title',
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
}
