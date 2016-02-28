(function ($) {
    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1080px)',
        medium: '(max-width: 768px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)'
    });
    $(function () {
        var $window = $(window),
            $body = $('body'),
            page = $body.attr('class').split(' ')[0];
        if (skel.vars.mobile) $body.addClass('is-touch');
        $body.addClass('is-loading');
        $window.on('load', function () {
            window.setTimeout(function () {
                $body.removeClass('is-loading');
            }, 0);
        });
        switch (page) {
            case 'landing':
                if (!$body.hasClass('is-touch')) {
                    var f = 10,
                        $bg = $('#bg');
                    $window.on('mousemove.n33 mouseenter.n33 mouseleave.n33', function (event) {
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
