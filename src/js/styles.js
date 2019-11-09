import { css } from './mocks';

export function addRootStyles() {
	const rootStyleTag = document.createElement('style');
	rootStyleTag.appendChild(document.createTextNode(rootStyles));
	document.head.appendChild(rootStyleTag);
}

export const rootStyles = css`
	.is-toxic > * {
		visibility: hidden !important;
	}

	.is-toxic {
		position: relative;
		pointer-events: none;
	}

	.is-toxic::before {
		padding: 8px;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		color: #fff;
		background: #f43;
		font-size: 16px;
		z-index: 1;
		text-align: center;

		content: 'This content may be disturbing for some people';
	}

	.is-toxic::after {
		position: absolute;
		padding: 8px 16px;
		background: #fff;
		color: #f43;
		border-radius: 4px;
		z-index: 2;
		text-transform: uppercase;
		font-weight: bold;
		font-size: 12px;
		pointer-events: auto;
		bottom: 4px;
		left: 50%;
		transform: translateX(-50%);
		cursor: pointer;

		content: 'Reveal';
	}
`;
