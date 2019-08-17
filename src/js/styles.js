import { css } from './mocks';

export const rootStyles = css`
  #inbox-iframe {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 6;
    background: #fff;
    min-width: 293px;
    border: 1px solid #e6e6e6;
    transform: translateX(var(--chat-left)) translateY(var(--chat-top));
    height: var(--chat-height);
    width: var(--chat-width);
    transition: transform var(--chat-top-transition-duration) ease-in-out
      var(--chat-top-transition-delay);
  }

  nav {
    z-index: 8;
    position: fixed;
  }

  body > [role='dialog'] {
    z-index: 999 !important;
  }
`;

export const chatStyles = css`
  body {
    background: #fff;
    overflow-y: hidden !important;
  }
`;
