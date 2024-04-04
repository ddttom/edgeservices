/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
import {
  initialize as initClientConfig,
} from './clientConfig.js';

const errors = [];

window.onerror = function(message, source, lineno, colno, error) {
  const errorDetails = {
    message,
    source,
    line: lineno,
    column: colno,
    error
  };
  errors.push(errorDetails);

  // Return true to prevent the default error handling
  return true;
};

const consoleMessages = [];

// Override console methods
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.log = function(...args) {
  consoleMessages.push({ level: 'log', message: args });
  originalConsoleLog.apply(console, args);
};

console.warn = function(...args) {
  consoleMessages.push({ level: 'warn', message: args });
  originalConsoleWarn.apply(console, args);
};

console.error = function(...args) {
  consoleMessages.push({ level: 'error', message: args });
  originalConsoleError.apply(console, args);
};
window.siteConfig = {};
export const dc = {};
export const co = {};

window.cmsplus = window.cmsplus || {};

let jsonldString = '';
let coString = '';
let dcString = '';
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
let locality = 'unknown'; // Start with the default
if (window.location.href.includes('localhost')) {
  locality = 'local';
} else if (window.location.href.includes('stage')) {
  locality = 'stage';
} else if (window.location.href.includes('prod')) {
  locality = 'prod';
} else if (window.location.href.includes('dev')) {
  locality = 'dev';
}

window.cmsplus.environment = environment;
window.cmsplus.locality = locality;
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
      jsonString = replaceTokens(window.siteConfig, jsonString);
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

export function createDebugPanel() {
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
      let clientDebug = window.siteConfig['$system:projectname$'] ? window.siteConfig['$system:projectname$'] : 'No name given';

      clientDebug = clientDebug + '<br>' + window.cmsplus.callbackdebug();
      let content = `${clientDebug}<br>`;
      content = `${content}<h3>Variables</h3>`;

      if (jsonldString.length > 2) {
        content += `<p><strong>JSON-LD:</strong> <pre>${jsonldString}</pre></p>`;
      }
      if (dcString.length > 2) {
        content += `<p><strong>Dublin Core:</strong> <pre>${dcString}</pre></p>`;
      }
      if (coString.length > 2) {
        content += `<p><strong>Content Ops:</strong> <pre>${coString}</pre></p>`;
      }
      // Define the Regular Expression pattern to match $word:word$ patterns
      const pattern = /\$[a-zA-Z0-9_]+:[a-zA-Z0-9_]+\$/g;
      const matches = content.match(pattern) || [];

      if (matches.length > 0) {
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const match of matches) {
          const token = match.replace('$', '').replace(':', '');
          content = `<strong>${token}:</strong> ${window.siteConfig[token]}<br>${content}`;
          content = `<h3>Unmatched Replaceable Tokens</h3>${content}`;
        }
      }
      content += '<h3>site configuration</h3>';
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const key in window.siteConfig) {
        content += `<strong>${key}:</strong> ${window.siteConfig[key]}<br>`;
      }
      content = '<h2>Debug Panel, Shift-Ctrl-d to close</h2>' + content;

      let cmess = '';
      if (consoleMessages.length > 0) {
        cmess = 'Console Messages<br>';
        consoleMessages.forEach(function(entry) {
          cmess = cmess + `Level: ${entry.level} Message: ${entry.message}<br>`;
        });
      }
      let errlist = '';
      if (errors.length > 0) {
        errlist = 'Errors encountered during processing<br>';
        errors.forEach(function(error) {
          errlist = `Error: ${error.message} Source: ${error.source} Line: ${error.line}`;
        });
      }
      content = content + errlist + '<br>';
      debugPanel.innerHTML = content;
      document.body.appendChild(debugPanel);
      // Event listener for keyboard shortcut
      document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === 'D') { // Ctrl + Shift + D
          toggleDebugPanel();
        }
      });
    }
  }
}
export async function readVariables(configUrl) {
  try {
    const response = await fetch(configUrl);
    if (!response.ok) {
      console.error(`Failed to fetch config: ${response.status} ${response.statusText}`);
    } else {
      const jsonData = await response.json();
      // eslint-disable-next-line no-restricted-syntax
      for (const entry of jsonData.data) {
        window.siteConfig[entry.Item] = entry.Value;
      }
    }
  } catch (error) {
    console.error(`unable to read config: ${error.message}`);
  }
}

