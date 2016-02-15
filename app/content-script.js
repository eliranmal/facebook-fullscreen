// init constants and variables

var win = window,
    doc = document,
    selectors = {
        iframeCanvas: '#iframe_canvas'
    },
    prefixes = [
        'webkit',
        'moz',
        'ms',
        'o'
    ];

// declare functions

var log = function() {
    console.log.apply(console, arguments);
};

var err = function() {
    console.error.apply(console, arguments);
};

var getResource = function(path) {
    return chrome.extension.getURL(path);
};

var getImage = function(file) {
    return getResource('images/' + file + '.png');
};

var setVendorAttribute = function(element, attribute, value) {
    var i,
        val = (value + '').toLowerCase();
    for (i = 0; i < prefixes.length; i++) {
        element.setAttribute(prefixes[i] + attribute, val);
    }
    element.setAttribute(attribute, val);
}

var getRequestFullScreenImpl = function(element) {
    var propName, suffix = 'requestfullscreen';
    for (propName in element) {
        if (propName.toLowerCase().endsWith(suffix)) {
            return propName;
        }
    }
}

var requestFullscreen = function() {
    var element = this.element;
    log('requesting fullscreen', element);
    try {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    } catch (ex) {
        err(ex);
    }
};

var requestFullScreenCommand = function(selector) {
    var element = doc.querySelector(selector);
    if (!element) {
        err('failed to find element', selector);
        return;
    }
    log('requestfullscreen implementation', getRequestFullScreenImpl(element));
    return requestFullscreen.bind({
        element: element
    });
};

var allowFullscreen = function(selector) {
    var el = doc.querySelector(selector);
    if (el) {
        log('setting "allowFullScreen" attribute to "true"', el);
        setVendorAttribute(el, 'allowFullScreen', 'true');
    }
};

var goFullscreen = function() {
    requestFullScreenCommand(selectors.iframeCanvas)();
};

var enableFullscreen = function() {
    allowFullscreen(selectors.iframeCanvas);
};

var createFullscreenButton = function() {
    log('creating fullscreen button element');
    var b = document.createElement('button'),
        s = b.style;

    s.position = 'fixed';
    s.display = 'inline-block';
    s.width = '48px';
    s.height = '48px';
    s.backgroundColor = 'transparent';
    s.backgroundImage = 'url("' + getImage('logo-48') + '")';
    s.zIndex = '99999';

    b.addEventListener('click', function(e) {
        log('clicked the fullscreen button');
        goFullscreen();
    }, false);

    log(b);
    return b;
};

var addFullscreenButton = function() {
    var fullscreenButton = createFullscreenButton();
    document.querySelector(selectors.iframeCanvas).parentElement.appendChild(fullscreenButton);
};

doc.addEventListener('readystatechange', function() {
    if (doc.readyState == 'complete') {
        log('ready state is "complete"');
        enableFullscreen();
        createFullscreenButton();
    }
}, false);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message === 'fullscreen:go') {
        goFullscreen();
    }
});
