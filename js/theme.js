document.addEventListener('DOMContentLoaded', () => {

	// Get the expand navbar-menu button
	const $expandMenuButton = Array.prototype.slice.call(document.querySelectorAll('.navbar-brand a:last-child'), 0);

	// Check if there are any expand navbar-menu button
	if ($expandMenuButton.length > 0) {

		// Add a click event on each of them
		$expandMenuButton.forEach( el => {
			el.addEventListener('click', () => {

			// Get the target from the "data-target" attribute
			const target = el.dataset.target;
			const $target = document.getElementById(target);

			// Toggle the "is-expanded" class on both the "navbar-burger" and the "navbar-menu"
			el.classList.toggle('is-expanded');
			$target.classList.toggle('is-expanded');
			});
		});
	}
});