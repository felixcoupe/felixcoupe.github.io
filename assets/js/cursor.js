/*
	Orange dot pointer.
	Browsers don't animate pointer images, so this hides the normal pointer and draws
	the dot on the page instead. Over anything clickable it sends out sonar-style rings.
	Only runs for a mouse; phones and tablets are left alone. If this script doesn't
	run, the CSS fallback in main.css still shows a static dot.
*/

(function() {

	// Skip devices with no mouse or trackpad at all. Laptops with a touchscreen still
	// qualify; touches on them are ignored per event below.
	if (window.matchMedia && !window.matchMedia('(any-pointer: fine)').matches)
		return;

	var root = document.documentElement,
		clickable = 'a, button, [role="button"], .button, button_new, .thumbnail img, #fullscreen-container, label, select',
		follower = document.createElement('div');

	follower.id = 'pointer';
	// Core positioning inline too, so the dot can't land in the page flow if an old
	// cached copy of main.css is still in use.
	follower.style.cssText = 'position:fixed;left:0;top:0;width:32px;height:32px;pointer-events:none;z-index:2147483647;';
	follower.setAttribute('aria-hidden', 'true');
	follower.innerHTML = '<span class="ring"></span><span class="ring r2"></span><img src="images/cursors/orange-dot.svg" alt="">';
	document.body.appendChild(follower);

	function hide() {
		follower.classList.remove('on', 'hover', 'down');
	}

	document.addEventListener('pointermove', function(e) {

		if (e.pointerType && e.pointerType !== 'mouse') {
			hide();
			root.classList.remove('has-pointer');
			return;
		}

		follower.style.transform = 'translate(' + (e.clientX - 16) + 'px,' + (e.clientY - 16) + 'px)';
		follower.classList.add('on');
		root.classList.add('has-pointer');
		follower.classList.toggle('hover', !!(e.target.closest && e.target.closest(clickable)));

	});

	// Embedded maps and videos draw their own pointer, so hide the dot over them.
	document.addEventListener('pointerover', function(e) {
		if (e.target.tagName === 'IFRAME')
			hide();
	});

	document.addEventListener('pointerdown', function() { follower.classList.add('down'); });
	document.addEventListener('pointerup', function() { follower.classList.remove('down'); });
	root.addEventListener('pointerleave', hide);
	window.addEventListener('blur', hide);

})();
