/* Hero core block */
export default function decorate(block) {
  [...block.children].forEach((heroItem) => {
    heroItem.classList.add('hero-item');

    // Replace 'p' with 'h1'
    const secondParagraph = heroItem.querySelector('p:nth-child(2)');
    if (secondParagraph) {
      const newHeading = document.createElement('h1');
      newHeading.innerHTML = secondParagraph.innerHTML;
      secondParagraph.parentNode.replaceChild(newHeading, secondParagraph);
      newHeading.classList.add('hero-title');
    }
    // Replace 'p' with 'div' and add a new class to the container
    const pictureContainer = heroItem.querySelector('picture');
    if (pictureContainer) {
      const imageParent = pictureContainer.parentNode; // picture parent

      const newDiv = document.createElement('div');
      newDiv.innerHTML = imageParent.innerHTML;
      newDiv.classList.add('hero-image');
      imageParent.replaceWith(newDiv);
    }

    // Add class to UL and LI elements
    const ulServices = heroItem.querySelector('ul');
    if (ulServices) {
      ulServices.classList.add('service-list');

      // Add class to each LI element
      const liServices = ulServices.querySelectorAll('li');
      liServices.forEach((li) => {
        li.classList.add('service-item');
      });

      // Custom code
      liServices.forEach((li, index) => {
        li.classList.add(`service-item-${index + 1}`);
      });
    }
    // hero page code
    const pageHero = document.querySelector('.hero-page');
    if (pageHero) {
      const heroItem = document.querySelector('.hero-item');

      // Replace 'p' with 'h1'
      const paragraphs = heroItem.getElementsByTagName('p');

      if (paragraphs.length === 2) {
        const secondParagraph = heroItem.querySelector('p:nth-child(3)');
        const newHeading = document.createElement('h1');
        newHeading.innerHTML = secondParagraph.innerHTML;
        secondParagraph.parentNode.replaceChild(newHeading, secondParagraph);
        newHeading.classList.add('hero-title');
      } else {
        const title = heroItem.querySelector('p');

        if (title) {
          const newTitle = document.createElement('h1');
          newTitle.innerHTML = title.innerHTML;
          title.parentNode.replaceChild(newTitle, title);
          newTitle.classList.add('hero-title');
        }
      }

      // Replace 'h1' with 'span'
      const heroP = heroItem.querySelector('h1');
      const heroTag = document.createElement('span');
      heroTag.innerHTML = heroP.innerHTML;
      heroP.parentNode.replaceChild(heroTag, heroP);
      heroTag.classList.add('hero-tag');

      const heroContainer = document.querySelector('.hero-item');
      const heroInfoDiv = document.createElement('div');
      heroInfoDiv.classList.add('hero-info');
      const heroTitle = document.querySelector('.hero-title');
      const heroIntro = document.querySelector('.hero-title + p');
      heroInfoDiv.appendChild(heroTag);
      heroInfoDiv.appendChild(heroTitle);
      if (heroIntro) {
        heroInfoDiv.appendChild(heroIntro);
      }
      heroContainer.appendChild(heroInfoDiv);

      // Get the elements to be rearranged
      const heroImage = heroItem.querySelector('.hero-image');
      const serviceList = heroItem.querySelector('.service-list');

      while (heroImage.parentNode !== heroItem) {
        heroImage.parentNode.removeChild(heroImage.parentNode.firstChild);
        heroItem.insertBefore(heroImage, heroItem.firstChild);
      }

      if (serviceList) {
        while (serviceList.parentNode !== heroItem) {
          serviceList.parentNode.removeChild(serviceList.parentNode.firstChild);
          heroItem.appendChild(serviceList);
        }
      }

      const divList = pageHero.querySelectorAll('div');
      const divArray = Array.from(divList);
      divArray.forEach((div) => {
        if (div.innerHTML.trim() === '') {
          div.remove();
        }
      });
    }
  });

  // home hero text give animation class //Hannah
  const animation = document.querySelector('.animation');
  const pageHome = document.querySelector('.hero-home');
  if (pageHome && animation) {
    const secondParagraph = pageHome.querySelector('p:nth-child(3)');
    if (secondParagraph) {
      secondParagraph.classList.add('hero-subtitle');
      secondParagraph.innerHTML = secondParagraph.innerHTML.replace(/\b(data|design|technology)\b/g, '<span class="highlight">$1</span>');
    }
    const heroTitleElement = pageHome.querySelector('.hero-title');
    // get the first word
    const textContent = heroTitleElement.textContent.trim();
    const firstWord = textContent.split(' ')[0];
    const firstWordSpan = document.createElement('span');
    firstWordSpan.textContent = firstWord;
    firstWordSpan.innerHTML = '';
    firstWordSpan.classList.add('hero-animate');
    heroTitleElement.innerHTML = textContent.replace(firstWord, firstWordSpan.outerHTML);
  }

  // typing animation effect
  const words = ['Transforming', 'Converting', 'Orchestrating'];
  const text = document.querySelector('.hero-animate');

  // Generator (iterate from 0-2)
  function * generator() {
    let index = 0;
    while (true) {
      yield index++;

      if (index >= words.length) {
        index = 0;
      }
    }
  }

  // Printing effect
  function printChar(word) {
    let i = 0;
    text.innerHTML = '';
    const id = setInterval(() => {
      if (i >= word.length) {
        clearInterval(id);
        setTimeout(() => deleteChar(), 700);
      } else {
        text.innerHTML += word[i];
        i++;
      }
    }, 200);
  }

  // Deleting effect
  function deleteChar() {
    const word = text.innerHTML;
    let i = word.length - 1;
    const id = setInterval(() => {
      if (i >= 0) {
        text.innerHTML = text.innerHTML.substring(0, text.innerHTML.length - 1);
        i--;
      } else {
        printChar(words[gen.next().value]);
        clearInterval(id);
      }
    }, 115);
  }

  // Select the h1 element with the class 'hero-title'
  const heroTitle = document.querySelector('.hero-title');

  // Create a new span element with the class 'span-title'
  const titleSpan = document.createElement('span');
  titleSpan.classList.add('span-title');

  if (block === pageHome && block === animation) {
    // Check if the h1 element contains text nodes
    if (heroTitle.childNodes.length > 0) {
      // Iterate over the child nodes of the h1 element
      heroTitle.childNodes.forEach(node => {
        // Check if the node is a text node and not empty or whitespace
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
          // Wrap the text content of the node in the new span element
          node.replaceWith(titleSpan);
          titleSpan.textContent = node.textContent;
          const textContentArray = titleSpan.innerText.split(' ');
          if (window.innerWidth <= 900) {
            titleSpan.innerHTML = `<br>${textContentArray[0]} ${textContentArray.slice(1).join(' ')}`;
          } else {
            titleSpan.innerHTML = ` ${textContentArray[1]} <br>${textContentArray.slice(2).join(' ')}`;
          }
        }
      });
    }
  }

  // Initializing generator
  const gen = generator();

  // Start the animation
  if (block === pageHome && block === animation) {
    printChar(words[gen.next().value]);
  }
}
