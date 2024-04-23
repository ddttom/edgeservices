/* eslint-disable no-console */
function toggleDebugPanel() {
  const debugPanel = document.getElementById('debug-panel');
  debugPanel.style.display = debugPanel.style.display === 'block' ? 'none' : 'block';
}
let jsonLdString;
let dcString;
let coString;

window.cmsplus.errors = [];
window.cmsplus.consoleMessages = [];

export function createDebugPanel() {
  if (!window.location.search.includes('skipdebug')) {
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

    clientDebug = `${clientDebug}<br>${window.cmsplus?.callbackDebug?.()}`;
    let content = `${clientDebug}<br>`;
    content = `${content}<h3>Variables</h3>`;

    if (jsonLdString.length > 2) {
      content += `<p><strong>JSON-LD:</strong> <pre>${jsonLdString}</pre></p>`;
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
      if (key.indexOf(':.') !== 0) {
        content += `<strong>${key}:</strong> ${window.siteConfig[key]}<br>`;
      }
    }
    content = `<h2>Debug Panel, Shift-Ctrl-d to close</h2>${content}`;

    let cmess = '';
    if (window.cmsplus.consoleMessages.length > 0) {
      cmess = 'Console Messages<br>';
      window.cmsplus.consoleMessages.forEach((entry) => {
        cmess = `${cmess} Level: ${entry.level} Message: ${entry.message}<br>`;
      });
    }
    let errlist = '';
    if (window.cmsplus.errors.length > 0) {
      errlist = 'Errors encountered during processing<br>';
      window.cmsplus.errors.forEach((error) => {
        errlist = `Error: ${error.message} Source: ${error.source} Line: ${error.line}`;
      });
    }
    content = `${content + errlist}<br>`;
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
export function initialize(jsonLdStringInit, dcStringInit, coStringInit) {
  jsonLdString = jsonLdStringInit;
  dcString = dcStringInit;
  coString = coStringInit;
}
window.cmsplus.callbackCreateDebug = createDebugPanel;

window.onerror = (message, source, lineno, colno, error) => {
  const errorDetails = {
    message,
    source,
    line: lineno,
    column: colno,
    error,
  };
  window.cmsplus.errors.push(errorDetails);

  // Return true to prevent the default error handling
  return true;
};

// Override console methods
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.log = (...args) => {
  window.cmsplus.consoleMessages.push({ level: 'log', message: args });
  originalConsoleLog.apply(console, args);
};

console.warn = (...args) => {
  window.cmsplus.consoleMessages.push({ level: 'warn', message: args });
  originalConsoleWarn.apply(console, args);
};

console.error = (...args) => {
  window.cmsplus.consoleMessages.push({ level: 'error', message: args });
  originalConsoleError.apply(console, args);
};

initialize('', '', '');
