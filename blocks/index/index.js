// eslint-disable-next-line no-unused-vars
export default function decorate(block) {
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const indexContainer = document.querySelector('.index');
  if (!indexContainer) return;

  const ul = document.createElement('ul');
  headers.forEach((header, index) => {
    const id = `header-${index}`;
    header.id = id;

    const li = document.createElement('li');
    li.style.marginLeft = `${(parseInt(header.tagName[1], 10) - 1) * 20}px`;

    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = header.textContent;

    li.appendChild(a);
    ul.appendChild(li);
  });

  indexContainer.appendChild(ul);
}
