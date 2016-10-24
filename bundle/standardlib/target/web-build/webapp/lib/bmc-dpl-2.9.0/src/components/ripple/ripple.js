;(function () {
    angular.module("dRippleEffect", [])
        .directive("dRipple", function () {
            "use strict";
            return {
                restrict: "A",
                replace: true,
                controller: ['$scope', function ($scope) {
                    function isWindow(obj) {
                        return obj !== null && obj === obj.window;
                    }

                    function getWindow(elem) {
                        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
                    }

                    function offset(elem) {
                        var docElem, win,
                            box = {
                                top: 0,
                                left: 0
                            },
                            doc = elem && elem.ownerDocument;

                        docElem = doc.documentElement;

                        if (typeof elem.getBoundingClientRect !== typeof undefined) {
                            box = elem.getBoundingClientRect();
                        }
                        win = getWindow(doc);
                        return {
                            top: box.top + win.pageYOffset - docElem.clientTop,
                            left: box.left + win.pageXOffset - docElem.clientLeft
                        };
                    }

                    function convertStyle(obj) {
                        var style = '';
                        for (var a in obj) {
                            if (obj.hasOwnProperty(a)) {
                                style += (a + ':' + obj[a] + ';');
                            }
                        }
                        return style;
                    }

                    var Effect = {
                        duration: 900,
                        show: function (e, element) {
                            if (e.button === 2) {
                                return false;
                            }
                            var el = element || this,
                                ripple = document.createElement('div');
                            ripple.className = 'd-ripple__effect';
                            el.appendChild(ripple);

                            // Get click coordinate and element width
                            var pos = offset(el),
                                relativeY = (e.pageY - pos.top),
                                relativeX = (e.pageX - pos.left),
                                scale = 'scale(' + ((el.clientWidth / 100) * 10) + ')';

                            // Support for touch devices
                            if ('touches' in e) {
                                relativeY = (e.touches[0].pageY - pos.top);
                                relativeX = (e.touches[0].pageX - pos.left);
                            }

                            // Attach data to element
                            ripple.setAttribute('data-hold', Date.now());
                            ripple.setAttribute('data-scale', scale);
                            ripple.setAttribute('data-x', relativeX);
                            ripple.setAttribute('data-y', relativeY);

                            // Set ripple position
                            var rippleStyle = {
                                top: relativeY + 'px',
                                left: relativeX + 'px'
                            };

                            ripple.className = ripple.className + ' ripple-notransition';
                            ripple.setAttribute('style', convertStyle(rippleStyle));
                            ripple.className = ripple.className.replace('ripple-notransition', '');

                            // Scale the ripple
                            rippleStyle['-webkit-transform'] = scale;
                            rippleStyle['-moz-transform'] = scale;
                            rippleStyle['-ms-transform'] = scale;
                            rippleStyle['-o-transform'] = scale;
                            rippleStyle.transform = scale;
                            rippleStyle.opacity = '1';

                            rippleStyle['-webkit-transition-duration'] = Effect.duration + 'ms';
                            rippleStyle['-moz-transition-duration'] = Effect.duration + 'ms';
                            rippleStyle['-o-transition-duration'] = Effect.duration + 'ms';
                            rippleStyle['transition-duration'] = Effect.duration + 'ms';

                            rippleStyle['-webkit-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
                            rippleStyle['-moz-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
                            rippleStyle['-o-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
                            rippleStyle['transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
                            ripple.setAttribute('style', convertStyle(rippleStyle));
                        },

                        hide: function (e) {
                            TouchHandler.touchup(e);
                            var el = this,
                                width = el.clientWidth * 1.4,
                                ripple = null,
                                ripples = el.getElementsByClassName('d-ripple__effect');

                            if (ripples.length > 0) {
                                ripple = ripples[ripples.length - 1];
                            } else {
                                return false;
                            }

                            var relativeX = ripple.getAttribute('data-x'),
                                relativeY = ripple.getAttribute('data-y'),
                                scale = ripple.getAttribute('data-scale'),
                                diff = Date.now() - Number(ripple.getAttribute('data-hold')),
                                delay = 350 - diff;

                            if (delay < 0) {
                                delay = 0;
                            }

                            setTimeout(function () {
                                var style = {
                                    top: relativeY + 'px',
                                    left: relativeX + 'px',
                                    opacity: '0',

                                    '-webkit-transition-duration': Effect.duration + 'ms',
                                    '-moz-transition-duration': Effect.duration + 'ms',
                                    '-o-transition-duration': Effect.duration + 'ms',
                                    'transition-duration': Effect.duration + 'ms',
                                    '-webkit-transform': scale,
                                    '-moz-transform': scale,
                                    '-ms-transform': scale,
                                    '-o-transform': scale,
                                    transform: scale
                                };

                                ripple.setAttribute('style', convertStyle(style));
                                setTimeout(function () {
                                    try {
                                        el.removeChild(ripple);
                                    } catch (e) {
                                        return false;
                                    }
                                }, Effect.duration);
                            }, delay);
                        }
                    };
                    /**
                     * Disable mousedown event for 500ms during and after touch
                     */
                    var TouchHandler = {
                        touches: 0,
                        allowEvent: function (e) {
                            var allow = true;

                            if (e.type === 'touchstart') {
                                TouchHandler.touches += 1; //push
                            } else if (e.type === 'touchend' || e.type === 'touchcancel') {
                                setTimeout(function () {
                                    if (TouchHandler.touches > 0) {
                                        TouchHandler.touches -= 1; //pop after 500ms
                                    }
                                }, 500);
                            } else if (e.type === 'mousedown' && TouchHandler.touches > 0) {
                                allow = false;
                            }

                            return allow;
                        },
                        touchup: function (e) {
                            TouchHandler.allowEvent(e);
                        }
                    };


                    /**
                     * Delegated click handler for .d-ripple element.
                     * returns null when .d-ripple element not in "click tree"
                     */
                    function getRippleEffectElement(e) {
                        if (TouchHandler.allowEvent(e) === false) {
                            return null;
                        }
                        var element = null,
                            target = e.target || e.srcElement;

                        if (target.parentElement == undefined) {
                            return null;
                        }

                        while (target.parentElement !== null) {
                            if (!(target instanceof SVGElement) && target.hasAttribute('d-ripple')) {
                                element = target;
                                break;
                            }
                            target = target.parentElement;
                        }
                        return element;
                    }

                    /**
                     * Bubble the click and show effect if .d-ripple elem was found
                     */
                    $scope.showEffect = function showEffect(e) {
                        var element = getRippleEffectElement(e);
                        if (element !== null) {
                            Effect.show(e, element);
                            if ('ontouchstart' in window) {
                                element.addEventListener('touchend', Effect.hide, false);
                                element.addEventListener('touchcancel', Effect.hide, false);
                            }

                            element.addEventListener('mouseup', Effect.hide, false);
                            element.addEventListener('mouseleave', Effect.hide, false);
                        }
                    }
                }],
                link: function ($scope, element) {
                    if ('ontouchstart' in window) {
                        element.on("touchstart", $scope.showEffect);
                    }
                    element.on("mousedown", $scope.showEffect);

                    $scope.$on("$destroy", function() {
                        if ('ontouchstart' in window) {
                            element.off("touchstart", $scope.showEffect);
                        }
                        element.off("mousedown", $scope.showEffect);
                    });
                }
            };
        })

}());