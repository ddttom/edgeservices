/* eslint-disable function-paren-newline */
/* eslint-disable import/extensions */
/* eslint-disable no-alert */

import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  a, div, li, p, strong, ul,
} from '../../scripts/dom-helpers.js';
import ffetch from '../../scripts/ffetch.js';

export default async function decorate(block) {
  const content = await ffetch('/query-index.json').all();

  let targetNames = ['blog']; // Initialize targetNames with 'blog' as the default

  // Extract path segments excluding the domain
  const pathSegments = window.location.pathname.split('/').filter((segment) => segment.length > 0);

  // Use the pathname as target if there's more than one segment
  if (pathSegments.length > 1) {
    targetNames = [window.location.pathname];
  }

  // Use additional class names as targets, excluding specific class names
  if (block.className.split(' ').length > 1) {
    targetNames = block.className.split(' ')
      .filter((cn) => cn && cn !== 'block' && cn !== 'dynamic');
  }

  // Filter content to exclude paths containing '/template'
  const filteredContent = content.filter((card) => !card.path.includes('/template')
      && targetNames.some((target) => card.path.includes(`/${target}/`)),
  );

  // Sort the filtered content by 'lastModified' in descending order
  const sortedContent = filteredContent.sort((adate, b) => {
    const dateA = new Date(adate.lastModified);
    const dateB = new Date(b.lastModified);
    return dateB - dateA;
  });

  // Append sorted and filtered content to the block
  block.append(
    ul(
      ...sortedContent.map((card) => li(
        div({ class: 'cards-card-image' },
          createOptimizedPicture(card.image, card.title, false, [{ width: '750' }]),
        ),
        div({ class: 'cards-card-body' },
          p(strong(card.title)),
          p(card.description),
          a({
            class: 'primary', href: card.path, role: 'button', tabindex: '0',
          }, 'Read More'),
        ),
      )),
    ),
  );
}
