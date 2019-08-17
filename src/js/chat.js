import userAgentOverride from './userAgent';
import { rootStyles, chatStyles } from './styles';

window.prevScrollY = window.scrollY;

let instagramMainContent;
let isSmallDesktopScreen;
let leftSideGroupRect;

export default class Chat {
  constructor() {
    this._bindMethods();

    this._init();

    this._handleUpdates();
  }

  _bindMethods() {
    this._init = this._init.bind(this);
    this._update = this._update.bind(this);
    this._handleUpdates = this._handleUpdates.bind(this);
    this._hideOnModalDisplay = this._hideOnModalDisplay.bind(this);
    this._updatePosition = this._updatePosition.bind(this);
    this._updateSize = this._updateSize.bind(this);
    this._setupIframe = this._setupIframe.bind(this);
    this._overrideUserAgent = this._overrideUserAgent.bind(this);
    this._handleMutations = this._handleMutations.bind(this);
    this._setCssProp = this._setCssProp.bind(this);
    this._getCssProp = this._getCssProp.bind(this);
  }

  _setCssProp(prop, value) {
    document.documentElement.style.setProperty(`--chat-${prop}`, value);
  }

  _getCssProp(prop) {
    document.documentElement.style.getPropertyValue(`--chat-${prop}`);
  }

  _setupIframe() {
    this._iframe = document.createElement('iframe');
    this._iframe.src = 'https://instagram.com/direct/inbox';
    this._iframe.id = 'inbox-iframe';
    this._iframe.addEventListener('load', () => {
      const chatIframeStyleTag = this._iframe.contentDocument.createElement(
        'style'
      );
      chatIframeStyleTag.appendChild(document.createTextNode(chatStyles));
      this._iframe.contentDocument.head.appendChild(chatIframeStyleTag);

      const removeRootLinks = () => {
        const rootLinks = this._iframe.contentDocument.querySelectorAll(
          '[href="/"]'
        );
        for (const rootLink of rootLinks) {
          rootLink.remove();
        }
      };

      removeRootLinks();
      this._iframe.contentWindow.addEventListener('popstate', removeRootLinks, {
        passive: true,
      });
    });
    document.body.appendChild(this._iframe);
  }

  _overrideUserAgent() {
    const userAgentScriptTag = this._iframe.contentDocument.createElement(
      'script'
    );
    userAgentScriptTag.appendChild(
      document.createTextNode(`(${userAgentOverride.toString()})()`)
    );
    this._iframe.contentDocument.body.appendChild(userAgentScriptTag);
  }

  _hideOnModalDisplay() {
    this._iframe.style.display = window.location.pathname.match(
      /^\/(stories)|(p)\/./
    )
      ? 'none'
      : '';
  }

  _handleMutations() {
    new MutationObserver(() => {
      this._hideOnModalDisplay();

      this._update();
    }).observe(document.body, {
      childList: true,
      subtree: false,
      attributes: true,
    });
  }

  _init() {
    this._setupIframe();

    const rootStyleTag = document.createElement('style');
    rootStyleTag.appendChild(document.createTextNode(rootStyles));
    document.head.appendChild(rootStyleTag);

    this._overrideUserAgent();

    this._handleMutations();
  }

  _updatePosition() {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (isSmallDesktopScreen) {
          this._setCssProp('left', `${leftSideGroupRect.left}px`);

          this._setCssProp('top', `${leftSideGroupRect.top}px`);

          this._setCssProp('top-transition-duration', '0s');

          this._setCssProp('top-transition-delay', '0s');
        } else {
          document.documentElement.style.setProperty('--chat-left', `0px`);

          this._setCssProp('top', `${Math.max(135 - window.scrollY, 52)}px`);

          const didScrollDown = window.scrollY > window.prevScrollY;

          this._setCssProp(
            'top-transition-duration',
            didScrollDown ? '.2s' : '0s'
          );

          this._setCssProp(
            'top-transition-delay',
            didScrollDown ? '.2s' : '0s'
          );
        }

        window.prevScrollY = window.scrollY;
      })
    );
  }

  _updateSize() {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        instagramMainContent = document.querySelector('main > * > *');

        if (!instagramMainContent) return;

        const leftSideGroup = document.querySelector(
          'main > section > :last-of-type > :last-of-type'
        );

        const _chatWidth =
          instagramMainContent.getBoundingClientRect().left - 28;

        isSmallDesktopScreen = window.innerWidth < 1595;

        if (leftSideGroup) {
          leftSideGroup.style.opacity = isSmallDesktopScreen ? '0' : '1';

          leftSideGroupRect = leftSideGroup.getBoundingClientRect();

          this._iframe.style.display = '';
        } else {
          this._iframe.style.display = isSmallDesktopScreen ? 'none' : '';
        }

        const chatWidth = isSmallDesktopScreen
          ? leftSideGroup
            ? leftSideGroupRect.width
            : 287
          : _chatWidth;

        this._setCssProp(
          'width',
          instagramMainContent ? `${chatWidth}px` : '20vw'
        );

        this._setCssProp('height', 'calc(100vh - var(--chat-top))');
      })
    );
  }

  _update() {
    this._updateSize();
    this._updatePosition();
  }

  _handleUpdates() {
    this._update();
    window.addEventListener('resize', this._update, { passive: true });
    window.addEventListener('scroll', this._update, { passive: true });
  }
}
