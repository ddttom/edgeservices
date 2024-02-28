// Place any Client- Centered Code/  Configuration in here

// eslint-disable-next-line import/prefer-default-export
export async function initialize() {
  window.cmsplus.bubbleallowed = window.cmsplus.environment === 'production';

  const path = window.location.pathname;
  if (path.includes('webasto')) document.body.classList.add('webasto');
  if (path.includes('techem')) document.body.classList.add('techem');
}
