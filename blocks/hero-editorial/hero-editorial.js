export default async function decorate(block) {
// Select the element by its class
  const element = document.querySelector('.hero-editorial-container');
  if (element) {
    // Perform operations on the element
    element.classList.add('hero');
  }
  if (block) {
    // eslint-disable-next-line no-console
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
    }
  }
}
