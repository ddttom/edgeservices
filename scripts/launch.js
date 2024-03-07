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
}

// <!-- Hotjar Tracking Code for https://www.comwrap.uk -->
(function (h, o, t, j, a, r) {
  h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments); };
  h._hjSettings = { hjid: 3844302, hjsv: 6 };
  a = o.getElementsByTagName('head')[0];
  r = o.createElement('script'); r.async = 1;
  r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
  a.appendChild(r);
}(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv='));

// Segment for comwrap
// <script>   !function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel='canonical']");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="Sx6Ym2l6Qv0jfIbg2BDWfmcr8GAaahxP";;analytics.SNIPPET_VERSION="5.2.0";   analytics.load("Sx6Ym2l6Qv0jfIbg2BDWfmcr8GAaahxP");   analytics.page();   }}(); </script>

!(function () {
  const i = 'analytics';
  const analytics = window[i] = window[i] || [];
  if (!analytics.initialize) {
    if (analytics.invoked) window.console && console.error && console.error('Segment snippet included twice.');
    else {
      analytics.invoked = !0;
      analytics.methods = ['trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview', 'identify', 'reset', 'group', 'track', 'ready', 'alias', 'debug', 'page', 'screen', 'once', 'off', 'on', 'addSourceMiddleware', 'addIntegrationMiddleware', 'setAnonymousId', 'addDestinationMiddleware', 'register'];
      analytics.factory = function (e) {
        return function () {
          if (window[i].initialized) return window[i][e].apply(window[i], arguments);
          const n = Array.prototype.slice.call(arguments);
          if (['track', 'screen', 'alias', 'group', 'page', 'identify'].indexOf(e) > -1) {
            const c = document.querySelector("link[rel='canonical']");
            n.push({
              __t: 'bpc',
              c: c && c.getAttribute('href') || void 0,
              p: location.pathname,
              u: location.href,
              s: location.search,
              t: document.title,
              r: document.referrer,
            });
          }
          n.unshift(e);
          analytics.push(n);
          return analytics;
        };
      };
      for (let n = 0; n < analytics.methods.length; n++) {
        const key = analytics.methods[n];
        analytics[key] = analytics.factory(key);
      }
      analytics.load = function (key, n) {
        const t = document.createElement('script');
        t.type = 'text/javascript';
        t.async = !0;
        t.setAttribute('data-global-segment-analytics-key', i);
        t.src = `https://cdn.segment.com/analytics.js/v1/${key}/analytics.min.js`;
        const r = document.getElementsByTagName('script')[0];
        r.parentNode.insertBefore(t, r);
        analytics._loadOptions = n;
      };
      analytics._writeKey = 'Sx6Ym2l6Qv0jfIbg2BDWfmcr8GAaahxP';
      analytics.SNIPPET_VERSION = '5.2.0';
      analytics.load('Sx6Ym2l6Qv0jfIbg2BDWfmcr8GAaahxP');
      analytics.page();
    }
  }
}());
