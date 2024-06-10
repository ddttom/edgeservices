const returnToTopButton = document.querySelector('.returntotop');

// Show the button when scrolled down 100px
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    returnToTopButton.style.display = 'block';
  } else {
    returnToTopButton.style.display = 'none';
  }
});

// Scroll to top when the button is clicked
returnToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
