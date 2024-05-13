const targetUrl = 'https://reply57035.activehosted.com/f/11';

const replacePhrases = (body) => {
  let modifiedBody = body;
  // Add your phrase replacements here
  // Example: modifiedBody = modifiedBody.replace(/oldPhrase/g, 'newPhrase');
  modifiedBody = modifiedBody.replace(/exampleOldPhrase/g, 'exampleNewPhrase');
  return modifiedBody;
};

const fetchAndDisplayContent = async () => {
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: new Headers(),
    });

    const text = await response.text();
    const modifiedText = replacePhrases(text);

    // Ensure the response element exists
    let responseElement = document.getElementById('response');
    if (!responseElement) {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        responseElement = document.createElement('div');
        responseElement.id = 'response';
        mainElement.appendChild(responseElement);
      } else {
        throw new Error('Main element not found');
      }
    }

    responseElement.textContent = modifiedText;
  } catch (error) {
    // Ensure the response element exists for error messages
    let responseElement = document.getElementById('response');
    if (!responseElement) {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        responseElement = document.createElement('div');
        responseElement.id = 'response';
        mainElement.appendChild(responseElement);
      } else {
        console.error('Main element not found and error occurred:', error.message);
        return;
      }
    }

    responseElement.textContent = `Error: ${error.message}`;
  }
};

// Run the function immediately
fetchAndDisplayContent();
