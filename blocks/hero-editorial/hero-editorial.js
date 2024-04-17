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
  const firstPicture = document.querySelector('.hero-editorial > div:first-of-type picture');
  const secondPicture = document.querySelector('.hero-editorial > div:first-of-type > div:nth-of-type(2) picture');

  if (firstPicture && secondPicture) {
    // Select the second source element from the second picture element
    const secondSource = secondPicture.querySelector('source:nth-of-type(2)');

    if (secondSource) {
      const newSource = secondSource.cloneNode(true);
      const firstPictureSecondSource = firstPicture.querySelector('source:nth-of-type(2)');

      if (firstPictureSecondSource) {
        firstPicture.replaceChild(newSource, firstPictureSecondSource);
      } else {
        firstPicture.appendChild(newSource);
      }

      secondPicture.remove();
    } else {
      console.log('Second source element not found in the second picture element.');
    }
  } else {
    console.log('First picture element or second picture element not found.');
  }
}
