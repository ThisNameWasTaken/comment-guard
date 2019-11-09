import { CommentGuard } from './CommentGuard';
import { addRootStyles } from './styles';

window.addEventListener('load', function init() {
	new CommentGuard();
	addRootStyles();
});
