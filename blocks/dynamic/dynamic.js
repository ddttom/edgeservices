/* eslint-disable function-paren-newline */
/* eslint-disable import/extensions */
/* eslint-disable no-alert */

import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  button, div, li, p, strong, ul,
} from '../../scripts/dom-helpers.js';
import ffetch from '../../scripts/ffetch.js';

export default async function decorate(block) {
  // You can find ffetch and other cool stuff in the Franklin block party: https://www.hlx.live/developer/block-collection#block-party
  // Or directly at: https://github.com/Buuhuu/ffetch
  const content = await ffetch('/query-index.json').all();
  const filteredContent = content.filter((card) => card.path.includes('/blog/'));

  block.append(
    ul(
      ...filteredContent.map((card) => (
        li(
          div({ class: 'cards-card-image' },
            createOptimizedPicture(card.image, card.title, false, [{ width: '750' }]),
          ),
          div({ class: 'cards-card-body' },
            p(
              strong(card.title),
            ),
            p(card.description),
            button({ class: 'primary', onclick: () => { alert('Very inquisitive! :)'); } }, 'More'),
          ),
        )
      )),
    ),
  );
}
