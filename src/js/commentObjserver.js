export class CommentObserver {
	constructor(callback) {
		this._options = {
			attributes: false,
			childList: true,
			subtree: true,
		};

		this._mutationObserver = new MutationObserver(callback);
	}

	observe(target) {
		this._mutationObserver.observe(target || document.body, this._options);
	}

	disconnect() {
		this._mutationObserver.disconnect();
	}
}
