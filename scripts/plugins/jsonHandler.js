import { replaceTokens, convertToISODate } from './variables.js';

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

export async function handleMetadataJsonLd() {
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
    // eslint-disable-next-line no-console
      console.error('Error processing JSON-LD metadata:', error);
    }
  }
  return jsonString;
}

export function createJSON() {
  const dc = {};
  const co = {};

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
  });
  window.siteConfig['$meta:author$'] ??= window.siteConfig['$company:name$'];
  window.siteConfig['$meta:contentauthor$'] ??= window.siteConfig['$meta:author$'];

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
  const helpapikey = window.siteConfig['$system:.helpapikey$'] === undefined ? '' : window.siteConfig['$system:.helpapikey$'];
  buildscript += `window.cmsplus.analyticsdelay = ${delay};\nwindow.cmsplus.helpapi = "${helpapikey}";\n`;
  buildscript += `window.cmsplus.environment = "${window.cmsplus.environment}";\n`;
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.textContent = buildscript;
  document.head.appendChild(script);

  if (window.siteConfig['$meta:wantdublincore$'] === undefined) {
    window.siteConfig['$meta:wantdublincore$'] = true;
  }
  const dcString = JSON.stringify(dc, null, '\t');
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
    let coString = JSON.stringify(co, null, '\t');
    coString = replaceTokens(window.siteConfig, coString);
    if (coString.length > 2) {
      script = document.createElement('script');
      script.type = 'application/co+json';
      script.setAttribute('data-role', 'content ops');
      script.textContent = replaceTokens(window.siteConfig, coString);
      document.head.appendChild(script);
    }
  }
}