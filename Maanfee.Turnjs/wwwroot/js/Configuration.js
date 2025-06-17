
let currentFlipbook;

function OtherMethods(flipbookElement) {
    currentFlipbook = flipbookElement;

    // Events for the next button
    $('.next-button').bind($.mouseEvents.over, function () {

        $(this).addClass('next-button-hover');

    }).bind($.mouseEvents.out, function () {

        $(this).removeClass('next-button-hover');

    }).bind($.mouseEvents.down, function () {

        $(this).addClass('next-button-down');

    }).bind($.mouseEvents.up, function () {

        $(this).removeClass('next-button-down');

    }).click(function () {

        $(currentFlipbook).turn('next');

    });

    // Events for the previous button
    $('.previous-button').bind($.mouseEvents.over, function () {

        $(this).addClass('previous-button-hover');

    }).bind($.mouseEvents.out, function () {

        $(this).removeClass('previous-button-hover');

    }).bind($.mouseEvents.down, function () {

        $(this).addClass('previous-button-down');

    }).bind($.mouseEvents.up, function () {

        $(this).removeClass('previous-button-down');

    }).click(function () {

        $(currentFlipbook).turn('previous');

    });

    // *******************************

    // Using arrow keys to turn the page
    $(document).keydown(function (e) {

        setTimeout(function () {

            if ($('.magazine-viewport').data().regionClicked) {
                $('.magazine-viewport').data().regionClicked = false;
            }
            else {
                if ($('.magazine-viewport').zoom('value') == 1) {
                    //$('.magazine-viewport').zoom('zoomIn');
                }
                else {
                    $('.magazine-viewport').zoom('zoomOut');    // وقتی صفحه ورق می خورد از زوم خارج می گردد
                }
            }
        }, 500);

        var previous = 37, next = 39, esc = 27;

        switch (e.keyCode) {
            case previous:

                // left arrow
                $(currentFlipbook).turn('previous');
                //e.preventDefault();   // کلید راست و چپ را غیر فعال می کند

                break;
            case next:

                //right arrow
                $(currentFlipbook).turn('next');
                //e.preventDefault();   // کلید راست و چپ را غیر فعال می کند

                break;
            case esc:

                $('.magazine-viewport').zoom('zoomOut');
                //e.preventDefault();

                break;
        }
    });

    // *******************************

    // Zoom.js
    $('.magazine-viewport').zoom({
        flipbook: $(currentFlipbook),
        max: function () {
            return largeMagazineWidth() / $(currentFlipbook).width();
        },

        when: {
            swipeLeft: function () {
                $(this).zoom('flipbook').turn('next');
            },

            swipeRight: function () {
                $(this).zoom('flipbook').turn('previous');
            },

            resize: function (event, scale, page, pageElement) {
                if (scale == 1)
                    loadSmallPage(page, pageElement);
                else
                    loadLargePage(page, pageElement);
            },

            zoomIn: function () {
                $('.made').hide();
                $(currentFlipbook).removeClass('animated').addClass('zoom-in');

                if (!window.escTip && !$.isTouch) {
                    escTip = true;

                    $('<div />', { 'class': 'exit-message' }).
                        html('<div>Press ESC to exit</div>').
                        appendTo($('body')).
                        delay(2000).
                        animate({ opacity: 0 }, 500, function () {
                            $(this).remove();
                        });
                }
            },

            zoomOut: function () {
                $('.exit-message').hide();
                $('.made').fadeIn();
                setTimeout(function () {
                    $(currentFlipbook).addClass('animated').removeClass('zoom-in');
                    resizeViewport();
                }, 0);

            }
        }
    });

    // Zoom event
    if ($.isTouch)
        $('.magazine-viewport').bind('zoom.doubleTap', zoomTo);
    else
        $('.magazine-viewport').bind('zoom.tap', zoomTo);

    // *******************************

    $(window).resize(function () {
        resizeViewport();
    }).bind('orientationchange', function () {
        resizeViewport();
    });

    // *******************************

    // Regions
    if ($.isTouch) {
        $(currentFlipbook).bind('touchstart', regionClick);
    }
    else {
        $(currentFlipbook).click(regionClick);
    }

    // *******************************

    resizeViewport();

    $(currentFlipbook).addClass('animated');
}

