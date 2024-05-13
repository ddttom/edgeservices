/* eslint-disable function-paren-newline */
/* eslint-disable import/extensions */
/* eslint-disable no-alert */

export default async function decorate() {
// Select the element by its class
  const element = document.querySelector('.inject-container');

  // Get the value of the 'data-maxreturn' attribute, or system value, or use the default value of 8
  const injection = element.getAttribute('data-script');
  console.log(injection);
}
