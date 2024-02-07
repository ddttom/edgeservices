export const siteConfig = {};

export function toCamelCase(str) {
  return str.replace(/:([a-z])/g, (_, char) => char.toUpperCase());
}

export async function loadConfiguration() {
  const configUrl = `${window.location.origin}/config/config.json`;
  try {
    const response = await fetch(configUrl);
    if (!response.ok) throw new Error(`Failed to fetch config: ${response.status}`);
    const { data } = await response.json();
    data.forEach(({ Item, Value }) => {
      const key = toCamelCase(Item);
      siteConfig[key] = Value;
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Configuration load error: ${error.message}`);
  }
}

export function extractJsonLd(parsedJson) {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Organization' };
  parsedJson.data.forEach((item) => {
    const key = toCamelCase(Object.keys(item)[1]);
    const value = item[key].replace(/^"|"$/g, '').trim();
    jsonLd[item['@context']] = value;
  });
  return jsonLd;
}

export function replacePlaceHolders(content) {
  let replacedContent = content;
  const placeholders = {
    '$twitter:image': 'meta[name="twitter:image"]',
    '$system:date': new Date().toISOString().split('T')[0],
    '$company:name': siteConfig.companyName,
    '$company:logo': siteConfig.companyLogo,
    '$company:url': siteConfig.companyUrl,
    '$company:email': siteConfig.companyEmail,
    '$company:phone': siteConfig.companyPhone,
  };
  Object.entries(placeholders).forEach(([placeholder, valueOrSelector]) => {
    const value = typeof valueOrSelector === 'string' ? document.querySelector(valueOrSelector)?.getAttribute('content') || '' : valueOrSelector;
    replacedContent = replacedContent.replace(placeholder, value);
  });
  return replacedContent;
}

export function applyPageSpecificClasses() {
  const path = window.location.pathname;
  if (path.includes('webasto')) document.body.classList.add('webasto');
  if (path.includes('techem')) document.body.classList.add('techem');
}

export async function handleMetadataJsonLd() {
  if (!document.querySelector('script[type="application/ld+json"]')) {
    // Additional logic here...
  }
}

export function removeCommentBlocks() {
  document.querySelectorAll('div.section-metadata.comment').forEach((section) => section.remove());
}

// `initialize` function to kick things off
export async function initialize() {
  await loadConfiguration();
  applyPageSpecificClasses();
  extractJsonLd();
}
