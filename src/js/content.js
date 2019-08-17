import Chat from './chat';
import { rootStyles } from './styles';

function addRootStyles() {
  const rootStyleTag = document.createElement('style');
  rootStyleTag.appendChild(document.createTextNode(rootStyles));
  document.head.appendChild(rootStyleTag);
}

window.addEventListener('load', () => {
  if (window.location.pathname.startsWith('/direct/inbox')) return;

  new Chat();

  addRootStyles();
});
