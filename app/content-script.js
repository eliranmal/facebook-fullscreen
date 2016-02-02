// jsfiddle: https://jsfiddle.net/eliranmal/su3vjt0o/

// todo - publish to chrome web store :)

(function(win, doc) {

    // init constants

    var selectors = {
        log: '#log',
        iframeCanvas: '#iframe_canvas'
    };

    var prefixes = [
        'webkit',
        'moz',
        'ms',
        'o'
    ];

    // declare functions

    var log = function() {
        var i, arg,
            args = [].slice.call(arguments);
        if (logElement) {
            logElement.innerHTML += args.join(' ') + '<br />';
        } else {
            console.log.apply(console, arguments);
        }
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

    var elementRequestFullScreen = function(selector) {
        var element = doc.querySelector(selector);
        log('requestfullscreen implementation',
            getRequestFullScreenImpl(element));
        return function(e) {
            log('requesting fullscreen on', element, selector);
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
                log('[error]', ex);
            }
        }
    };


    // create elements

    var iFrameCanvasElement = (function() {
        var el = doc.querySelector(selectors.iframeCanvas);
        if (!el) {
            return;
        }
        setVendorAttribute(el, 'allowFullScreen', 'true');
        return el;
    })();

    var logElement = (function() {
        var el = doc.querySelector(selectors.log);
        if (!el) {
            return;
        }
        el.style.lineHeight = '1.5';
        el.style.padding = '1em';
        el.style.backgroundColor = '#eee';
        return el;
    })();


    var fullScreenButton = (function() {
        var b = doc.createElement('button');
        b.addEventListener('click', elementRequestFullScreen(
            selectors.iframeCanvas));
        b.textContent = '[ fullscreen ]';
        b.style.position = 'fixed';
        b.style.bottom = 0;
        b.style.left = 0;
        b.style.padding = '.4em .8em';
        b.style.fontSize = '1.2em';
        //  b.style.fontFamily = '"trebuchet ms", sans-serif';
        b.style.fontFamily = '"courier new", monospace';
        //  b.style.fontWeight = 'bold';
        b.style.zIndex = '99999';
        return b;
    })();



    // go

    doc.getElementsByTagName('body')[0].appendChild(fullScreenButton);



    /*
  var setVendorStyle = function(element, property, value) {
    var i,
      prop = property + '',
      cProp = prop.slice(0, 1).toUpperCase() + prop.slice(1);
    for (i = 0; i < prefixes.length; i++) {
	    element.style[prefixes[i] + cProp] = value;
    }
    element.style[prop] = value;
  }

var zoomIn = function(selector) {
    var el = doc.querySelector(selector);
    log('zooming in on', el);
    el.style.zoom = 2;
    setVendorStyle(el, 'transform', 'scale(2)');
    setVendorStyle(el, 'transformOrigin', '0 0');
    log('zoomed in on', el);
  };

  var zoomOut = function(selector) {
    var el = doc.querySelector(selector);
    log('zooming out from', el);
    el.style.zoom = 1;
    setVendorStyle(el, 'transform', 'scale(1)');
    setVendorStyle(el, 'transformOrigin', '0 0');
    log('zoomed out from', el);
  };

  doc.addEventListener('fullscreenchange', function(event) {
    if (doc.fullscreenEnabled) {
      doc.fullscreenElement;
      zoomIn('body');
    } else {
      zoomOut('body');
    }
  });


  // a dirty hack for jsfiddle, might be good for other envs, too
  if (win.frameElement) {
    elementAllowFullScreen(win.frameElement);
  }
  log('win.frameElement is ', win.frameElement);
  */

})(window, document);
