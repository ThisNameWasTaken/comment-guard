import { Filters } from './filters';
import { Hosts } from './hosts';
import { CommentObserver } from './commentObjserver';
import { commentSelectors } from './selectors';

export class CommentGuard {
	constructor() {
		this.host = window.location.host;
		this.prevHost = null;

		this.commentObserver = new CommentObserver(this.onDomUpdate);
		this.commentObserver.observe();
		this.commentSelector = null;

		this.watchHost();
	}

	onDomUpdate(mutationList, observer) {
		mutationList.filter(Filters.YouTube).forEach(mutation => {
			mutation.target.querySelector('#content-text').textContent;
			const text = mutation.target.querySelector('#content-text').textContent;

			// TODO: Check if the text is toxic

			mutation.target.classList.add('is-toxic');
		});
	}

	watchHost() {
		window.addEventListener('popstate', () => {
			if (!this.prevHost || this.prevHost !== this.host) {
				this.commentObserver.disconnect();
				this.commentObserver.observe();
			}

			this.prevHost = this.host;
			this.host = window.location.host;

			this.updateCommentSelector();
		});
	}

	updateCommentSelector() {
		if (this.host.includes(Hosts.YouTube)) {
			this.commentSelector = commentSelectors.YouTube;
		} else {
			this.commentSelector = commentSelectors.None;
		}
	}
}
