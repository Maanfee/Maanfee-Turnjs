//export async function ensureDependencies() {
//    if (typeof window.$ === 'undefined' || typeof window.$.fn.turn === 'undefined') {
//        await LoadStyle('_content/Maanfee.Turnjs/css/turn.css');
//        await LoadScript('_content/Maanfee.Turnjs/js/JQuery.js');
//        await LoadScript('_content/Maanfee.Turnjs/js/Turn.js');
//        await LoadScript('_content/Maanfee.Turnjs/js/Zoom.js');
//        await LoadScript('_content/Maanfee.Turnjs/js/Configuration.js');
//    }
//}

export async function ensureDependencies() {
    if (typeof window.$ === 'undefined' || typeof window.$.fn.turn === 'undefined') {
        await LoadStyle('_content/Maanfee.Turnjs/css/turn.css');
        await LoadScript('_content/Maanfee.Turnjs/js/JQuery.js');
        await LoadScript('_content/Maanfee.Turnjs/js/Turn.js');
        await LoadScript('_content/Maanfee.Turnjs/js/Zoom.js');
        await LoadScript('_content/Maanfee.Turnjs/js/Configuration.js');
    }
}

function LoadStyle(src) {
    return new Promise((resolve, reject) => {
        const Link = document.createElement('link');
        Link.rel = "stylesheet";
        Link.href = src;
        Link.onload = resolve;
        Link.onerror = reject;
        document.head.appendChild(Link);
    });
}

function LoadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// *****************************************************

let currentFlipbook;

export function initialize(elementId, options, dotNetRef) {
    currentFlipbook = document.getElementById(elementId);

    let direction = options.direction === 0 ? "ltr" : "rtl";

    //const elements = document.querySelectorAll('.FrontCover, .FrontCover_Back, .BackCover, .BackCover_Back');
    //if (options.direction === 0) {
    //    elements.forEach(currentFlipbook => { currentFlipbook.style.setProperty('--image-mirror', '-1'); });
    //}
    //else {
    //    elements.forEach(currentFlipbook => { currentFlipbook.style.setProperty('--image-mirror', '1'); });
    //}

    //if (options.width == 0)
    //    options.width = $(window).width() * 0.65;

    //if (options.height == 0)
    //    options.height = $(window).height() * 0.94;

    $(currentFlipbook).turn({
        //width: options.width || calculateWidth(options.widthRatio),
        //height: options.height || calculateHeight(options.heightRatio),
        width: $(window).width() * 0.70,
        height: $(window).height() * 0.91,
        autoCenter: options.autoCenter,
        duration: options.duration,
        acceleration: options.acceleration,
        display: options.display,
        direction: direction,
        when: {
            turning: function (e, page, view) {
                dotNetRef.invokeMethodAsync('PageChanging', page);
            },
        }
    });

    $(currentFlipbook).on('turned', function (event, page) {
        const isSinglePage = $(this).turn('display') === 'single';
        dotNetRef.invokeMethodAsync('PageChanged', page, isSinglePage);
    });

    // *******************************

    OtherMethods(currentFlipbook);
}

export function dispose() {
    $(currentFlipbook).turn('destroy');
}

// *****************************************************

export function next() {
    $(currentFlipbook).turn('next');
}

export function previous() {
    $(currentFlipbook).turn('previous');
}

export function goToPage(pageNumber) {
    $(currentFlipbook).turn('page', pageNumber);
}

export function getPageCount() {
    return $(currentFlipbook).turn('pages');
}

export function getCurrentPage() {
    return $(currentFlipbook).turn('page');
}

// *******************************************