export async function loadConfiguration() {
  await readVariables(new URL('/config/variables.json', window.location.origin));
  if (['final', 'preview', 'live'].includes(environment)) {
    await readVariables(new URL(`/config/variables-${environment}.json`, window.location.origin));
  }
  if (['local', 'dev', 'prod', 'stage'].includes(locality)) {
    await readVariables(new URL(`/config/variables-${locality}.json`, window.location.origin));
  }
  try {
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

    window.siteConfig['$co:defaultreviewperiod'] = 365;
    window.siteConfig['$co:defaultexpiryperiod'] = 365 * 2;
    window.siteConfig['$co:defaultstartdatetime'] = now;
    window.siteConfig['$co:defaultrestrictions'] = 'none';
    window.siteConfig['$co:defaulttags$'] = 'none';

    window.siteConfig['$system:environment$'] = window.cmsplus.environment;

    window.siteConfig['$page:location$'] = winloc;
    window.siteConfig['$page:url$'] = href;
    window.siteConfig['$page:name$'] = pname;
    window.siteConfig['$page:path$'] = (`${winloc}?`).split('?')[0];
    window.siteConfig['$page:wordcount$'] = wordCount;
    window.siteConfig['$page:linkcount$'] = document.querySelectorAll('a').length;
    window.siteConfig['$page:readspeed$'] = (Math.ceil(wordCount / 140) + 1).toString();
    window.siteConfig['$page:title$'] = document.title;
    window.siteConfig['$page:canonical$'] = href;
    window.siteConfig['$system:date$'] = now;
    window.siteConfig['$system:isodate$'] = now;
    window.siteConfig['$system:time$'] = new Date().toLocaleTimeString();
    window.siteConfig['$system:timezone$'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    window.siteConfig['$system:locale$'] = Intl.DateTimeFormat().resolvedOptions().locale;
    window.siteConfig['$system:year$'] = new Date().getFullYear();
    window.siteConfig['$system:month$'] = thismonth + 1;
    window.siteConfig['$system:day$'] = new Date().getDate();
    window.siteConfig['$system:hour$'] = new Date().getHours();
    window.siteConfig['$system:minute$'] = new Date().getMinutes();
    window.siteConfig['$system:second$'] = new Date().getSeconds();
    window.siteConfig['$system:millisecond$'] = new Date().getMilliseconds();

    const month = months[thismonth];
    const firstLetter = month.charAt(0).toUpperCase();
    const restOfWord = month.slice(1);
    const capitalizedMonth = firstLetter + restOfWord;
    window.siteConfig['$system:monthinfull$'] = capitalizedMonth;
    window.siteConfig['$system:monthinshort$'] = capitalizedMonth.slice(0, 3);

    window.siteConfig['$system:dateinenglish$'] = `${capitalizedMonth} ${window.siteConfig['$system:day$']}, ${window.siteConfig['$system:year$']}`;

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
        window.siteConfig[`$${prefix}${key}$`] = value;
      }
      if (window.siteConfig['$meta:author$'] == null) {
        window.siteConfig['$meta:author$'] = window.siteConfig['$company:name$'];
      }
      if (window.siteConfig['$meta:contentauthor$'] == null) {
        window.siteConfig['$meta:contentauthor$'] = window.siteConfig['$meta:author$'];
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Configuration construction error: ${error.message}`);
    throw error;
  }

  // decode the language
  const defaultLang = 'en';
  const metaProperties = [
    '$meta:lang$',
    '$meta:language$',
    '$meta:dc-language$',
  ];

  const lang = metaProperties.reduce((acc, prop) => acc || window.siteConfig[prop], '') || window.navigator.language || defaultLang;

  window.siteConfig['$system:language$'] = lang;
  document.querySelector('html').setAttribute('lang', lang);
  if (lang === 'ar') {
    document.querySelector('html').setAttribute('dir', 'rtl');
  }

  co['co:language'] = lang;
  co['co:author'] = window.siteConfig['$meta:author$'];

  // make the required globals
  let buildscript = '\nwindow.cmsplus = window.cmsplus || {};\n';
  const delay = window.siteConfig['$meta:analyticsdelay$'] === undefined ? 3000 : window.siteConfig['$meta:analyticsdelay$'];
  const helpapikey = window.siteConfig['$system:helpapikey$'] === undefined ? '' : window.siteConfig['$system:helpapikey$'];
  buildscript += `window.cmsplus.analyticsdelay = ${delay};\nwindow.cmsplus.bubble = "${helpapikey}";\n`;
  buildscript += `window.cmsplus.environment = "${window.cmsplus.environment}";\n`;
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.textContent = buildscript;
  document.head.appendChild(script);

  if (window.siteConfig['$meta:wantdublincore$'] === undefined) {
    window.siteConfig['$meta:wantdublincore$'] = true;
  }
  dcString = JSON.stringify(dc, null, '\t');
  if (window.siteConfig['$meta:wantdublincore$'] === true) {
    if (dcString.length > 2) {
      script = document.createElement('script');
      script.type = 'application/dc+json';
      script.setAttribute('data-role', 'dublin core');
      script.textContent = replaceTokens(window.siteConfig, dcString);
      document.head.appendChild(script);
    }
  }
  if (window.siteConfig['$meta:wantcontentops$'] === undefined) {
    window.siteConfig['$meta:wantcontentops$'] = true;
  }
  if (window.siteConfig['$meta:wantcontentops$'] === true) {
    const currentDate = new Date();
    let futureDate = new Date();
    let futurePeriod = '';
    if (!co['co:reviewdatetime']) {
      futurePeriod = window.siteConfig['$co:defaultreviewperiod'];
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
      futurePeriod = window.siteConfig['$co:defaultexpiryperiod'];
      futureDate = new Date(currentDate.getTime() + futurePeriod * 24 * 60 * 60 * 1000);
      co['co:expirydatetime'] = futureDate.toISOString();
    }
    if (!co['co:restrictions']) {
      co['co:restrictions'] = window.siteConfig['$co:defaultrestrictions'];
    }
    if (!co['co:tags']) {
      co['co:tags'] = window.siteConfig['$co:defaulttags'];
    }
    coString = JSON.stringify(co, null, '\t');
    coString = replaceTokens(window.siteConfig, coString);
    if (coString.length > 2) {
      script = document.createElement('script');
      script.type = 'application/co+json';
      script.setAttribute('data-role', 'content ops');
      script.textContent = replaceTokens(window.siteConfig, coString);
      document.head.appendChild(script);
    }
  }
  jsonldString = await handleMetadataJsonLd();
  return window.siteConfig;
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
    await window.metadataTracker();
  }
  createDebugPanel();
  if (window.cmsplus.environment !== 'final') {
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
}
