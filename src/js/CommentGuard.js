import { Filters } from './filters';
import { Hosts } from './hosts';
import { CommentObserver } from './commentObjserver';
import { commentSelectors } from './selectors';

// import * as toxicity from '@tensorflow-models/toxicity';

export class CommentGuard {
	constructor() {
		this.checkComments = this.checkComments.bind(this);
		this.onDomUpdate = this.onDomUpdate.bind(this);
		this.watchHost = this.watchHost.bind(this);
		this.updateCommentSelector = this.updateCommentSelector.bind(this);
		this.markAsToxic = this.markAsToxic.bind(this);
		this.getComments = this.getComment.bind(this);

		this.host = window.location.host;
		this.prevHost = null;

		this.commentsToCheck = [];

		this.commentObserver = new CommentObserver(this.onDomUpdate);
		this.commentObserver.observe();
		this.commentSelector = null;

		this.model = {
			classify(text) {
				return fetch('http://localhost:5050', {
					method: 'POST', // *GET, POST, PUT, DELETE, etc.
					mode: 'cors', // no-cors, *cors, same-origin
					cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
					credentials: 'same-origin', // include, *same-origin, omit
					headers: {
						'Content-Type': 'application/json',
						// 'Content-Type': 'application/x-www-form-urlencoded',
					},
					redirect: 'follow', // manual, *follow, error
					referrer: 'no-referrer', // no-referrer, *client
					body: JSON.stringify({ text }), // body data type must match "Content-Type" header
				}).then(res => res.json());
			},
		};

		this.watchHost();
	}

	onDomUpdate(mutationList, observer) {
		mutationList
			.filter(Filters.YouTube)
			.map(mutation => this.getComment(mutation.target))
			.forEach(comment => {
				if (!this.commentsToCheck.find(({ text }) => text === comment.text)) {
					this.commentsToCheck.push(comment);
				}
			});

		console.log(this.commentsToCheck);

		this.checkComments();
	}

	getComment(node) {
		return { node, text: node.querySelector('#content-text').textContent };
	}

	checkComments() {
		console.log('try check comments');
		if (!this.model || !this.commentsToCheck || this.commentsToCheck.length === 0) return;
		console.log('checking comments');

		this.commentsToCheck.forEach(({ node, text }) => {
			this.model.classify(text).then(prediction => {
				const isToxic = prediction[6].results[0].match;
				console.log(isToxic);

				if (isToxic) {
					this.markAsToxic(node);
				}
			});
		});

		this.commentsToCheck = [];
	}

	markAsToxic(element) {
		element.classList.add('is-toxic');

		element.addEventListener(
			'click',
			event => {
				element.classList.remove('is-toxic');
			},
			{ once: true }
		);
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