// Zoom in / Zoom out
function zoomTo(event) {

    //alert($(event.target).attr('class'));
    //alert($(event.target.nodeName).find("img").attr('class'));
    //alert(event.target.id + " | " + $(event.target).attr('class'));

    setTimeout(function () {

        if (event.target && $(event.target).hasClass('zoom-this')) {
            if ($('.magazine-viewport').data().regionClicked) {
                $('.magazine-viewport').data().regionClicked = false;
            }
            else {
                if ($('.magazine-viewport').zoom('value') == 1) {
                    $('.magazine-viewport').zoom('zoomIn', event);
                }
                else {
                    $('.magazine-viewport').zoom('zoomOut');
                }
            }
        }

    }, 10);

}

// Process click on a region
function regionClick(event) {

    var region = $(event.target);
    if (region.hasClass('region')) {
        $('.magazine-viewport').data().regionClicked = true;
        setTimeout(function () {
            $('.magazine-viewport').data().regionClicked = false;
        }, 100);

        var regionType = $.trim(region.attr('class').replace('region', ''));
        return processRegion(region, regionType);
    }

}

// Process the data of every region
function processRegion(region, regionType) {

    data = decodeParams(region.attr('region-data'));
    switch (regionType) {
        case 'link':
            window.open(data.url);
            break;
        case 'zoom':
            var regionOffset = region.offset(),
                viewportOffset = $('.magazine-viewport').offset(),
                pos = {
                    x: regionOffset.left - viewportOffset.left,
                    y: regionOffset.top - viewportOffset.top
                };
            $('.magazine-viewport').zoom('zoomIn', pos);
            break;
        case 'to-page':
            $(currentFlipbook).turn('page', data.page);
            break;
    }
}

// Load large page
function loadLargePage(page, pageElement) {

}

// Load small page
function loadSmallPage(page, pageElement) {

}

// Set the width and height for the viewport
function resizeViewport() {

    $(currentFlipbook).removeClass('animated');

    var width = $(window).width(),
        height = $(window).height(),
        options = $(currentFlipbook).turn('options');

    $('.magazine-viewport').css({
        width: width,
        height: height
    }).zoom('resize');

    if ($(currentFlipbook).turn('zoom') == 1) {
        var bound = calculateBound({
            width: options.width,
            height: options.height,
            boundWidth: Math.min(options.width, width),
            boundHeight: Math.min(options.height, height)
        });

        if (bound.width % 2 !== 0)
            bound.width -= 1;

        if (bound.width != $(currentFlipbook).width() || bound.height != $(currentFlipbook).height()) {

            $(currentFlipbook).turn('size', bound.width, bound.height);

            if ($(currentFlipbook).turn('page') == 1)
                $(currentFlipbook).turn('peel', 'br');

            $('.next-button').css({ height: bound.height, backgroundPosition: '-38px ' + (bound.height / 2 - 32 / 2) + 'px' });
            $('.previous-button').css({ height: bound.height, backgroundPosition: '-4px ' + (bound.height / 2 - 32 / 2) + 'px' });
        }

        $(currentFlipbook).css({
            top: -bound.height / 2,
            left: -bound.width / 2,
        });
    }

    var magazineOffset = $(currentFlipbook).offset();

    if (magazineOffset.top < $('.made').height())
        $('.made').hide();
    else
        $('.made').show();

    $(currentFlipbook).addClass('animated');
}

// Width of the flipbook when zoomed in
function largeMagazineWidth() {
    return 2214;
}

// decode URL Parameters
function decodeParams(data) {

    var parts = data.split('&'), d, obj = {};

    for (var i = 0; i < parts.length; i++) {
        d = parts[i].split('=');
        obj[decodeURIComponent(d[0])] = decodeURIComponent(d[1]);
    }

    return obj;
}

// Calculate the width and height of a square within another square
function calculateBound(d) {

    var bound = { width: d.width, height: d.height };

    if (bound.width > d.boundWidth || bound.height > d.boundHeight) {

        var rel = bound.width / bound.height;

        if (d.boundWidth / rel > d.boundHeight && d.boundHeight * rel <= d.boundWidth) {

            bound.width = Math.round(d.boundHeight * rel);
            bound.height = d.boundHeight;

        }
        else {

            bound.width = d.boundWidth;
            bound.height = Math.round(d.boundWidth / rel);

        }
    }

    return bound;
}

// ********************************************************
