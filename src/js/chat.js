import userAgentOverride from './userAgent';
import { rootStyles, chatStyles } from './styles';

const loadChat = () => {
  // Ignore load event from the chat iframe
  if (window.location.pathname.startsWith('/direct/inbox')) return;

  const chatIframe = document.createElement('iframe');
  chatIframe.src = 'https://instagram.com/direct/inbox';
  chatIframe.id = 'inbox-iframe';
  chatIframe.addEventListener('load', () => {
    const chatIframeStyleTag = chatIframe.contentDocument.createElement(
      'style'
    );
    chatIframeStyleTag.appendChild(document.createTextNode(chatStyles));
    chatIframe.contentDocument.head.appendChild(chatIframeStyleTag);

    const removeRootLinks = () => {
      const rootLinks = chatIframe.contentDocument.querySelectorAll(
        '[href="/"]'
      );
      for (const rootLink of rootLinks) {
        rootLink.remove();
      }
    };

    removeRootLinks();
    chatIframe.contentWindow.addEventListener('popstate', removeRootLinks);
  });
  document.body.appendChild(chatIframe);

  const rootStyleTag = document.createElement('style');
  rootStyleTag.appendChild(document.createTextNode(rootStyles));
  document.head.appendChild(rootStyleTag);

  const userAgentScriptTag = chatIframe.contentDocument.createElement('script');
  userAgentScriptTag.appendChild(
    document.createTextNode(`(${userAgentOverride.toString()})()`)
  );
  chatIframe.contentDocument.body.appendChild(userAgentScriptTag);

  document.addEventListener('click', () => {
    chatIframe.style.display = window.location.pathname.startsWith('/stories/')
      ? 'none'
      : '';
  });
};

window.addEventListener('load', loadChat, { once: true });

let prevScrollY = window.scrollY;

window.addEventListener('load', function() {
  let instagramMainContent;
  let isSmallDesktopScreen;
  let leftSideGroupRect;

  function updateChatPosition() {
    // Ignore load event from the chat iframe
    if (window.location.pathname.startsWith('/direct/inbox')) return;

    if (isSmallDesktopScreen) {
      document.documentElement.style.setProperty(
        '--chat-left',
        `${leftSideGroupRect.left}px`
      );

      document.documentElement.style.setProperty(
        '--chat-top',
        `${leftSideGroupRect.top}px`
      );

      document.documentElement.style.setProperty(
        '--chat-top-transition-duration',
        '0s'
      );

      document.documentElement.style.setProperty(
        '--chat-top-transition-delay',
        '0s'
      );
    } else {
      document.documentElement.style.setProperty('--chat-left', `0px`);

      document.documentElement.style.setProperty(
        '--chat-top',
        `${Math.max(135 - window.scrollY, 52)}px`
      );

      const didScrollDown = window.scrollY > prevScrollY;

      document.documentElement.style.setProperty(
        '--chat-top-transition-duration',
        didScrollDown ? '.2s' : '0s'
      );

      document.documentElement.style.setProperty(
        '--chat-top-transition-delay',
        didScrollDown ? '.2s' : '0s'
      );
    }

    prevScrollY = window.scrollY;
  }

  const updateChatSize = () => {
    // Ignore load event from the chat iframe
    if (window.location.pathname.startsWith('/direct/inbox')) return;

    if (!instagramMainContent) {
      instagramMainContent = document.querySelector('main > * > *');
    }

    const leftSideGroup = document.querySelector(
      'main > section > :last-of-type > :last-of-type'
    );

    if (!leftSideGroup) return;

    leftSideGroup.style.opacity = isSmallDesktopScreen ? '0' : '1';

    leftSideGroupRect = leftSideGroup.getBoundingClientRect();

    const _chatWidth = instagramMainContent.getBoundingClientRect().left - 28;

    isSmallDesktopScreen = _chatWidth <= leftSideGroupRect.width;

    const chatWidth = isSmallDesktopScreen
      ? leftSideGroupRect.width
      : _chatWidth;

    document.documentElement.style.setProperty(
      '--chat-width',
      instagramMainContent ? `${chatWidth}px` : '20vw'
    );

    document.documentElement.style.setProperty(
      '--chat-height',
      'calc(100vh - var(--chat-top))'
    );
  };

  updateChatSize();
  window.addEventListener('resize', updateChatSize, { passive: true });
  window.addEventListener('resize', updateChatPosition, { passive: true });

  updateChatPosition();
  window.addEventListener('scroll', updateChatSize, { passive: true });
  window.addEventListener('scroll', updateChatPosition, { passive: true });
});
