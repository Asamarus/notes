/**
 * Open url as popup
 *
 * @param {String} url - url
 * @param {Object}  options - options
 * @return {Object} popup - window
 */
function openAsPopup(url, options?) {
	const defaults = {
		name: '_blank',
		width: 500,
		height: 700,
		focus: true,
	};

	options =
		typeof options !== 'undefined'
			? Object.assign({}, defaults, options)
			: Object.assign({}, defaults);

	const left = screen.width / 2 - options.width / 2;
	const top = screen.height / 2 - options.height / 2;
	const popup = window.open(
		url,
		options.name,
		'width=' +
			options.width +
			',scrollbars=1,resizable=yes,height=' +
			options.height +
			',top=' +
			top +
			',left=' +
			left,
	);

	if (options.focus) {
		if (window.focus) {
			popup.focus();
		}
	}

	return popup;
}

export default openAsPopup;
