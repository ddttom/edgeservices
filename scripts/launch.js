// This is the last chance, things in here are not allowed to change the display of the DOM.
// Quick and dirty for Comwrap -- make configurable
import { loadScript } from './aem.js';

// for comwrap
// Cookie Consent (Cookiebot)
// <script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="747c7864-bf4d-4b8f-9e92-69d5eb6be267" data-blockingmode="auto" type="text/javascript"></script>

// Adobe Launch
// <script src="https://assets.adobedtm.com/d4e187856f02/84a8f19b48f1/launch-445ea36a9b64-development.min.js" async></script>

// AB Tasty
// <script type="text/javascript" src="https://try.abtasty.com/54d41c1c745275ad6d723c2122a0693d.js"></script>

// eslint-disable-next-line import/prefer-default-export
export async function initialize() {
  const attrs = {
    id: 'Cookiebot',
    'data-cbid': '747c7864-bf4d-4b8f-9e92-69d5eb6be267',
    'data-blockingmode': 'auto',
  };
  await loadScript('https://consent.cookiebot.com/uc.js', attrs);
  await loadScript('https://assets.adobedtm.com/d4e187856f02/84a8f19b48f1/launch-445ea36a9b64-development.min.js', {});
  await loadScript('https://try.abtasty.com/54d41c1c745275ad6d723c2122a0693d.js', {});
  window.adobeDataLayer = window.adobeDataLayer || [];
  if (window.cmsplus.track.page) {
    window.adobeDataLayer.push(window.cmsplus.track.page);
  }
  if (window.cmsplus.track.view) {
    window.adobeDataLayer.push(window.cmsplus.track.view);
  }
  await loadScript('./clientscript.js');
}
