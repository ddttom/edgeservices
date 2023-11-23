export default function decorate(block) {
  const cols2 = [...block.firstElementChild.children];
  block.classList.add(`columns2-${cols2.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns2-img-col');
        }
      }
    });
  });
}
