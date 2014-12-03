(function($) {
	skel.init({
		reset: 'full',
		grid: {
			gutters: ['2em', 0]
		},
		containers: '100%',
		breakpoints: {
			global: {
				href: '/assets/css/style.css'
			},
			xlarge: {
				media: '(max-width: 1680px)',
				href: '/assets/css/style-xlarge.css'
			},
			small: {
				media: '(max-width: 736px)',
				href: '/assets/css/style-small.css',
				viewport: {
					scalable: false
				}
			},
			xsmall: {
				media: '(max-width: 480px)',
				href: '/assets/css/style-xsmall.css'
			}
		}
	});
	$(function() {
		var $window = $(window),
			$body = $('body'),
			page = $body.attr('class').split(' ')[0];
		if (skel.vars.isMobile) $body.addClass('is-touch');
		$body.addClass('is-loading');
		$window.on('load', function() {
			$body.removeClass('is-loading');
		});
		switch (page) {
			case 'landing':
				if (!$body.hasClass('is-touch')) {
					var f = 10,
						$bg = $('#bg');
					$window.on('mousemove.n33 mouseenter.n33 mouseleave.n33', function(
						event) {
						var x = event.pageX,
							y = event.pageY,
							ww = $window.width(),
							wh = $window.height(),
							dx, dy, bx, by;
						dx = (x / ww);
						dy = (y / wh);
						bx = ((-2 * f) * dx) + f;
						by = ((-2 * f) * dy) + f;
						$bg.css('background-position', (bx + 'px') + ' ' + (by + 'px'));
					});
				}
				break;
		}
	});
})(jQuery);