/* Footer core block */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  // load footer fragment
  const footerPath = footerMeta.footer || '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const classes = ['nav', 'logos', 'bottom'];
  classes.forEach((c, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(`footer-${c}`);
  });

  const footerLogo = footer.querySelector('.footer-logos');
  const brandLink = footerLogo.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const footerLogos = footer.querySelector('.footer-logos');
  const footerLogosWrapper = footerLogos.querySelector('div');
  if (footer) footerLogosWrapper.classList.add('footer-logos-wrapper');

  if (footerLogosWrapper) {
    const paragraphs = footerLogosWrapper.getElementsByTagName('p');
    for (let i = 0; i < paragraphs.length; i++) {
      const divElement = document.createElement('div');
      paragraphs[i].parentNode.insertBefore(divElement, paragraphs[i]);
      divElement.appendChild(paragraphs[i]);
    }
    footerLogosWrapper.firstElementChild.classList.add('footer-logo');
    footerLogosWrapper.lastElementChild.classList.add('footer-social');
  }

  const footerBottom = footer.querySelector('.footer-bottom');
  const footerBottomWrapper = footerBottom.querySelector('div');
  if (footer) footerBottomWrapper.classList.add('footer-bottom-wrapper');

  const footerNav = footer.querySelector('.footer-nav');
  const footerNavWrapper = footerNav.querySelector('div');
  if (footerNav) footerNavWrapper.classList.add('footer-nav-wrapper');
  const footerNavList = footerNav.querySelector('ul');
  if (footer) footerNavList.classList.add('footer-nav-list');
  const footerSubNav = footerNavList.querySelectorAll('ul');

  footerSubNav.forEach(function(ul) {
    ul.classList.add('footer-sub-nav-list');
  });

  block.append(footer);

  /* Create a list in two columns - uncomment when we have all content pages! */

  // const ulElements = document.querySelectorAll('.footer-sub-nav-list');
  // const ulElement = ulElements[1];
  // const firstUl = document.createElement('ul');
  // const lastUl = document.createElement('ul');
  // const nestedLi = document.createElement('li');

  // const liElements = Array.from(ulElement.querySelectorAll('li'));

  // for (let i = 0; i < 5; i++) {
  //   firstUl.appendChild(liElements[i]);
  // }

  // for (let i = liElements.length - 5; i < liElements.length; i++) {
  //   lastUl.appendChild(liElements[i]);
  // }

  // nestedLi.appendChild(firstUl);
  // nestedLi.appendChild(lastUl);
  // ulElement.appendChild(nestedLi);

  // for (let i = 0; i < 5; i++) {
  //   ulElement.removeChild(liElements[i]);
  // }
  // for (let i = liElements.length - 5; i < liElements.length; i++) {
  //   ulElement.removeChild(liElements[i]);
  // }

  // const directLiChildren = Array.from(ulElement.children).filter(child => child.tagName === 'LI');
  // directLiChildren.forEach(child => child.parentNode.removeChild(child));
}
