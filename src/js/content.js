import Chat from './chat';

window.addEventListener('load', () => {
  if (window.location.pathname.startsWith('/direct/inbox')) return;

  new Chat();
});
