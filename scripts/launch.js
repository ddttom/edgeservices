// This is the last chance, things in here are not allowed to change the display of the DOM.
// Quick and dirty for Comwrap -- make configurable
import { loadScript } from './aem.js';
/* eslint-disable no-plusplus */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-void */
/* eslint-disable prefer-spread */
/* eslint-disable no-console */
/* eslint-disable no-multi-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */

// for comwrap
// Cookie Consent (Cookiebot)
// <script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="747c7864-bf4d-4b8f-9e92-69d5eb6be267" data-blockingmode="auto" type="text/javascript"></script>

// Adobe Launch
// <script src="https://assets.adobedtm.com/d4e187856f02/84a8f19b48f1/launch-445ea36a9b64-development.min.js" async></script>

// AB Tasty
// <script type="text/javascript" src="https://try.abtasty.com/54d41c1c745275ad6d723c2122a0693d.js"></script>

// eslint-disable-next-line import/prefer-default-export
export async function initialize() {
  //  Comwrap Specific
  const attrs = {
    id: 'Cookiebot',
    'data-cbid': '747c7864-bf4d-4b8f-9e92-69d5eb6be267',
    'data-blockingmode': 'auto',
  };
  await loadScript('https://consent.cookiebot.com/uc.js', attrs);
  await loadScript('https://assets.adobedtm.com/d4e187856f02/84a8f19b48f1/launch-9fc11833104d.min.js', {}); //   extra %22
  await loadScript('https://try.abtasty.com/54d41c1c745275ad6d723c2122a0693d.js', {});
  window.adobeDataLayer = window.adobeDataLayer || [];
  try {
    if (window.cmsplus.track) {
      if (window.cmsplus.track.page) {
        window.adobeDataLayer.push(window.cmsplus.track.page);
      }
      if (window.cmsplus.track.content) {
        window.adobeDataLayer.push(window.cmsplus.track.content);
      }
    }
  } catch (e) {
    console.log('failed to add cmsplus data to adobeDataLayer', e);
  }

  // any client with dante ai chatbot will need to add this
  if (window.cmsplus.bubble.trim().length > 0) {
    window.danteEmbed = `https://chat.dante-ai.com/embed?${window.cmsplus.bubble}&mode=false&bubble=true&image=null&bubbleopen=false`;
    // eslint-disable-next-line no-undef
    loadScript('https://chat.dante-ai.com/bubble-embed.js');
    // eslint-disable-next-line no-undef
    loadScript('https://chat.dante-ai.com/dante-embed.js');
  }
}
