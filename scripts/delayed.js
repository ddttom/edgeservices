// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
window.danteEmbed = 'https://chat.dante-ai.com/embed?kb_id=4de3e5f2-7296-4e36-b722-c709f27e4664&token=58905c65-7389-489a-8d4e-4c0792aa5a23&modeltype=gpt-3.5-turbo&mode=false&bubble=true&image=null&bubbleopen=false';

loadScript('https://chat.dante-ai.com/bubble-embed.js');
loadScript('https://chat.dante-ai.com/dante-embed.js');
