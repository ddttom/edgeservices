import { sampleRUM } from './aem.js';
// import { initialize as initLaunch } from './launch.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
// any client with dante ai chatbot will need to enable this, in clientConfig
window.cmsplus.callbackDanteChat();
function initialize() {
}
initialize();
