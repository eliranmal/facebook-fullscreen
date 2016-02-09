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


doc.addEventListener("readystatechange", function() {
    if (doc.readyState == "complete") {
        enableFullscreen();
    }
}, false);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message === 'fullscreen:go') {
        goFullscreen();
    }
});
