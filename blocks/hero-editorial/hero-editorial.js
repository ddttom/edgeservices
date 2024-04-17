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
  const thirdDivPicture = document.querySelector('.hero-editorial > div:nth-of-type(3) picture');

  if (firstPicture && thirdDivPicture) {
  // Select the second source element from the picture element in the third div
    const thirdDivSecondSource = thirdDivPicture.querySelector('source:nth-of-type(2)');

    if (thirdDivSecondSource) {
      const newSource = thirdDivSecondSource.cloneNode(true);
      const firstPictureSecondSource = firstPicture.querySelector('source:nth-of-type(2)');

      if (firstPictureSecondSource) {
        firstPicture.replaceChild(newSource, firstPictureSecondSource);
      } else {
        firstPicture.appendChild(newSource);
      }

      thirdDivPicture.remove();
    } else {
      console.log('Second source element not found in the picture element of the third div.');
    }
  } else {
    console.log('First picture element or picture element in the third div not found.');
  }
}
