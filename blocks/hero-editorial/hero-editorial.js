/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable function-paren-newline */
/* eslint-disable import/extensions */
/* eslint-disable no-alert */

export default async function decorate(block) {
// Select the element by its class
  const element = document.querySelector('.hero-editorial-container');
  if (element) {
    // Perform operations on the element
    element.classList.add('hero');
  }
  if (block) {
    console.log(block);
  }
}
