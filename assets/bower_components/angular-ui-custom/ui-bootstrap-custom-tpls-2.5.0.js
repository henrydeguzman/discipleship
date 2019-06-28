/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 2.5.0 - 2017-01-28
 * License: MIT
 */angular.module("ui.bootstrap", ["ui.bootstrap.tpls","ui.bootstrap.modal","ui.bootstrap.multiMap","ui.bootstrap.stackedMap","ui.bootstrap.position","ui.bootstrap.datepickerPopup","ui.bootstrap.datepicker","ui.bootstrap.dateparser","ui.bootstrap.isClass","ui.bootstrap.timepicker"]);
angular.module("ui.bootstrap.tpls", ["uib/template/modal/window.html","uib/template/datepickerPopup/popup.html","uib/template/datepicker/datepicker.html","uib/template/datepicker/day.html","uib/template/datepicker/month.html","uib/template/datepicker/year.html","uib/template/timepicker/timepicker.html"]);
angular.module('ui.bootstrap.modal', ['ui.bootstrap.multiMap', 'ui.bootstrap.stackedMap', 'ui.bootstrap.position'])
/**
 * Pluggable resolve mechanism for the modal resolve resolution
 * Supports UI Router's $resolve service
 */
    .provider('$uibResolve', function() {
        var resolve = this;
        this.resolver = null;

        this.setResolver = function(resolver) {
            this.resolver = resolver;
        };

        this.$get = ['$injector', '$q', function($injector, $q) {
            var resolver = resolve.resolver ? $injector.get(resolve.resolver) : null;
            return {
                resolve: function(invocables, locals, parent, self) {
                    if (resolver) {
                        return resolver.resolve(invocables, locals, parent, self);
                    }

                    var promises = [];

                    angular.forEach(invocables, function(value) {
                        if (angular.isFunction(value) || angular.isArray(value)) {
                            promises.push($q.resolve($injector.invoke(value)));
                        } else if (angular.isString(value)) {
                            promises.push($q.resolve($injector.get(value)));
                        } else {
                            promises.push($q.resolve(value));
                        }
                    });

                    return $q.all(promises).then(function(resolves) {
                        var resolveObj = {};
                        var resolveIter = 0;
                        angular.forEach(invocables, function(value, key) {
                            resolveObj[key] = resolves[resolveIter++];
                        });

                        return resolveObj;
                    });
                }
            };
        }];
    })

    /**
     * A helper directive for the $modal service. It creates a backdrop element.
     */
    .directive('uibModalBackdrop', ['$animate', '$injector', '$uibModalStack',
        function($animate, $injector, $modalStack) {
            return {
                restrict: 'A',
                compile: function(tElement, tAttrs) {
                    tElement.addClass(tAttrs.backdropClass);
                    return linkFn;
                }
            };

            function linkFn(scope, element, attrs) {
                if (attrs.modalInClass) {
                    $animate.addClass(element, attrs.modalInClass);

                    scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
                        var done = setIsAsync();
                        if (scope.modalOptions.animation) {
                            $animate.removeClass(element, attrs.modalInClass).then(done);
                        } else {
                            done();
                        }
                    });
                }
            }
        }])

    .directive('uibModalWindow', ['$uibModalStack', '$q', '$animateCss', '$document',
        function($modalStack, $q, $animateCss, $document) {
            return {
                scope: {
                    index: '@'
                },
                restrict: 'A',
                transclude: true,
                templateUrl: function(tElement, tAttrs) {
                    return tAttrs.templateUrl || 'uib/template/modal/window.html';
                },
                link: function(scope, element, attrs) {
                    element.addClass(attrs.windowTopClass || '');
                    scope.size = attrs.size;

                    scope.close = function(evt) {
                        var modal = $modalStack.getTop();
                        if (modal && modal.value.backdrop &&
                            modal.value.backdrop !== 'static' &&
                            evt.target === evt.currentTarget) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            $modalStack.dismiss(modal.key, 'backdrop click');
                        }
                    };

                    // moved from template to fix issue #2280
                    element.on('click', scope.close);

                    // This property is only added to the scope for the purpose of detecting when this directive is rendered.
                    // We can detect that by using this property in the template associated with this directive and then use
                    // {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}.
                    scope.$isRendered = true;

                    // Deferred object that will be resolved when this modal is rendered.
                    var modalRenderDeferObj = $q.defer();
                    // Resolve render promise post-digest
                    scope.$$postDigest(function() {
                        modalRenderDeferObj.resolve();
                    });

                    modalRenderDeferObj.promise.then(function() {
                        var animationPromise = null;

                        if (attrs.modalInClass) {
                            animationPromise = $animateCss(element, {
                                addClass: attrs.modalInClass
                            }).start();

                            scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
                                var done = setIsAsync();
                                $animateCss(element, {
                                    removeClass: attrs.modalInClass
                                }).start().then(done);
                            });
                        }


                        $q.when(animationPromise).then(function() {
                            // Notify {@link $modalStack} that modal is rendered.
                            var modal = $modalStack.getTop();
                            if (modal) {
                                $modalStack.modalRendered(modal.key);
                            }

                            /**
                             * If something within the freshly-opened modal already has focus (perhaps via a
                             * directive that causes focus) then there's no need to try to focus anything.
                             */
                            if (!($document[0].activeElement && element[0].contains($document[0].activeElement))) {
                                var inputWithAutofocus = element[0].querySelector('[autofocus]');
                                /**
                                 * Auto-focusing of a freshly-opened modal element causes any child elements
                                 * with the autofocus attribute to lose focus. This is an issue on touch
                                 * based devices which will show and then hide the onscreen keyboard.
                                 * Attempts to refocus the autofocus element via JavaScript will not reopen
                                 * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
                                 * the modal element if the modal does not contain an autofocus element.
                                 */
                                if (inputWithAutofocus) {
                                    inputWithAutofocus.focus();
                                } else {
                                    element[0].focus();
                                }
                            }
                        });
                    });
                }
            };
        }])

    .directive('uibModalAnimationClass', function() {
        return {
            compile: function(tElement, tAttrs) {
                if (tAttrs.modalAnimation) {
                    tElement.addClass(tAttrs.uibModalAnimationClass);
                }
            }
        };
    })

    .directive('uibModalTransclude', ['$animate', function($animate) {
        return {
            link: function(scope, element, attrs, controller, transclude) {
                transclude(scope.$parent, function(clone) {
                    element.empty();
                    $animate.enter(clone, element);
                });
            }
        };
    }])

    .factory('$uibModalStack', ['$animate', '$animateCss', '$document',
        '$compile', '$rootScope', '$q', '$$multiMap', '$$stackedMap', '$uibPosition',
        function($animate, $animateCss, $document, $compile, $rootScope, $q, $$multiMap, $$stackedMap, $uibPosition) {
            var OPENED_MODAL_CLASS = 'modal-open';

            var backdropDomEl, backdropScope;
            var openedWindows = $$stackedMap.createNew();
            var openedClasses = $$multiMap.createNew();
            var $modalStack = {
                NOW_CLOSING_EVENT: 'modal.stack.now-closing'
            };
            var topModalIndex = 0;
            var previousTopOpenedModal = null;
            var ARIA_HIDDEN_ATTRIBUTE_NAME = 'data-bootstrap-modal-aria-hidden-count';

            //Modal focus behavior
            var tabbableSelector = 'a[href], area[href], input:not([disabled]):not([tabindex=\'-1\']), ' +
                'button:not([disabled]):not([tabindex=\'-1\']),select:not([disabled]):not([tabindex=\'-1\']), textarea:not([disabled]):not([tabindex=\'-1\']), ' +
                'iframe, object, embed, *[tabindex]:not([tabindex=\'-1\']), *[contenteditable=true]';
            var scrollbarPadding;
            var SNAKE_CASE_REGEXP = /[A-Z]/g;

            // TODO: extract into common dependency with tooltip
            function snake_case(name) {
                var separator = '-';
                return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
                    return (pos ? separator : '') + letter.toLowerCase();
                });
            }

            function isVisible(element) {
                return !!(element.offsetWidth ||
                element.offsetHeight ||
                element.getClientRects().length);
            }

            function backdropIndex() {
                var topBackdropIndex = -1;
                var opened = openedWindows.keys();
                for (var i = 0; i < opened.length; i++) {
                    if (openedWindows.get(opened[i]).value.backdrop) {
                        topBackdropIndex = i;
                    }
                }

                // If any backdrop exist, ensure that it's index is always
                // right below the top modal
                if (topBackdropIndex > -1 && topBackdropIndex < topModalIndex) {
                    topBackdropIndex = topModalIndex;
                }
                return topBackdropIndex;
            }

            $rootScope.$watch(backdropIndex, function(newBackdropIndex) {
                if (backdropScope) {
                    backdropScope.index = newBackdropIndex;
                }
            });

            function removeModalWindow(modalInstance, elementToReceiveFocus) {
                var modalWindow = openedWindows.get(modalInstance).value;
                var appendToElement = modalWindow.appendTo;

                //clean up the stack
                openedWindows.remove(modalInstance);
                previousTopOpenedModal = openedWindows.top();
                if (previousTopOpenedModal) {
                    topModalIndex = parseInt(previousTopOpenedModal.value.modalDomEl.attr('index'), 10);
                }

                removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, function() {
                    var modalBodyClass = modalWindow.openedClass || OPENED_MODAL_CLASS;
                    openedClasses.remove(modalBodyClass, modalInstance);
                    var areAnyOpen = openedClasses.hasKey(modalBodyClass);
                    appendToElement.toggleClass(modalBodyClass, areAnyOpen);
                    if (!areAnyOpen && scrollbarPadding && scrollbarPadding.heightOverflow && scrollbarPadding.scrollbarWidth) {
                        if (scrollbarPadding.originalRight) {
                            appendToElement.css({paddingRight: scrollbarPadding.originalRight + 'px'});
                        } else {
                            appendToElement.css({paddingRight: ''});
                        }
                        scrollbarPadding = null;
                    }
                    toggleTopWindowClass(true);
                }, modalWindow.closedDeferred);
                checkRemoveBackdrop();

                //move focus to specified element if available, or else to body
                if (elementToReceiveFocus && elementToReceiveFocus.focus) {
                    elementToReceiveFocus.focus();
                } else if (appendToElement.focus) {
                    appendToElement.focus();
                }
            }

            // Add or remove "windowTopClass" from the top window in the stack
            function toggleTopWindowClass(toggleSwitch) {
                var modalWindow;

                if (openedWindows.length() > 0) {
                    modalWindow = openedWindows.top().value;
                    modalWindow.modalDomEl.toggleClass(modalWindow.windowTopClass || '', toggleSwitch);
                }
            }

            function checkRemoveBackdrop() {
                //remove backdrop if no longer needed
                if (backdropDomEl && backdropIndex() === -1) {
                    var backdropScopeRef = backdropScope;
                    removeAfterAnimate(backdropDomEl, backdropScope, function() {
                        backdropScopeRef = null;
                    });
                    backdropDomEl = undefined;
                    backdropScope = undefined;
                }
            }

            function removeAfterAnimate(domEl, scope, done, closedDeferred) {
                var asyncDeferred;
                var asyncPromise = null;
                var setIsAsync = function() {
                    if (!asyncDeferred) {
                        asyncDeferred = $q.defer();
                        asyncPromise = asyncDeferred.promise;
                    }

                    return function asyncDone() {
                        asyncDeferred.resolve();
                    };
                };
                scope.$broadcast($modalStack.NOW_CLOSING_EVENT, setIsAsync);

                // Note that it's intentional that asyncPromise might be null.
                // That's when setIsAsync has not been called during the
                // NOW_CLOSING_EVENT broadcast.
                return $q.when(asyncPromise).then(afterAnimating);

                function afterAnimating() {
                    if (afterAnimating.done) {
                        return;
                    }
                    afterAnimating.done = true;

                    $animate.leave(domEl).then(function() {
                        if (done) {
                            done();
                        }

                        domEl.remove();
                        if (closedDeferred) {
                            closedDeferred.resolve();
                        }
                    });

                    scope.$destroy();
                }
            }

            $document.on('keydown', keydownListener);

            $rootScope.$on('$destroy', function() {
                $document.off('keydown', keydownListener);
            });

            function keydownListener(evt) {
                if (evt.isDefaultPrevented()) {
                    return evt;
                }

                var modal = openedWindows.top();
                if (modal) {
                    switch (evt.which) {
                        case 27: {
                            if (modal.value.keyboard) {
                                evt.preventDefault();
                                $rootScope.$apply(function() {
                                    $modalStack.dismiss(modal.key, 'escape key press');
                                });
                            }
                            break;
                        }
                        case 9: {
                            var list = $modalStack.loadFocusElementList(modal);
                            var focusChanged = false;
                            if (evt.shiftKey) {
                                if ($modalStack.isFocusInFirstItem(evt, list) || $modalStack.isModalFocused(evt, modal)) {
                                    focusChanged = $modalStack.focusLastFocusableElement(list);
                                }
                            } else {
                                if ($modalStack.isFocusInLastItem(evt, list)) {
                                    focusChanged = $modalStack.focusFirstFocusableElement(list);
                                }
                            }

                            if (focusChanged) {
                                evt.preventDefault();
                                evt.stopPropagation();
                            }

                            break;
                        }
                    }
                }
            }

            $modalStack.open = function(modalInstance, modal) {
                var modalOpener = $document[0].activeElement,
                    modalBodyClass = modal.openedClass || OPENED_MODAL_CLASS;

                toggleTopWindowClass(false);

                // Store the current top first, to determine what index we ought to use
                // for the current top modal
                previousTopOpenedModal = openedWindows.top();

                openedWindows.add(modalInstance, {
                    deferred: modal.deferred,
                    renderDeferred: modal.renderDeferred,
                    closedDeferred: modal.closedDeferred,
                    modalScope: modal.scope,
                    backdrop: modal.backdrop,
                    keyboard: modal.keyboard,
                    openedClass: modal.openedClass,
                    windowTopClass: modal.windowTopClass,
                    animation: modal.animation,
                    appendTo: modal.appendTo
                });

                openedClasses.put(modalBodyClass, modalInstance);

                var appendToElement = modal.appendTo,
                    currBackdropIndex = backdropIndex();

                if (currBackdropIndex >= 0 && !backdropDomEl) {
                    backdropScope = $rootScope.$new(true);
                    backdropScope.modalOptions = modal;
                    backdropScope.index = currBackdropIndex;
                    backdropDomEl = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>');
                    backdropDomEl.attr({
                        'class': 'modal-backdrop',
                        'ng-style': '{\'z-index\': 1040 + (index && 1 || 0) + index*10}',
                        'uib-modal-animation-class': 'fade',
                        'modal-in-class': 'in'
                    });
                    if (modal.backdropClass) {
                        backdropDomEl.addClass(modal.backdropClass);
                    }

                    if (modal.animation) {
                        backdropDomEl.attr('modal-animation', 'true');
                    }
                    $compile(backdropDomEl)(backdropScope);
                    $animate.enter(backdropDomEl, appendToElement);
                    if ($uibPosition.isScrollable(appendToElement)) {
                        scrollbarPadding = $uibPosition.scrollbarPadding(appendToElement);
                        if (scrollbarPadding.heightOverflow && scrollbarPadding.scrollbarWidth) {
                            appendToElement.css({paddingRight: scrollbarPadding.right + 'px'});
                        }
                    }
                }

                var content;
                if (modal.component) {
                    content = document.createElement(snake_case(modal.component.name));
                    content = angular.element(content);
                    content.attr({
                        resolve: '$resolve',
                        'modal-instance': '$uibModalInstance',
                        close: '$close($value)',
                        dismiss: '$dismiss($value)'
                    });
                } else {
                    content = modal.content;
                }

                // Set the top modal index based on the index of the previous top modal
                topModalIndex = previousTopOpenedModal ? parseInt(previousTopOpenedModal.value.modalDomEl.attr('index'), 10) + 1 : 0;
                var angularDomEl = angular.element('<div uib-modal-window="modal-window"></div>');
                angularDomEl.attr({
                    'class': 'modal',
                    'template-url': modal.windowTemplateUrl,
                    'window-top-class': modal.windowTopClass,
                    'role': 'dialog',
                    'aria-labelledby': modal.ariaLabelledBy,
                    'aria-describedby': modal.ariaDescribedBy,
                    'size': modal.size,
                    'index': topModalIndex,
                    'animate': 'animate',
                    'ng-style': '{\'z-index\': 1050 + $$topModalIndex*10, display: \'block\'}',
                    'tabindex': -1,
                    'uib-modal-animation-class': 'fade',
                    'modal-in-class': 'in'
                }).append(content);
                if (modal.windowClass) {
                    angularDomEl.addClass(modal.windowClass);
                }

                if (modal.animation) {
                    angularDomEl.attr('modal-animation', 'true');
                }

                appendToElement.addClass(modalBodyClass);
                if (modal.scope) {
                    // we need to explicitly add the modal index to the modal scope
                    // because it is needed by ngStyle to compute the zIndex property.
                    modal.scope.$$topModalIndex = topModalIndex;
                }
                $animate.enter($compile(angularDomEl)(modal.scope), appendToElement);

                openedWindows.top().value.modalDomEl = angularDomEl;
                openedWindows.top().value.modalOpener = modalOpener;

                applyAriaHidden(angularDomEl);

                function applyAriaHidden(el) {
                    if (!el || el[0].tagName === 'BODY') {
                        return;
                    }

                    getSiblings(el).forEach(function(sibling) {
                        var elemIsAlreadyHidden = sibling.getAttribute('aria-hidden') === 'true',
                            ariaHiddenCount = parseInt(sibling.getAttribute(ARIA_HIDDEN_ATTRIBUTE_NAME), 10);

                        if (!ariaHiddenCount) {
                            ariaHiddenCount = elemIsAlreadyHidden ? 1 : 0;
                        }

                        sibling.setAttribute(ARIA_HIDDEN_ATTRIBUTE_NAME, ariaHiddenCount + 1);
                        sibling.setAttribute('aria-hidden', 'true');
                    });

                    return applyAriaHidden(el.parent());

                    function getSiblings(el) {
                        var children = el.parent() ? el.parent().children() : [];

                        return Array.prototype.filter.call(children, function(child) {
                            return child !== el[0];
                        });
                    }
                }
            };

            function broadcastClosing(modalWindow, resultOrReason, closing) {
                return !modalWindow.value.modalScope.$broadcast('modal.closing', resultOrReason, closing).defaultPrevented;
            }

            function unhideBackgroundElements() {
                Array.prototype.forEach.call(
                    document.querySelectorAll('[' + ARIA_HIDDEN_ATTRIBUTE_NAME + ']'),
                    function(hiddenEl) {
                        var ariaHiddenCount = parseInt(hiddenEl.getAttribute(ARIA_HIDDEN_ATTRIBUTE_NAME), 10),
                            newHiddenCount = ariaHiddenCount - 1;
                        hiddenEl.setAttribute(ARIA_HIDDEN_ATTRIBUTE_NAME, newHiddenCount);

                        if (!newHiddenCount) {
                            hiddenEl.removeAttribute(ARIA_HIDDEN_ATTRIBUTE_NAME);
                            hiddenEl.removeAttribute('aria-hidden');
                        }
                    }
                );
            }

            $modalStack.close = function(modalInstance, result) {
                var modalWindow = openedWindows.get(modalInstance);
                unhideBackgroundElements();
                if (modalWindow && broadcastClosing(modalWindow, result, true)) {
                    modalWindow.value.modalScope.$$uibDestructionScheduled = true;
                    modalWindow.value.deferred.resolve(result);
                    removeModalWindow(modalInstance, modalWindow.value.modalOpener);
                    return true;
                }

                return !modalWindow;
            };

            $modalStack.dismiss = function(modalInstance, reason) {
                var modalWindow = openedWindows.get(modalInstance);
                unhideBackgroundElements();
                if (modalWindow && broadcastClosing(modalWindow, reason, false)) {
                    modalWindow.value.modalScope.$$uibDestructionScheduled = true;
                    modalWindow.value.deferred.reject(reason);
                    removeModalWindow(modalInstance, modalWindow.value.modalOpener);
                    return true;
                }
                return !modalWindow;
            };

            $modalStack.dismissAll = function(reason) {
                var topModal = this.getTop();
                while (topModal && this.dismiss(topModal.key, reason)) {
                    topModal = this.getTop();
                }
            };

            $modalStack.getTop = function() {
                return openedWindows.top();
            };

            $modalStack.modalRendered = function(modalInstance) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow) {
                    modalWindow.value.renderDeferred.resolve();
                }
            };

            $modalStack.focusFirstFocusableElement = function(list) {
                if (list.length > 0) {
                    list[0].focus();
                    return true;
                }
                return false;
            };

            $modalStack.focusLastFocusableElement = function(list) {
                if (list.length > 0) {
                    list[list.length - 1].focus();
                    return true;
                }
                return false;
            };

            $modalStack.isModalFocused = function(evt, modalWindow) {
                if (evt && modalWindow) {
                    var modalDomEl = modalWindow.value.modalDomEl;
                    if (modalDomEl && modalDomEl.length) {
                        return (evt.target || evt.srcElement) === modalDomEl[0];
                    }
                }
                return false;
            };

            $modalStack.isFocusInFirstItem = function(evt, list) {
                if (list.length > 0) {
                    return (evt.target || evt.srcElement) === list[0];
                }
                return false;
            };

            $modalStack.isFocusInLastItem = function(evt, list) {
                if (list.length > 0) {
                    return (evt.target || evt.srcElement) === list[list.length - 1];
                }
                return false;
            };

            $modalStack.loadFocusElementList = function(modalWindow) {
                if (modalWindow) {
                    var modalDomE1 = modalWindow.value.modalDomEl;
                    if (modalDomE1 && modalDomE1.length) {
                        var elements = modalDomE1[0].querySelectorAll(tabbableSelector);
                        return elements ?
                            Array.prototype.filter.call(elements, function(element) {
                                return isVisible(element);
                            }) : elements;
                    }
                }
            };

            return $modalStack;
        }])

    .provider('$uibModal', function() {
        var $modalProvider = {
            options: {
                animation: true,
                backdrop: true, //can also be false or 'static'
                keyboard: true
            },
            $get: ['$rootScope', '$q', '$document', '$templateRequest', '$controller', '$uibResolve', '$uibModalStack',
                function ($rootScope, $q, $document, $templateRequest, $controller, $uibResolve, $modalStack) {
                    var $modal = {};

                    function getTemplatePromise(options) {
                        return options.template ? $q.when(options.template) :
                            $templateRequest(angular.isFunction(options.templateUrl) ?
                                options.templateUrl() : options.templateUrl);
                    }

                    var promiseChain = null;
                    $modal.getPromiseChain = function() {
                        return promiseChain;
                    };

                    $modal.open = function(modalOptions) {
                        var modalResultDeferred = $q.defer();
                        var modalOpenedDeferred = $q.defer();
                        var modalClosedDeferred = $q.defer();
                        var modalRenderDeferred = $q.defer();

                        //prepare an instance of a modal to be injected into controllers and returned to a caller
                        var modalInstance = {
                            result: modalResultDeferred.promise,
                            opened: modalOpenedDeferred.promise,
                            closed: modalClosedDeferred.promise,
                            rendered: modalRenderDeferred.promise,
                            close: function (result) {
                                return $modalStack.close(modalInstance, result);
                            },
                            dismiss: function (reason) {
                                return $modalStack.dismiss(modalInstance, reason);
                            }
                        };

                        //merge and clean up options
                        modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
                        modalOptions.resolve = modalOptions.resolve || {};
                        modalOptions.appendTo = modalOptions.appendTo || $document.find('body').eq(0);

                        if (!modalOptions.appendTo.length) {
                            throw new Error('appendTo element not found. Make sure that the element passed is in DOM.');
                        }

                        //verify options
                        if (!modalOptions.component && !modalOptions.template && !modalOptions.templateUrl) {
                            throw new Error('One of component or template or templateUrl options is required.');
                        }

                        var templateAndResolvePromise;
                        if (modalOptions.component) {
                            templateAndResolvePromise = $q.when($uibResolve.resolve(modalOptions.resolve, {}, null, null));
                        } else {
                            templateAndResolvePromise =
                                $q.all([getTemplatePromise(modalOptions), $uibResolve.resolve(modalOptions.resolve, {}, null, null)]);
                        }

                        function resolveWithTemplate() {
                            return templateAndResolvePromise;
                        }

                        // Wait for the resolution of the existing promise chain.
                        // Then switch to our own combined promise dependency (regardless of how the previous modal fared).
                        // Then add to $modalStack and resolve opened.
                        // Finally clean up the chain variable if no subsequent modal has overwritten it.
                        var samePromise;
                        samePromise = promiseChain = $q.all([promiseChain])
                            .then(resolveWithTemplate, resolveWithTemplate)
                            .then(function resolveSuccess(tplAndVars) {
                                var providedScope = modalOptions.scope || $rootScope;

                                var modalScope = providedScope.$new();
                                modalScope.$close = modalInstance.close;
                                modalScope.$dismiss = modalInstance.dismiss;

                                modalScope.$on('$destroy', function() {
                                    if (!modalScope.$$uibDestructionScheduled) {
                                        modalScope.$dismiss('$uibUnscheduledDestruction');
                                    }
                                });

                                var modal = {
                                    scope: modalScope,
                                    deferred: modalResultDeferred,
                                    renderDeferred: modalRenderDeferred,
                                    closedDeferred: modalClosedDeferred,
                                    animation: modalOptions.animation,
                                    backdrop: modalOptions.backdrop,
                                    keyboard: modalOptions.keyboard,
                                    backdropClass: modalOptions.backdropClass,
                                    windowTopClass: modalOptions.windowTopClass,
                                    windowClass: modalOptions.windowClass,
                                    windowTemplateUrl: modalOptions.windowTemplateUrl,
                                    ariaLabelledBy: modalOptions.ariaLabelledBy,
                                    ariaDescribedBy: modalOptions.ariaDescribedBy,
                                    size: modalOptions.size,
                                    openedClass: modalOptions.openedClass,
                                    appendTo: modalOptions.appendTo
                                };

                                var component = {};
                                var ctrlInstance, ctrlInstantiate, ctrlLocals = {};

                                if (modalOptions.component) {
                                    constructLocals(component, false, true, false);
                                    component.name = modalOptions.component;
                                    modal.component = component;
                                } else if (modalOptions.controller) {
                                    constructLocals(ctrlLocals, true, false, true);

                                    // the third param will make the controller instantiate later,private api
                                    // @see https://github.com/angular/angular.js/blob/master/src/ng/controller.js#L126
                                    ctrlInstantiate = $controller(modalOptions.controller, ctrlLocals, true, modalOptions.controllerAs);
                                    if (modalOptions.controllerAs && modalOptions.bindToController) {
                                        ctrlInstance = ctrlInstantiate.instance;
                                        ctrlInstance.$close = modalScope.$close;
                                        ctrlInstance.$dismiss = modalScope.$dismiss;
                                        angular.extend(ctrlInstance, {
                                            $resolve: ctrlLocals.$scope.$resolve
                                        }, providedScope);
                                    }

                                    ctrlInstance = ctrlInstantiate();

                                    if (angular.isFunction(ctrlInstance.$onInit)) {
                                        ctrlInstance.$onInit();
                                    }
                                }

                                if (!modalOptions.component) {
                                    modal.content = tplAndVars[0];
                                }

                                $modalStack.open(modalInstance, modal);
                                modalOpenedDeferred.resolve(true);

                                function constructLocals(obj, template, instanceOnScope, injectable) {
                                    obj.$scope = modalScope;
                                    obj.$scope.$resolve = {};
                                    if (instanceOnScope) {
                                        obj.$scope.$uibModalInstance = modalInstance;
                                    } else {
                                        obj.$uibModalInstance = modalInstance;
                                    }

                                    var resolves = template ? tplAndVars[1] : tplAndVars;
                                    angular.forEach(resolves, function(value, key) {
                                        if (injectable) {
                                            obj[key] = value;
                                        }

                                        obj.$scope.$resolve[key] = value;
                                    });
                                }
                            }, function resolveError(reason) {
                                modalOpenedDeferred.reject(reason);
                                modalResultDeferred.reject(reason);
                            })['finally'](function() {
                            if (promiseChain === samePromise) {
                                promiseChain = null;
                            }
                        });

                        return modalInstance;
                    };

                    return $modal;
                }
            ]
        };

        return $modalProvider;
    });

angular.module('ui.bootstrap.multiMap', [])
/**
 * A helper, internal data structure that stores all references attached to key
 */
    .factory('$$multiMap', function() {
        return {
            createNew: function() {
                var map = {};

                return {
                    entries: function() {
                        return Object.keys(map).map(function(key) {
                            return {
                                key: key,
                                value: map[key]
                            };
                        });
                    },
                    get: function(key) {
                        return map[key];
                    },
                    hasKey: function(key) {
                        return !!map[key];
                    },
                    keys: function() {
                        return Object.keys(map);
                    },
                    put: function(key, value) {
                        if (!map[key]) {
                            map[key] = [];
                        }

                        map[key].push(value);
                    },
                    remove: function(key, value) {
                        var values = map[key];

                        if (!values) {
                            return;
                        }

                        var idx = values.indexOf(value);

                        if (idx !== -1) {
                            values.splice(idx, 1);
                        }

                        if (!values.length) {
                            delete map[key];
                        }
                    }
                };
            }
        };
    });

angular.module('ui.bootstrap.stackedMap', [])
/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
    .factory('$$stackedMap', function() {
        return {
            createNew: function() {
                var stack = [];

                return {
                    add: function(key, value) {
                        stack.push({
                            key: key,
                            value: value
                        });
                    },
                    get: function(key) {
                        for (var i = 0; i < stack.length; i++) {
                            if (key === stack[i].key) {
                                return stack[i];
                            }
                        }
                    },
                    keys: function() {
                        var keys = [];
                        for (var i = 0; i < stack.length; i++) {
                            keys.push(stack[i].key);
                        }
                        return keys;
                    },
                    top: function() {
                        return stack[stack.length - 1];
                    },
                    remove: function(key) {
                        var idx = -1;
                        for (var i = 0; i < stack.length; i++) {
                            if (key === stack[i].key) {
                                idx = i;
                                break;
                            }
                        }
                        return stack.splice(idx, 1)[0];
                    },
                    removeTop: function() {
                        return stack.pop();
                    },
                    length: function() {
                        return stack.length;
                    }
                };
            }
        };
    });
angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods for working with the DOM.
 * It is meant to be used where we need to absolute-position elements in
 * relation to another element (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
    .factory('$uibPosition', ['$document', '$window', function($document, $window) {
        /**
         * Used by scrollbarWidth() function to cache scrollbar's width.
         * Do not access this variable directly, use scrollbarWidth() instead.
         */
        var SCROLLBAR_WIDTH;
        /**
         * scrollbar on body and html element in IE and Edge overlay
         * content and should be considered 0 width.
         */
        var BODY_SCROLLBAR_WIDTH;
        var OVERFLOW_REGEX = {
            normal: /(auto|scroll)/,
            hidden: /(auto|scroll|hidden)/
        };
        var PLACEMENT_REGEX = {
            auto: /\s?auto?\s?/i,
            primary: /^(top|bottom|left|right)$/,
            secondary: /^(top|bottom|left|right|center)$/,
            vertical: /^(top|bottom)$/
        };
        var BODY_REGEX = /(HTML|BODY)/;

        return {

            /**
             * Provides a raw DOM element from a jQuery/jQLite element.
             *
             * @param {element} elem - The element to convert.
             *
             * @returns {element} A HTML element.
             */
            getRawNode: function(elem) {
                return elem.nodeName ? elem : elem[0] || elem;
            },

            /**
             * Provides a parsed number for a style property.  Strips
             * units and casts invalid numbers to 0.
             *
             * @param {string} value - The style value to parse.
             *
             * @returns {number} A valid number.
             */
            parseStyle: function(value) {
                value = parseFloat(value);
                return isFinite(value) ? value : 0;
            },

            /**
             * Provides the closest positioned ancestor.
             *
             * @param {element} element - The element to get the offest parent for.
             *
             * @returns {element} The closest positioned ancestor.
             */
            offsetParent: function(elem) {
                elem = this.getRawNode(elem);

                var offsetParent = elem.offsetParent || $document[0].documentElement;

                function isStaticPositioned(el) {
                    return ($window.getComputedStyle(el).position || 'static') === 'static';
                }

                while (offsetParent && offsetParent !== $document[0].documentElement && isStaticPositioned(offsetParent)) {
                    offsetParent = offsetParent.offsetParent;
                }

                return offsetParent || $document[0].documentElement;
            },

            /**
             * Provides the scrollbar width, concept from TWBS measureScrollbar()
             * function in https://github.com/twbs/bootstrap/blob/master/js/modal.js
             * In IE and Edge, scollbar on body and html element overlay and should
             * return a width of 0.
             *
             * @returns {number} The width of the browser scollbar.
             */
            scrollbarWidth: function(isBody) {
                if (isBody) {
                    if (angular.isUndefined(BODY_SCROLLBAR_WIDTH)) {
                        var bodyElem = $document.find('body');
                        bodyElem.addClass('uib-position-body-scrollbar-measure');
                        BODY_SCROLLBAR_WIDTH = $window.innerWidth - bodyElem[0].clientWidth;
                        BODY_SCROLLBAR_WIDTH = isFinite(BODY_SCROLLBAR_WIDTH) ? BODY_SCROLLBAR_WIDTH : 0;
                        bodyElem.removeClass('uib-position-body-scrollbar-measure');
                    }
                    return BODY_SCROLLBAR_WIDTH;
                }

                if (angular.isUndefined(SCROLLBAR_WIDTH)) {
                    var scrollElem = angular.element('<div class="uib-position-scrollbar-measure"></div>');
                    $document.find('body').append(scrollElem);
                    SCROLLBAR_WIDTH = scrollElem[0].offsetWidth - scrollElem[0].clientWidth;
                    SCROLLBAR_WIDTH = isFinite(SCROLLBAR_WIDTH) ? SCROLLBAR_WIDTH : 0;
                    scrollElem.remove();
                }

                return SCROLLBAR_WIDTH;
            },

            /**
             * Provides the padding required on an element to replace the scrollbar.
             *
             * @returns {object} An object with the following properties:
             *   <ul>
             *     <li>**scrollbarWidth**: the width of the scrollbar</li>
             *     <li>**widthOverflow**: whether the the width is overflowing</li>
             *     <li>**right**: the amount of right padding on the element needed to replace the scrollbar</li>
             *     <li>**rightOriginal**: the amount of right padding currently on the element</li>
             *     <li>**heightOverflow**: whether the the height is overflowing</li>
             *     <li>**bottom**: the amount of bottom padding on the element needed to replace the scrollbar</li>
             *     <li>**bottomOriginal**: the amount of bottom padding currently on the element</li>
             *   </ul>
             */
            scrollbarPadding: function(elem) {
                elem = this.getRawNode(elem);

                var elemStyle = $window.getComputedStyle(elem);
                var paddingRight = this.parseStyle(elemStyle.paddingRight);
                var paddingBottom = this.parseStyle(elemStyle.paddingBottom);
                var scrollParent = this.scrollParent(elem, false, true);
                var scrollbarWidth = this.scrollbarWidth(BODY_REGEX.test(scrollParent.tagName));

                return {
                    scrollbarWidth: scrollbarWidth,
                    widthOverflow: scrollParent.scrollWidth > scrollParent.clientWidth,
                    right: paddingRight + scrollbarWidth,
                    originalRight: paddingRight,
                    heightOverflow: scrollParent.scrollHeight > scrollParent.clientHeight,
                    bottom: paddingBottom + scrollbarWidth,
                    originalBottom: paddingBottom
                };
            },

            /**
             * Checks to see if the element is scrollable.
             *
             * @param {element} elem - The element to check.
             * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
             *   default is false.
             *
             * @returns {boolean} Whether the element is scrollable.
             */
            isScrollable: function(elem, includeHidden) {
                elem = this.getRawNode(elem);

                var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
                var elemStyle = $window.getComputedStyle(elem);
                return overflowRegex.test(elemStyle.overflow + elemStyle.overflowY + elemStyle.overflowX);
            },

            /**
             * Provides the closest scrollable ancestor.
             * A port of the jQuery UI scrollParent method:
             * https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
             *
             * @param {element} elem - The element to find the scroll parent of.
             * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
             *   default is false.
             * @param {boolean=} [includeSelf=false] - Should the element being passed be
             * included in the scrollable llokup.
             *
             * @returns {element} A HTML element.
             */
            scrollParent: function(elem, includeHidden, includeSelf) {
                elem = this.getRawNode(elem);

                var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
                var documentEl = $document[0].documentElement;
                var elemStyle = $window.getComputedStyle(elem);
                if (includeSelf && overflowRegex.test(elemStyle.overflow + elemStyle.overflowY + elemStyle.overflowX)) {
                    return elem;
                }
                var excludeStatic = elemStyle.position === 'absolute';
                var scrollParent = elem.parentElement || documentEl;

                if (scrollParent === documentEl || elemStyle.position === 'fixed') {
                    return documentEl;
                }

                while (scrollParent.parentElement && scrollParent !== documentEl) {
                    var spStyle = $window.getComputedStyle(scrollParent);
                    if (excludeStatic && spStyle.position !== 'static') {
                        excludeStatic = false;
                    }

                    if (!excludeStatic && overflowRegex.test(spStyle.overflow + spStyle.overflowY + spStyle.overflowX)) {
                        break;
                    }
                    scrollParent = scrollParent.parentElement;
                }

                return scrollParent;
            },

            /**
             * Provides read-only equivalent of jQuery's position function:
             * http://api.jquery.com/position/ - distance to closest positioned
             * ancestor.  Does not account for margins by default like jQuery position.
             *
             * @param {element} elem - The element to caclulate the position on.
             * @param {boolean=} [includeMargins=false] - Should margins be accounted
             * for, default is false.
             *
             * @returns {object} An object with the following properties:
             *   <ul>
             *     <li>**width**: the width of the element</li>
             *     <li>**height**: the height of the element</li>
             *     <li>**top**: distance to top edge of offset parent</li>
             *     <li>**left**: distance to left edge of offset parent</li>
             *   </ul>
             */
            position: function(elem, includeMagins) {
                elem = this.getRawNode(elem);

                var elemOffset = this.offset(elem);
                if (includeMagins) {
                    var elemStyle = $window.getComputedStyle(elem);
                    elemOffset.top -= this.parseStyle(elemStyle.marginTop);
                    elemOffset.left -= this.parseStyle(elemStyle.marginLeft);
                }
                var parent = this.offsetParent(elem);
                var parentOffset = {top: 0, left: 0};

                if (parent !== $document[0].documentElement) {
                    parentOffset = this.offset(parent);
                    parentOffset.top += parent.clientTop - parent.scrollTop;
                    parentOffset.left += parent.clientLeft - parent.scrollLeft;
                }

                return {
                    width: Math.round(angular.isNumber(elemOffset.width) ? elemOffset.width : elem.offsetWidth),
                    height: Math.round(angular.isNumber(elemOffset.height) ? elemOffset.height : elem.offsetHeight),
                    top: Math.round(elemOffset.top - parentOffset.top),
                    left: Math.round(elemOffset.left - parentOffset.left)
                };
            },

            /**
             * Provides read-only equivalent of jQuery's offset function:
             * http://api.jquery.com/offset/ - distance to viewport.  Does
             * not account for borders, margins, or padding on the body
             * element.
             *
             * @param {element} elem - The element to calculate the offset on.
             *
             * @returns {object} An object with the following properties:
             *   <ul>
             *     <li>**width**: the width of the element</li>
             *     <li>**height**: the height of the element</li>
             *     <li>**top**: distance to top edge of viewport</li>
             *     <li>**right**: distance to bottom edge of viewport</li>
             *   </ul>
             */
            offset: function(elem) {
                elem = this.getRawNode(elem);

                var elemBCR = elem.getBoundingClientRect();
                return {
                    width: Math.round(angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
                    height: Math.round(angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
                    top: Math.round(elemBCR.top + ($window.pageYOffset || $document[0].documentElement.scrollTop)),
                    left: Math.round(elemBCR.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft))
                };
            },

            /**
             * Provides offset distance to the closest scrollable ancestor
             * or viewport.  Accounts for border and scrollbar width.
             *
             * Right and bottom dimensions represent the distance to the
             * respective edge of the viewport element.  If the element
             * edge extends beyond the viewport, a negative value will be
             * reported.
             *
             * @param {element} elem - The element to get the viewport offset for.
             * @param {boolean=} [useDocument=false] - Should the viewport be the document element instead
             * of the first scrollable element, default is false.
             * @param {boolean=} [includePadding=true] - Should the padding on the offset parent element
             * be accounted for, default is true.
             *
             * @returns {object} An object with the following properties:
             *   <ul>
             *     <li>**top**: distance to the top content edge of viewport element</li>
             *     <li>**bottom**: distance to the bottom content edge of viewport element</li>
             *     <li>**left**: distance to the left content edge of viewport element</li>
             *     <li>**right**: distance to the right content edge of viewport element</li>
             *   </ul>
             */
            viewportOffset: function(elem, useDocument, includePadding) {
                elem = this.getRawNode(elem);
                includePadding = includePadding !== false ? true : false;

                var elemBCR = elem.getBoundingClientRect();
                var offsetBCR = {top: 0, left: 0, bottom: 0, right: 0};

                var offsetParent = useDocument ? $document[0].documentElement : this.scrollParent(elem);
                var offsetParentBCR = offsetParent.getBoundingClientRect();

                offsetBCR.top = offsetParentBCR.top + offsetParent.clientTop;
                offsetBCR.left = offsetParentBCR.left + offsetParent.clientLeft;
                if (offsetParent === $document[0].documentElement) {
                    offsetBCR.top += $window.pageYOffset;
                    offsetBCR.left += $window.pageXOffset;
                }
                offsetBCR.bottom = offsetBCR.top + offsetParent.clientHeight;
                offsetBCR.right = offsetBCR.left + offsetParent.clientWidth;

                if (includePadding) {
                    var offsetParentStyle = $window.getComputedStyle(offsetParent);
                    offsetBCR.top += this.parseStyle(offsetParentStyle.paddingTop);
                    offsetBCR.bottom -= this.parseStyle(offsetParentStyle.paddingBottom);
                    offsetBCR.left += this.parseStyle(offsetParentStyle.paddingLeft);
                    offsetBCR.right -= this.parseStyle(offsetParentStyle.paddingRight);
                }

                return {
                    top: Math.round(elemBCR.top - offsetBCR.top),
                    bottom: Math.round(offsetBCR.bottom - elemBCR.bottom),
                    left: Math.round(elemBCR.left - offsetBCR.left),
                    right: Math.round(offsetBCR.right - elemBCR.right)
                };
            },

            /**
             * Provides an array of placement values parsed from a placement string.
             * Along with the 'auto' indicator, supported placement strings are:
             *   <ul>
             *     <li>top: element on top, horizontally centered on host element.</li>
             *     <li>top-left: element on top, left edge aligned with host element left edge.</li>
             *     <li>top-right: element on top, lerightft edge aligned with host element right edge.</li>
             *     <li>bottom: element on bottom, horizontally centered on host element.</li>
             *     <li>bottom-left: element on bottom, left edge aligned with host element left edge.</li>
             *     <li>bottom-right: element on bottom, right edge aligned with host element right edge.</li>
             *     <li>left: element on left, vertically centered on host element.</li>
             *     <li>left-top: element on left, top edge aligned with host element top edge.</li>
             *     <li>left-bottom: element on left, bottom edge aligned with host element bottom edge.</li>
             *     <li>right: element on right, vertically centered on host element.</li>
             *     <li>right-top: element on right, top edge aligned with host element top edge.</li>
             *     <li>right-bottom: element on right, bottom edge aligned with host element bottom edge.</li>
             *   </ul>
             * A placement string with an 'auto' indicator is expected to be
             * space separated from the placement, i.e: 'auto bottom-left'  If
             * the primary and secondary placement values do not match 'top,
             * bottom, left, right' then 'top' will be the primary placement and
             * 'center' will be the secondary placement.  If 'auto' is passed, true
             * will be returned as the 3rd value of the array.
             *
             * @param {string} placement - The placement string to parse.
             *
             * @returns {array} An array with the following values
             * <ul>
             *   <li>**[0]**: The primary placement.</li>
             *   <li>**[1]**: The secondary placement.</li>
             *   <li>**[2]**: If auto is passed: true, else undefined.</li>
             * </ul>
             */
            parsePlacement: function(placement) {
                var autoPlace = PLACEMENT_REGEX.auto.test(placement);
                if (autoPlace) {
                    placement = placement.replace(PLACEMENT_REGEX.auto, '');
                }

                placement = placement.split('-');

                placement[0] = placement[0] || 'top';
                if (!PLACEMENT_REGEX.primary.test(placement[0])) {
                    placement[0] = 'top';
                }

                placement[1] = placement[1] || 'center';
                if (!PLACEMENT_REGEX.secondary.test(placement[1])) {
                    placement[1] = 'center';
                }

                if (autoPlace) {
                    placement[2] = true;
                } else {
                    placement[2] = false;
                }

                return placement;
            },

            /**
             * Provides coordinates for an element to be positioned relative to
             * another element.  Passing 'auto' as part of the placement parameter
             * will enable smart placement - where the element fits. i.e:
             * 'auto left-top' will check to see if there is enough space to the left
             * of the hostElem to fit the targetElem, if not place right (same for secondary
             * top placement).  Available space is calculated using the viewportOffset
             * function.
             *
             * @param {element} hostElem - The element to position against.
             * @param {element} targetElem - The element to position.
             * @param {string=} [placement=top] - The placement for the targetElem,
             *   default is 'top'. 'center' is assumed as secondary placement for
             *   'top', 'left', 'right', and 'bottom' placements.  Available placements are:
             *   <ul>
             *     <li>top</li>
             *     <li>top-right</li>
             *     <li>top-left</li>
             *     <li>bottom</li>
             *     <li>bottom-left</li>
             *     <li>bottom-right</li>
             *     <li>left</li>
             *     <li>left-top</li>
             *     <li>left-bottom</li>
             *     <li>right</li>
             *     <li>right-top</li>
             *     <li>right-bottom</li>
             *   </ul>
             * @param {boolean=} [appendToBody=false] - Should the top and left values returned
             *   be calculated from the body element, default is false.
             *
             * @returns {object} An object with the following properties:
             *   <ul>
             *     <li>**top**: Value for targetElem top.</li>
             *     <li>**left**: Value for targetElem left.</li>
             *     <li>**placement**: The resolved placement.</li>
             *   </ul>
             */
            positionElements: function(hostElem, targetElem, placement, appendToBody) {
                hostElem = this.getRawNode(hostElem);
                targetElem = this.getRawNode(targetElem);

                // need to read from prop to support tests.
                var targetWidth = angular.isDefined(targetElem.offsetWidth) ? targetElem.offsetWidth : targetElem.prop('offsetWidth');
                var targetHeight = angular.isDefined(targetElem.offsetHeight) ? targetElem.offsetHeight : targetElem.prop('offsetHeight');

                placement = this.parsePlacement(placement);

                var hostElemPos = appendToBody ? this.offset(hostElem) : this.position(hostElem);
                var targetElemPos = {top: 0, left: 0, placement: ''};

                if (placement[2]) {
                    var viewportOffset = this.viewportOffset(hostElem, appendToBody);

                    var targetElemStyle = $window.getComputedStyle(targetElem);
                    var adjustedSize = {
                        width: targetWidth + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginLeft) + this.parseStyle(targetElemStyle.marginRight))),
                        height: targetHeight + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginTop) + this.parseStyle(targetElemStyle.marginBottom)))
                    };

                    placement[0] = placement[0] === 'top' && adjustedSize.height > viewportOffset.top && adjustedSize.height <= viewportOffset.bottom ? 'bottom' :
                        placement[0] === 'bottom' && adjustedSize.height > viewportOffset.bottom && adjustedSize.height <= viewportOffset.top ? 'top' :
                            placement[0] === 'left' && adjustedSize.width > viewportOffset.left && adjustedSize.width <= viewportOffset.right ? 'right' :
                                placement[0] === 'right' && adjustedSize.width > viewportOffset.right && adjustedSize.width <= viewportOffset.left ? 'left' :
                                    placement[0];

                    placement[1] = placement[1] === 'top' && adjustedSize.height - hostElemPos.height > viewportOffset.bottom && adjustedSize.height - hostElemPos.height <= viewportOffset.top ? 'bottom' :
                        placement[1] === 'bottom' && adjustedSize.height - hostElemPos.height > viewportOffset.top && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom ? 'top' :
                            placement[1] === 'left' && adjustedSize.width - hostElemPos.width > viewportOffset.right && adjustedSize.width - hostElemPos.width <= viewportOffset.left ? 'right' :
                                placement[1] === 'right' && adjustedSize.width - hostElemPos.width > viewportOffset.left && adjustedSize.width - hostElemPos.width <= viewportOffset.right ? 'left' :
                                    placement[1];

                    if (placement[1] === 'center') {
                        if (PLACEMENT_REGEX.vertical.test(placement[0])) {
                            var xOverflow = hostElemPos.width / 2 - targetWidth / 2;
                            if (viewportOffset.left + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.right) {
                                placement[1] = 'left';
                            } else if (viewportOffset.right + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.left) {
                                placement[1] = 'right';
                            }
                        } else {
                            var yOverflow = hostElemPos.height / 2 - adjustedSize.height / 2;
                            if (viewportOffset.top + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom) {
                                placement[1] = 'top';
                            } else if (viewportOffset.bottom + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.top) {
                                placement[1] = 'bottom';
                            }
                        }
                    }
                }

                switch (placement[0]) {
                    case 'top':
                        targetElemPos.top = hostElemPos.top - targetHeight;
                        break;
                    case 'bottom':
                        targetElemPos.top = hostElemPos.top + hostElemPos.height;
                        break;
                    case 'left':
                        targetElemPos.left = hostElemPos.left - targetWidth;
                        break;
                    case 'right':
                        targetElemPos.left = hostElemPos.left + hostElemPos.width;
                        break;
                }

                switch (placement[1]) {
                    case 'top':
                        targetElemPos.top = hostElemPos.top;
                        break;
                    case 'bottom':
                        targetElemPos.top = hostElemPos.top + hostElemPos.height - targetHeight;
                        break;
                    case 'left':
                        targetElemPos.left = hostElemPos.left;
                        break;
                    case 'right':
                        targetElemPos.left = hostElemPos.left + hostElemPos.width - targetWidth;
                        break;
                    case 'center':
                        if (PLACEMENT_REGEX.vertical.test(placement[0])) {
                            targetElemPos.left = hostElemPos.left + hostElemPos.width / 2 - targetWidth / 2;
                        } else {
                            targetElemPos.top = hostElemPos.top + hostElemPos.height / 2 - targetHeight / 2;
                        }
                        break;
                }

                targetElemPos.top = Math.round(targetElemPos.top);
                targetElemPos.left = Math.round(targetElemPos.left);
                targetElemPos.placement = placement[1] === 'center' ? placement[0] : placement[0] + '-' + placement[1];

                return targetElemPos;
            },

            /**
             * Provides a way to adjust the top positioning after first
             * render to correctly align element to top after content
             * rendering causes resized element height
             *
             * @param {array} placementClasses - The array of strings of classes
             * element should have.
             * @param {object} containerPosition - The object with container
             * position information
             * @param {number} initialHeight - The initial height for the elem.
             * @param {number} currentHeight - The current height for the elem.
             */
            adjustTop: function(placementClasses, containerPosition, initialHeight, currentHeight) {
                if (placementClasses.indexOf('top') !== -1 && initialHeight !== currentHeight) {
                    return {
                        top: containerPosition.top - currentHeight + 'px'
                    };
                }
            },

            /**
             * Provides a way for positioning tooltip & dropdown
             * arrows when using placement options beyond the standard
             * left, right, top, or bottom.
             *
             * @param {element} elem - The tooltip/dropdown element.
             * @param {string} placement - The placement for the elem.
             */
            positionArrow: function(elem, placement) {
                elem = this.getRawNode(elem);

                var innerElem = elem.querySelector('.tooltip-inner, .popover-inner');
                if (!innerElem) {
                    return;
                }

                var isTooltip = angular.element(innerElem).hasClass('tooltip-inner');

                var arrowElem = isTooltip ? elem.querySelector('.tooltip-arrow') : elem.querySelector('.arrow');
                if (!arrowElem) {
                    return;
                }

                var arrowCss = {
                    top: '',
                    bottom: '',
                    left: '',
                    right: ''
                };

                placement = this.parsePlacement(placement);
                if (placement[1] === 'center') {
                    // no adjustment necessary - just reset styles
                    angular.element(arrowElem).css(arrowCss);
                    return;
                }

                var borderProp = 'border-' + placement[0] + '-width';
                var borderWidth = $window.getComputedStyle(arrowElem)[borderProp];

                var borderRadiusProp = 'border-';
                if (PLACEMENT_REGEX.vertical.test(placement[0])) {
                    borderRadiusProp += placement[0] + '-' + placement[1];
                } else {
                    borderRadiusProp += placement[1] + '-' + placement[0];
                }
                borderRadiusProp += '-radius';
                var borderRadius = $window.getComputedStyle(isTooltip ? innerElem : elem)[borderRadiusProp];

                switch (placement[0]) {
                    case 'top':
                        arrowCss.bottom = isTooltip ? '0' : '-' + borderWidth;
                        break;
                    case 'bottom':
                        arrowCss.top = isTooltip ? '0' : '-' + borderWidth;
                        break;
                    case 'left':
                        arrowCss.right = isTooltip ? '0' : '-' + borderWidth;
                        break;
                    case 'right':
                        arrowCss.left = isTooltip ? '0' : '-' + borderWidth;
                        break;
                }

                arrowCss[placement[1]] = borderRadius;

                angular.element(arrowElem).css(arrowCss);
            }
        };
    }]);

angular.module('ui.bootstrap.datepickerPopup', ['ui.bootstrap.datepicker', 'ui.bootstrap.position'])

    .value('$datepickerPopupLiteralWarning', true)

    .constant('uibDatepickerPopupConfig', {
        altInputFormats: [],
        appendToBody: false,
        clearText: 'Clear',
        closeOnDateSelection: true,
        closeText: 'Done',
        currentText: 'Today',
        datepickerPopup: 'yyyy-MM-dd',
        datepickerPopupTemplateUrl: 'uib/template/datepickerPopup/popup.html',
        datepickerTemplateUrl: 'uib/template/datepicker/datepicker.html',
        html5Types: {
            date: 'yyyy-MM-dd',
            'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
            'month': 'yyyy-MM'
        },
        onOpenFocus: true,
        showButtonBar: true,
        placement: 'auto bottom-left'
    })

    .controller('UibDatepickerPopupController', ['$scope', '$element', '$attrs', '$compile', '$log', '$parse', '$window', '$document', '$rootScope', '$uibPosition', 'dateFilter', 'uibDateParser', 'uibDatepickerPopupConfig', '$timeout', 'uibDatepickerConfig', '$datepickerPopupLiteralWarning',
        function($scope, $element, $attrs, $compile, $log, $parse, $window, $document, $rootScope, $position, dateFilter, dateParser, datepickerPopupConfig, $timeout, datepickerConfig, $datepickerPopupLiteralWarning) {
            var cache = {},
                isHtml5DateInput = false;
            var dateFormat, closeOnDateSelection, appendToBody, onOpenFocus,
                datepickerPopupTemplateUrl, datepickerTemplateUrl, popupEl, datepickerEl, scrollParentEl,
                ngModel, ngModelOptions, $popup, altInputFormats, watchListeners = [];

            this.init = function(_ngModel_) {
                ngModel = _ngModel_;
                ngModelOptions = extractOptions(ngModel);
                closeOnDateSelection = angular.isDefined($attrs.closeOnDateSelection) ?
                    $scope.$parent.$eval($attrs.closeOnDateSelection) :
                    datepickerPopupConfig.closeOnDateSelection;
                appendToBody = angular.isDefined($attrs.datepickerAppendToBody) ?
                    $scope.$parent.$eval($attrs.datepickerAppendToBody) :
                    datepickerPopupConfig.appendToBody;
                onOpenFocus = angular.isDefined($attrs.onOpenFocus) ?
                    $scope.$parent.$eval($attrs.onOpenFocus) : datepickerPopupConfig.onOpenFocus;
                datepickerPopupTemplateUrl = angular.isDefined($attrs.datepickerPopupTemplateUrl) ?
                    $attrs.datepickerPopupTemplateUrl :
                    datepickerPopupConfig.datepickerPopupTemplateUrl;
                datepickerTemplateUrl = angular.isDefined($attrs.datepickerTemplateUrl) ?
                    $attrs.datepickerTemplateUrl : datepickerPopupConfig.datepickerTemplateUrl;
                altInputFormats = angular.isDefined($attrs.altInputFormats) ?
                    $scope.$parent.$eval($attrs.altInputFormats) :
                    datepickerPopupConfig.altInputFormats;

                $scope.showButtonBar = angular.isDefined($attrs.showButtonBar) ?
                    $scope.$parent.$eval($attrs.showButtonBar) :
                    datepickerPopupConfig.showButtonBar;

                if (datepickerPopupConfig.html5Types[$attrs.type]) {
                    dateFormat = datepickerPopupConfig.html5Types[$attrs.type];
                    isHtml5DateInput = true;
                } else {
                    dateFormat = $attrs.uibDatepickerPopup || datepickerPopupConfig.datepickerPopup;
                    $attrs.$observe('uibDatepickerPopup', function(value, oldValue) {
                        var newDateFormat = value || datepickerPopupConfig.datepickerPopup;
                        // Invalidate the $modelValue to ensure that formatters re-run
                        // FIXME: Refactor when PR is merged: https://github.com/angular/angular.js/pull/10764
                        if (newDateFormat !== dateFormat) {
                            dateFormat = newDateFormat;
                            ngModel.$modelValue = null;

                            if (!dateFormat) {
                                throw new Error('uibDatepickerPopup must have a date format specified.');
                            }
                        }
                    });
                }

                if (!dateFormat) {
                    throw new Error('uibDatepickerPopup must have a date format specified.');
                }

                if (isHtml5DateInput && $attrs.uibDatepickerPopup) {
                    throw new Error('HTML5 date input types do not support custom formats.');
                }

                // popup element used to display calendar
                popupEl = angular.element('<div uib-datepicker-popup-wrap><div uib-datepicker></div></div>');

                popupEl.attr({
                    'ng-model': 'date',
                    'ng-change': 'dateSelection(date)',
                    'template-url': datepickerPopupTemplateUrl
                });

                // datepicker element
                datepickerEl = angular.element(popupEl.children()[0]);
                datepickerEl.attr('template-url', datepickerTemplateUrl);

                if (!$scope.datepickerOptions) {
                    $scope.datepickerOptions = {};
                }

                if (isHtml5DateInput) {
                    if ($attrs.type === 'month') {
                        $scope.datepickerOptions.datepickerMode = 'month';
                        $scope.datepickerOptions.minMode = 'month';
                    }
                }

                datepickerEl.attr('datepicker-options', 'datepickerOptions');

                if (!isHtml5DateInput) {
                    // Internal API to maintain the correct ng-invalid-[key] class
                    ngModel.$$parserName = 'date';
                    ngModel.$validators.date = validator;
                    ngModel.$parsers.unshift(parseDate);
                    ngModel.$formatters.push(function(value) {
                        if (ngModel.$isEmpty(value)) {
                            $scope.date = value;
                            return value;
                        }

                        if (angular.isNumber(value)) {
                            value = new Date(value);
                        }

                        $scope.date = dateParser.fromTimezone(value, ngModelOptions.getOption('timezone'));

                        return dateParser.filter($scope.date, dateFormat);
                    });
                } else {
                    ngModel.$formatters.push(function(value) {
                        $scope.date = dateParser.fromTimezone(value, ngModelOptions.getOption('timezone'));
                        return value;
                    });
                }

                // Detect changes in the view from the text box
                ngModel.$viewChangeListeners.push(function() {
                    $scope.date = parseDateString(ngModel.$viewValue);
                });

                $element.on('keydown', inputKeydownBind);

                $popup = $compile(popupEl)($scope);
                // Prevent jQuery cache memory leak (template is now redundant after linking)
                popupEl.remove();

                if (appendToBody) {
                    $document.find('body').append($popup);
                } else {
                    $element.after($popup);
                }

                $scope.$on('$destroy', function() {
                    if ($scope.isOpen === true) {
                        if (!$rootScope.$$phase) {
                            $scope.$apply(function() {
                                $scope.isOpen = false;
                            });
                        }
                    }

                    $popup.remove();
                    $element.off('keydown', inputKeydownBind);
                    $document.off('click', documentClickBind);
                    if (scrollParentEl) {
                        scrollParentEl.off('scroll', positionPopup);
                    }
                    angular.element($window).off('resize', positionPopup);

                    //Clear all watch listeners on destroy
                    while (watchListeners.length) {
                        watchListeners.shift()();
                    }
                });
            };

            $scope.getText = function(key) {
                return $scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
            };

            $scope.isDisabled = function(date) {
                if (date === 'today') {
                    date = dateParser.fromTimezone(new Date(), ngModelOptions.getOption('timezone'));
                }

                var dates = {};
                angular.forEach(['minDate', 'maxDate'], function(key) {
                    if (!$scope.datepickerOptions[key]) {
                        dates[key] = null;
                    } else if (angular.isDate($scope.datepickerOptions[key])) {
                        dates[key] = new Date($scope.datepickerOptions[key]);
                    } else {
                        if ($datepickerPopupLiteralWarning) {
                            $log.warn('Literal date support has been deprecated, please switch to date object usage');
                        }

                        dates[key] = new Date(dateFilter($scope.datepickerOptions[key], 'medium'));
                    }
                });

                return $scope.datepickerOptions &&
                    dates.minDate && $scope.compare(date, dates.minDate) < 0 ||
                    dates.maxDate && $scope.compare(date, dates.maxDate) > 0;
            };

            $scope.compare = function(date1, date2) {
                return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
            };

            // Inner change
            $scope.dateSelection = function(dt) {
                $scope.date = dt;
                var date = $scope.date ? dateParser.filter($scope.date, dateFormat) : null; // Setting to NULL is necessary for form validators to function
                $element.val(date);
                ngModel.$setViewValue(date);

                if (closeOnDateSelection) {
                    $scope.isOpen = false;
                    $element[0].focus();
                }
            };

            $scope.keydown = function(evt) {
                if (evt.which === 27) {
                    evt.stopPropagation();
                    $scope.isOpen = false;
                    $element[0].focus();
                }
            };

            $scope.select = function(date, evt) {
                evt.stopPropagation();

                if (date === 'today') {
                    var today = new Date();
                    if (angular.isDate($scope.date)) {
                        date = new Date($scope.date);
                        date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
                    } else {
                        date = dateParser.fromTimezone(today, ngModelOptions.getOption('timezone'));
                        date.setHours(0, 0, 0, 0);
                    }
                }
                $scope.dateSelection(date);
            };

            $scope.close = function(evt) {
                evt.stopPropagation();

                $scope.isOpen = false;
                $element[0].focus();
            };

            $scope.disabled = angular.isDefined($attrs.disabled) || false;
            if ($attrs.ngDisabled) {
                watchListeners.push($scope.$parent.$watch($parse($attrs.ngDisabled), function(disabled) {
                    $scope.disabled = disabled;
                }));
            }

            $scope.$watch('isOpen', function(value) {
                if (value) {
                    if (!$scope.disabled) {
                        $timeout(function() {
                            positionPopup();

                            if (onOpenFocus) {
                                $scope.$broadcast('uib:datepicker.focus');
                            }

                            $document.on('click', documentClickBind);

                            var placement = $attrs.popupPlacement ? $attrs.popupPlacement : datepickerPopupConfig.placement;
                            if (appendToBody || $position.parsePlacement(placement)[2]) {
                                scrollParentEl = scrollParentEl || angular.element($position.scrollParent($element));
                                if (scrollParentEl) {
                                    scrollParentEl.on('scroll', positionPopup);
                                }
                            } else {
                                scrollParentEl = null;
                            }

                            angular.element($window).on('resize', positionPopup);
                        }, 0, false);
                    } else {
                        $scope.isOpen = false;
                    }
                } else {
                    $document.off('click', documentClickBind);
                    if (scrollParentEl) {
                        scrollParentEl.off('scroll', positionPopup);
                    }
                    angular.element($window).off('resize', positionPopup);
                }
            });

            function cameltoDash(string) {
                return string.replace(/([A-Z])/g, function($1) { return '-' + $1.toLowerCase(); });
            }

            function parseDateString(viewValue) {
                var date = dateParser.parse(viewValue, dateFormat, $scope.date);
                if (isNaN(date)) {
                    for (var i = 0; i < altInputFormats.length; i++) {
                        date = dateParser.parse(viewValue, altInputFormats[i], $scope.date);
                        if (!isNaN(date)) {
                            return date;
                        }
                    }
                }
                return date;
            }

            function parseDate(viewValue) {
                if (angular.isNumber(viewValue)) {
                    // presumably timestamp to date object
                    viewValue = new Date(viewValue);
                }

                if (!viewValue) {
                    return null;
                }

                if (angular.isDate(viewValue) && !isNaN(viewValue)) {
                    return viewValue;
                }

                if (angular.isString(viewValue)) {
                    var date = parseDateString(viewValue);
                    if (!isNaN(date)) {
                        return dateParser.toTimezone(date, ngModelOptions.getOption('timezone'));
                    }
                }

                return ngModelOptions.getOption('allowInvalid') ? viewValue : undefined;
            }

            function validator(modelValue, viewValue) {
                var value = modelValue || viewValue;

                if (!$attrs.ngRequired && !value) {
                    return true;
                }

                if (angular.isNumber(value)) {
                    value = new Date(value);
                }

                if (!value) {
                    return true;
                }

                if (angular.isDate(value) && !isNaN(value)) {
                    return true;
                }

                if (angular.isString(value)) {
                    return !isNaN(parseDateString(value));
                }

                return false;
            }

            function documentClickBind(event) {
                if (!$scope.isOpen && $scope.disabled) {
                    return;
                }

                var popup = $popup[0];
                var dpContainsTarget = $element[0].contains(event.target);
                // The popup node may not be an element node
                // In some browsers (IE) only element nodes have the 'contains' function
                var popupContainsTarget = popup.contains !== undefined && popup.contains(event.target);
                if ($scope.isOpen && !(dpContainsTarget || popupContainsTarget)) {
                    $scope.$apply(function() {
                        $scope.isOpen = false;
                    });
                }
            }

            function inputKeydownBind(evt) {
                if (evt.which === 27 && $scope.isOpen) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    $scope.$apply(function() {
                        $scope.isOpen = false;
                    });
                    $element[0].focus();
                } else if (evt.which === 40 && !$scope.isOpen) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    $scope.$apply(function() {
                        $scope.isOpen = true;
                    });
                }
            }

            function positionPopup() {
                if ($scope.isOpen) {
                    var dpElement = angular.element($popup[0].querySelector('.uib-datepicker-popup'));
                    var placement = $attrs.popupPlacement ? $attrs.popupPlacement : datepickerPopupConfig.placement;
                    var position = $position.positionElements($element, dpElement, placement, appendToBody);
                    dpElement.css({top: position.top + 'px', left: position.left + 'px'});
                    if (dpElement.hasClass('uib-position-measure')) {
                        dpElement.removeClass('uib-position-measure');
                    }
                }
            }

            function extractOptions(ngModelCtrl) {
                var ngModelOptions;

                if (angular.version.minor < 6) { // in angular < 1.6 $options could be missing
                    // guarantee a value
                    ngModelOptions = angular.isObject(ngModelCtrl.$options) ?
                        ngModelCtrl.$options :
                        {
                            timezone: null
                        };

                    // mimic 1.6+ api
                    ngModelOptions.getOption = function (key) {
                        return ngModelOptions[key];
                    };
                } else { // in angular >=1.6 $options is always present
                    ngModelOptions = ngModelCtrl.$options;
                }

                return ngModelOptions;
            }

            $scope.$on('uib:datepicker.mode', function() {
                $timeout(positionPopup, 0, false);
            });
        }])

    .directive('uibDatepickerPopup', function() {
        return {
            require: ['ngModel', 'uibDatepickerPopup'],
            controller: 'UibDatepickerPopupController',
            scope: {
                datepickerOptions: '=?',
                isOpen: '=?',
                currentText: '@',
                clearText: '@',
                closeText: '@'
            },
            link: function(scope, element, attrs, ctrls) {
                var ngModel = ctrls[0],
                    ctrl = ctrls[1];

                ctrl.init(ngModel);
            }
        };
    })

    .directive('uibDatepickerPopupWrap', function() {
        return {
            restrict: 'A',
            transclude: true,
            templateUrl: function(element, attrs) {
                return attrs.templateUrl || 'uib/template/datepickerPopup/popup.html';
            }
        };
    });

angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.dateparser', 'ui.bootstrap.isClass'])

    .value('$datepickerSuppressError', false)

    .value('$datepickerLiteralWarning', true)

    .constant('uibDatepickerConfig', {
        datepickerMode: 'day',
        formatDay: 'dd',
        formatMonth: 'MMMM',
        formatYear: 'yyyy',
        formatDayHeader: 'EEE',
        formatDayTitle: 'MMMM yyyy',
        formatMonthTitle: 'yyyy',
        maxDate: null,
        maxMode: 'year',
        minDate: null,
        minMode: 'day',
        monthColumns: 3,
        ngModelOptions: {},
        shortcutPropagation: false,
        showWeeks: true,
        yearColumns: 5,
        yearRows: 4
    })

    .controller('UibDatepickerController', ['$scope', '$element', '$attrs', '$parse', '$interpolate', '$locale', '$log', 'dateFilter', 'uibDatepickerConfig', '$datepickerLiteralWarning', '$datepickerSuppressError', 'uibDateParser',
        function($scope, $element, $attrs, $parse, $interpolate, $locale, $log, dateFilter, datepickerConfig, $datepickerLiteralWarning, $datepickerSuppressError, dateParser) {
            var self = this,
                ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl;
                ngModelOptions = {},
                watchListeners = [];

            $element.addClass('uib-datepicker');
            $attrs.$set('role', 'application');

            if (!$scope.datepickerOptions) {
                $scope.datepickerOptions = {};
            }

            // Modes chain
            this.modes = ['day', 'month', 'year'];

            [
                'customClass',
                'dateDisabled',
                'datepickerMode',
                'formatDay',
                'formatDayHeader',
                'formatDayTitle',
                'formatMonth',
                'formatMonthTitle',
                'formatYear',
                'maxDate',
                'maxMode',
                'minDate',
                'minMode',
                'monthColumns',
                'showWeeks',
                'shortcutPropagation',
                'startingDay',
                'yearColumns',
                'yearRows'
            ].forEach(function(key) {
                switch (key) {
                    case 'customClass':
                    case 'dateDisabled':
                        $scope[key] = $scope.datepickerOptions[key] || angular.noop;
                        break;
                    case 'datepickerMode':
                        $scope.datepickerMode = angular.isDefined($scope.datepickerOptions.datepickerMode) ?
                            $scope.datepickerOptions.datepickerMode : datepickerConfig.datepickerMode;
                        break;
                    case 'formatDay':
                    case 'formatDayHeader':
                    case 'formatDayTitle':
                    case 'formatMonth':
                    case 'formatMonthTitle':
                    case 'formatYear':
                        self[key] = angular.isDefined($scope.datepickerOptions[key]) ?
                            $interpolate($scope.datepickerOptions[key])($scope.$parent) :
                            datepickerConfig[key];
                        break;
                    case 'monthColumns':
                    case 'showWeeks':
                    case 'shortcutPropagation':
                    case 'yearColumns':
                    case 'yearRows':
                        self[key] = angular.isDefined($scope.datepickerOptions[key]) ?
                            $scope.datepickerOptions[key] : datepickerConfig[key];
                        break;
                    case 'startingDay':
                        if (angular.isDefined($scope.datepickerOptions.startingDay)) {
                            self.startingDay = $scope.datepickerOptions.startingDay;
                        } else if (angular.isNumber(datepickerConfig.startingDay)) {
                            self.startingDay = datepickerConfig.startingDay;
                        } else {
                            self.startingDay = ($locale.DATETIME_FORMATS.FIRSTDAYOFWEEK + 8) % 7;
                        }

                        break;
                    case 'maxDate':
                    case 'minDate':
                        $scope.$watch('datepickerOptions.' + key, function(value) {
                            if (value) {
                                if (angular.isDate(value)) {
                                    self[key] = dateParser.fromTimezone(new Date(value), ngModelOptions.getOption('timezone'));
                                } else {
                                    if ($datepickerLiteralWarning) {
                                        $log.warn('Literal date support has been deprecated, please switch to date object usage');
                                    }

                                    self[key] = new Date(dateFilter(value, 'medium'));
                                }
                            } else {
                                self[key] = datepickerConfig[key] ?
                                    dateParser.fromTimezone(new Date(datepickerConfig[key]), ngModelOptions.getOption('timezone')) :
                                    null;
                            }

                            self.refreshView();
                        });

                        break;
                    case 'maxMode':
                    case 'minMode':
                        if ($scope.datepickerOptions[key]) {
                            $scope.$watch(function() { return $scope.datepickerOptions[key]; }, function(value) {
                                self[key] = $scope[key] = angular.isDefined(value) ? value : $scope.datepickerOptions[key];
                                if (key === 'minMode' && self.modes.indexOf($scope.datepickerOptions.datepickerMode) < self.modes.indexOf(self[key]) ||
                                    key === 'maxMode' && self.modes.indexOf($scope.datepickerOptions.datepickerMode) > self.modes.indexOf(self[key])) {
                                    $scope.datepickerMode = self[key];
                                    $scope.datepickerOptions.datepickerMode = self[key];
                                }
                            });
                        } else {
                            self[key] = $scope[key] = datepickerConfig[key] || null;
                        }

                        break;
                }
            });

            $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);

            $scope.disabled = angular.isDefined($attrs.disabled) || false;
            if (angular.isDefined($attrs.ngDisabled)) {
                watchListeners.push($scope.$parent.$watch($attrs.ngDisabled, function(disabled) {
                    $scope.disabled = disabled;
                    self.refreshView();
                }));
            }

            $scope.isActive = function(dateObject) {
                if (self.compare(dateObject.date, self.activeDate) === 0) {
                    $scope.activeDateId = dateObject.uid;
                    return true;
                }
                return false;
            };

            this.init = function(ngModelCtrl_) {
                ngModelCtrl = ngModelCtrl_;
                ngModelOptions = extractOptions(ngModelCtrl);

                if ($scope.datepickerOptions.initDate) {
                    self.activeDate = dateParser.fromTimezone($scope.datepickerOptions.initDate, ngModelOptions.getOption('timezone')) || new Date();
                    $scope.$watch('datepickerOptions.initDate', function(initDate) {
                        if (initDate && (ngModelCtrl.$isEmpty(ngModelCtrl.$modelValue) || ngModelCtrl.$invalid)) {
                            self.activeDate = dateParser.fromTimezone(initDate, ngModelOptions.getOption('timezone'));
                            self.refreshView();
                        }
                    });
                } else {
                    self.activeDate = new Date();
                }

                var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : new Date();
                this.activeDate = !isNaN(date) ?
                    dateParser.fromTimezone(date, ngModelOptions.getOption('timezone')) :
                    dateParser.fromTimezone(new Date(), ngModelOptions.getOption('timezone'));

                ngModelCtrl.$render = function() {
                    self.render();
                };
            };

            this.render = function() {
                if (ngModelCtrl.$viewValue) {
                    var date = new Date(ngModelCtrl.$viewValue),
                        isValid = !isNaN(date);

                    if (isValid) {
                        this.activeDate = dateParser.fromTimezone(date, ngModelOptions.getOption('timezone'));
                    } else if (!$datepickerSuppressError) {
                        $log.error('Datepicker directive: "ng-model" value must be a Date object');
                    }
                }
                this.refreshView();
            };

            this.refreshView = function() {
                if (this.element) {
                    $scope.selectedDt = null;
                    this._refreshView();
                    if ($scope.activeDt) {
                        $scope.activeDateId = $scope.activeDt.uid;
                    }

                    var date = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
                    date = dateParser.fromTimezone(date, ngModelOptions.getOption('timezone'));
                    ngModelCtrl.$setValidity('dateDisabled', !date ||
                        this.element && !this.isDisabled(date));
                }
            };

            this.createDateObject = function(date, format) {
                var model = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
                model = dateParser.fromTimezone(model, ngModelOptions.getOption('timezone'));
                var today = new Date();
                today = dateParser.fromTimezone(today, ngModelOptions.getOption('timezone'));
                var time = this.compare(date, today);
                var dt = {
                    date: date,
                    label: dateParser.filter(date, format),
                    selected: model && this.compare(date, model) === 0,
                    disabled: this.isDisabled(date),
                    past: time < 0,
                    current: time === 0,
                    future: time > 0,
                    customClass: this.customClass(date) || null
                };

                if (model && this.compare(date, model) === 0) {
                    $scope.selectedDt = dt;
                }

                if (self.activeDate && this.compare(dt.date, self.activeDate) === 0) {
                    $scope.activeDt = dt;
                }

                return dt;
            };

            this.isDisabled = function(date) {
                return $scope.disabled ||
                    this.minDate && this.compare(date, this.minDate) < 0 ||
                    this.maxDate && this.compare(date, this.maxDate) > 0 ||
                    $scope.dateDisabled && $scope.dateDisabled({date: date, mode: $scope.datepickerMode});
            };

            this.customClass = function(date) {
                return $scope.customClass({date: date, mode: $scope.datepickerMode});
            };

            // Split array into smaller arrays
            this.split = function(arr, size) {
                var arrays = [];
                while (arr.length > 0) {
                    arrays.push(arr.splice(0, size));
                }
                return arrays;
            };

            $scope.select = function(date) {
                if ($scope.datepickerMode === self.minMode) {
                    var dt = ngModelCtrl.$viewValue ? dateParser.fromTimezone(new Date(ngModelCtrl.$viewValue), ngModelOptions.getOption('timezone')) : new Date(0, 0, 0, 0, 0, 0, 0);
                    dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                    dt = dateParser.toTimezone(dt, ngModelOptions.getOption('timezone'));
                    ngModelCtrl.$setViewValue(dt);
                    ngModelCtrl.$render();
                } else {
                    self.activeDate = date;
                    setMode(self.modes[self.modes.indexOf($scope.datepickerMode) - 1]);

                    $scope.$emit('uib:datepicker.mode');
                }

                $scope.$broadcast('uib:datepicker.focus');
            };

            $scope.move = function(direction) {
                var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
                    month = self.activeDate.getMonth() + direction * (self.step.months || 0);
                self.activeDate.setFullYear(year, month, 1);
                self.refreshView();
            };

            $scope.toggleMode = function(direction) {
                direction = direction || 1;

                if ($scope.datepickerMode === self.maxMode && direction === 1 ||
                    $scope.datepickerMode === self.minMode && direction === -1) {
                    return;
                }

                setMode(self.modes[self.modes.indexOf($scope.datepickerMode) + direction]);

                $scope.$emit('uib:datepicker.mode');
            };

            // Key event mapper
            $scope.keys = { 13: 'enter', 32: 'space', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

            var focusElement = function() {
                self.element[0].focus();
            };

            // Listen for focus requests from popup directive
            $scope.$on('uib:datepicker.focus', focusElement);

            $scope.keydown = function(evt) {
                var key = $scope.keys[evt.which];

                if (!key || evt.shiftKey || evt.altKey || $scope.disabled) {
                    return;
                }

                evt.preventDefault();
                if (!self.shortcutPropagation) {
                    evt.stopPropagation();
                }

                if (key === 'enter' || key === 'space') {
                    if (self.isDisabled(self.activeDate)) {
                        return; // do nothing
                    }
                    $scope.select(self.activeDate);
                } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
                    $scope.toggleMode(key === 'up' ? 1 : -1);
                } else {
                    self.handleKeyDown(key, evt);
                    self.refreshView();
                }
            };

            $element.on('keydown', function(evt) {
                $scope.$apply(function() {
                    $scope.keydown(evt);
                });
            });

            $scope.$on('$destroy', function() {
                //Clear all watch listeners on destroy
                while (watchListeners.length) {
                    watchListeners.shift()();
                }
            });

            function setMode(mode) {
                $scope.datepickerMode = mode;
                $scope.datepickerOptions.datepickerMode = mode;
            }

            function extractOptions(ngModelCtrl) {
                var ngModelOptions;

                if (angular.version.minor < 6) { // in angular < 1.6 $options could be missing
                    // guarantee a value
                    ngModelOptions = ngModelCtrl.$options ||
                        $scope.datepickerOptions.ngModelOptions ||
                        datepickerConfig.ngModelOptions ||
                        {};

                    // mimic 1.6+ api
                    ngModelOptions.getOption = function (key) {
                        return ngModelOptions[key];
                    };
                } else { // in angular >=1.6 $options is always present
                    // ng-model-options defaults timezone to null; don't let its precedence squash a non-null value
                    var timezone = ngModelCtrl.$options.getOption('timezone') ||
                        ($scope.datepickerOptions.ngModelOptions ? $scope.datepickerOptions.ngModelOptions.timezone : null) ||
                        (datepickerConfig.ngModelOptions ? datepickerConfig.ngModelOptions.timezone : null);

                    // values passed to createChild override existing values
                    ngModelOptions = ngModelCtrl.$options // start with a ModelOptions instance
                        .createChild(datepickerConfig.ngModelOptions) // lowest precedence
                        .createChild($scope.datepickerOptions.ngModelOptions)
                        .createChild(ngModelCtrl.$options) // highest precedence
                        .createChild({timezone: timezone}); // to keep from squashing a non-null value
                }

                return ngModelOptions;
            }
        }])

    .controller('UibDaypickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
        var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        this.step = { months: 1 };
        this.element = $element;
        function getDaysInMonth(year, month) {
            return month === 1 && year % 4 === 0 &&
            (year % 100 !== 0 || year % 400 === 0) ? 29 : DAYS_IN_MONTH[month];
        }

        this.init = function(ctrl) {
            angular.extend(ctrl, this);
            scope.showWeeks = ctrl.showWeeks;
            ctrl.refreshView();
        };

        this.getDates = function(startDate, n) {
            var dates = new Array(n), current = new Date(startDate), i = 0, date;
            while (i < n) {
                date = new Date(current);
                dates[i++] = date;
                current.setDate(current.getDate() + 1);
            }
            return dates;
        };

        this._refreshView = function() {
            var year = this.activeDate.getFullYear(),
                month = this.activeDate.getMonth(),
                firstDayOfMonth = new Date(this.activeDate);

            firstDayOfMonth.setFullYear(year, month, 1);

            var difference = this.startingDay - firstDayOfMonth.getDay(),
                numDisplayedFromPreviousMonth = difference > 0 ?
                    7 - difference : - difference,
                firstDate = new Date(firstDayOfMonth);

            if (numDisplayedFromPreviousMonth > 0) {
                firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
            }

            // 42 is the number of days on a six-week calendar
            var days = this.getDates(firstDate, 42);
            for (var i = 0; i < 42; i ++) {
                days[i] = angular.extend(this.createDateObject(days[i], this.formatDay), {
                    secondary: days[i].getMonth() !== month,
                    uid: scope.uniqueId + '-' + i
                });
            }

            scope.labels = new Array(7);
            for (var j = 0; j < 7; j++) {
                scope.labels[j] = {
                    abbr: dateFilter(days[j].date, this.formatDayHeader),
                    full: dateFilter(days[j].date, 'EEEE')
                };
            }

            scope.title = dateFilter(this.activeDate, this.formatDayTitle);
            scope.rows = this.split(days, 7);

            if (scope.showWeeks) {
                scope.weekNumbers = [];
                var thursdayIndex = (4 + 7 - this.startingDay) % 7,
                    numWeeks = scope.rows.length;
                for (var curWeek = 0; curWeek < numWeeks; curWeek++) {
                    scope.weekNumbers.push(
                        getISO8601WeekNumber(scope.rows[curWeek][thursdayIndex].date));
                }
            }
        };

        this.compare = function(date1, date2) {
            var _date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
            var _date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
            _date1.setFullYear(date1.getFullYear());
            _date2.setFullYear(date2.getFullYear());
            return _date1 - _date2;
        };

        function getISO8601WeekNumber(date) {
            var checkDate = new Date(date);
            checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
            var time = checkDate.getTime();
            checkDate.setMonth(0); // Compare with Jan 1
            checkDate.setDate(1);
            return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        }

        this.handleKeyDown = function(key, evt) {
            var date = this.activeDate.getDate();

            if (key === 'left') {
                date = date - 1;
            } else if (key === 'up') {
                date = date - 7;
            } else if (key === 'right') {
                date = date + 1;
            } else if (key === 'down') {
                date = date + 7;
            } else if (key === 'pageup' || key === 'pagedown') {
                var month = this.activeDate.getMonth() + (key === 'pageup' ? - 1 : 1);
                this.activeDate.setMonth(month, 1);
                date = Math.min(getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth()), date);
            } else if (key === 'home') {
                date = 1;
            } else if (key === 'end') {
                date = getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth());
            }
            this.activeDate.setDate(date);
        };
    }])

    .controller('UibMonthpickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
        this.step = { years: 1 };
        this.element = $element;

        this.init = function(ctrl) {
            angular.extend(ctrl, this);
            ctrl.refreshView();
        };

        this._refreshView = function() {
            var months = new Array(12),
                year = this.activeDate.getFullYear(),
                date;

            for (var i = 0; i < 12; i++) {
                date = new Date(this.activeDate);
                date.setFullYear(year, i, 1);
                months[i] = angular.extend(this.createDateObject(date, this.formatMonth), {
                    uid: scope.uniqueId + '-' + i
                });
            }

            scope.title = dateFilter(this.activeDate, this.formatMonthTitle);
            scope.rows = this.split(months, this.monthColumns);
            scope.yearHeaderColspan = this.monthColumns > 3 ? this.monthColumns - 2 : 1;
        };

        this.compare = function(date1, date2) {
            var _date1 = new Date(date1.getFullYear(), date1.getMonth());
            var _date2 = new Date(date2.getFullYear(), date2.getMonth());
            _date1.setFullYear(date1.getFullYear());
            _date2.setFullYear(date2.getFullYear());
            return _date1 - _date2;
        };

        this.handleKeyDown = function(key, evt) {
            var date = this.activeDate.getMonth();

            if (key === 'left') {
                date = date - 1;
            } else if (key === 'up') {
                date = date - this.monthColumns;
            } else if (key === 'right') {
                date = date + 1;
            } else if (key === 'down') {
                date = date + this.monthColumns;
            } else if (key === 'pageup' || key === 'pagedown') {
                var year = this.activeDate.getFullYear() + (key === 'pageup' ? - 1 : 1);
                this.activeDate.setFullYear(year);
            } else if (key === 'home') {
                date = 0;
            } else if (key === 'end') {
                date = 11;
            }
            this.activeDate.setMonth(date);
        };
    }])

    .controller('UibYearpickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
        var columns, range;
        this.element = $element;

        function getStartingYear(year) {
            return parseInt((year - 1) / range, 10) * range + 1;
        }

        this.yearpickerInit = function() {
            columns = this.yearColumns;
            range = this.yearRows * columns;
            this.step = { years: range };
        };

        this._refreshView = function() {
            var years = new Array(range), date;

            for (var i = 0, start = getStartingYear(this.activeDate.getFullYear()); i < range; i++) {
                date = new Date(this.activeDate);
                date.setFullYear(start + i, 0, 1);
                years[i] = angular.extend(this.createDateObject(date, this.formatYear), {
                    uid: scope.uniqueId + '-' + i
                });
            }

            scope.title = [years[0].label, years[range - 1].label].join(' - ');
            scope.rows = this.split(years, columns);
            scope.columns = columns;
        };

        this.compare = function(date1, date2) {
            return date1.getFullYear() - date2.getFullYear();
        };

        this.handleKeyDown = function(key, evt) {
            var date = this.activeDate.getFullYear();

            if (key === 'left') {
                date = date - 1;
            } else if (key === 'up') {
                date = date - columns;
            } else if (key === 'right') {
                date = date + 1;
            } else if (key === 'down') {
                date = date + columns;
            } else if (key === 'pageup' || key === 'pagedown') {
                date += (key === 'pageup' ? - 1 : 1) * range;
            } else if (key === 'home') {
                date = getStartingYear(this.activeDate.getFullYear());
            } else if (key === 'end') {
                date = getStartingYear(this.activeDate.getFullYear()) + range - 1;
            }
            this.activeDate.setFullYear(date);
        };
    }])

    .directive('uibDatepicker', function() {
        return {
            templateUrl: function(element, attrs) {
                return attrs.templateUrl || 'uib/template/datepicker/datepicker.html';
            },
            scope: {
                datepickerOptions: '=?'
            },
            require: ['uibDatepicker', '^ngModel'],
            restrict: 'A',
            controller: 'UibDatepickerController',
            controllerAs: 'datepicker',
            link: function(scope, element, attrs, ctrls) {
                var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                datepickerCtrl.init(ngModelCtrl);
            }
        };
    })

    .directive('uibDaypicker', function() {
        return {
            templateUrl: function(element, attrs) {
                return attrs.templateUrl || 'uib/template/datepicker/day.html';
            },
            require: ['^uibDatepicker', 'uibDaypicker'],
            restrict: 'A',
            controller: 'UibDaypickerController',
            link: function(scope, element, attrs, ctrls) {
                var datepickerCtrl = ctrls[0],
                    daypickerCtrl = ctrls[1];

                daypickerCtrl.init(datepickerCtrl);
            }
        };
    })

    .directive('uibMonthpicker', function() {
        return {
            templateUrl: function(element, attrs) {
                return attrs.templateUrl || 'uib/template/datepicker/month.html';
            },
            require: ['^uibDatepicker', 'uibMonthpicker'],
            restrict: 'A',
            controller: 'UibMonthpickerController',
            link: function(scope, element, attrs, ctrls) {
                var datepickerCtrl = ctrls[0],
                    monthpickerCtrl = ctrls[1];

                monthpickerCtrl.init(datepickerCtrl);
            }
        };
    })

    .directive('uibYearpicker', function() {
        return {
            templateUrl: function(element, attrs) {
                return attrs.templateUrl || 'uib/template/datepicker/year.html';
            },
            require: ['^uibDatepicker', 'uibYearpicker'],
            restrict: 'A',
            controller: 'UibYearpickerController',
            link: function(scope, element, attrs, ctrls) {
                var ctrl = ctrls[0];
                angular.extend(ctrl, ctrls[1]);
                ctrl.yearpickerInit();

                ctrl.refreshView();
            }
        };
    });

angular.module('ui.bootstrap.dateparser', [])

    .service('uibDateParser', ['$log', '$locale', 'dateFilter', 'orderByFilter', 'filterFilter', function($log, $locale, dateFilter, orderByFilter, filterFilter) {
        // Pulled from https://github.com/mbostock/d3/blob/master/src/format/requote.js
        var SPECIAL_CHARACTERS_REGEXP = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

        var localeId;
        var formatCodeToRegex;

        this.init = function() {
            localeId = $locale.id;

            this.parsers = {};
            this.formatters = {};

            formatCodeToRegex = [
                {
                    key: 'yyyy',
                    regex: '\\d{4}',
                    apply: function(value) { this.year = +value; },
                    formatter: function(date) {
                        var _date = new Date();
                        _date.setFullYear(Math.abs(date.getFullYear()));
                        return dateFilter(_date, 'yyyy');
                    }
                },
                {
                    key: 'yy',
                    regex: '\\d{2}',
                    apply: function(value) { value = +value; this.year = value < 69 ? value + 2000 : value + 1900; },
                    formatter: function(date) {
                        var _date = new Date();
                        _date.setFullYear(Math.abs(date.getFullYear()));
                        return dateFilter(_date, 'yy');
                    }
                },
                {
                    key: 'y',
                    regex: '\\d{1,4}',
                    apply: function(value) { this.year = +value; },
                    formatter: function(date) {
                        var _date = new Date();
                        _date.setFullYear(Math.abs(date.getFullYear()));
                        return dateFilter(_date, 'y');
                    }
                },
                {
                    key: 'M!',
                    regex: '0?[1-9]|1[0-2]',
                    apply: function(value) { this.month = value - 1; },
                    formatter: function(date) {
                        var value = date.getMonth();
                        if (/^[0-9]$/.test(value)) {
                            return dateFilter(date, 'MM');
                        }

                        return dateFilter(date, 'M');
                    }
                },
                {
                    key: 'MMMM',
                    regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
                    apply: function(value) { this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value); },
                    formatter: function(date) { return dateFilter(date, 'MMMM'); }
                },
                {
                    key: 'MMM',
                    regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
                    apply: function(value) { this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value); },
                    formatter: function(date) { return dateFilter(date, 'MMM'); }
                },
                {
                    key: 'MM',
                    regex: '0[1-9]|1[0-2]',
                    apply: function(value) { this.month = value - 1; },
                    formatter: function(date) { return dateFilter(date, 'MM'); }
                },
                {
                    key: 'M',
                    regex: '[1-9]|1[0-2]',
                    apply: function(value) { this.month = value - 1; },
                    formatter: function(date) { return dateFilter(date, 'M'); }
                },
                {
                    key: 'd!',
                    regex: '[0-2]?[0-9]{1}|3[0-1]{1}',
                    apply: function(value) { this.date = +value; },
                    formatter: function(date) {
                        var value = date.getDate();
                        if (/^[1-9]$/.test(value)) {
                            return dateFilter(date, 'dd');
                        }

                        return dateFilter(date, 'd');
                    }
                },
                {
                    key: 'dd',
                    regex: '[0-2][0-9]{1}|3[0-1]{1}',
                    apply: function(value) { this.date = +value; },
                    formatter: function(date) { return dateFilter(date, 'dd'); }
                },
                {
                    key: 'd',
                    regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
                    apply: function(value) { this.date = +value; },
                    formatter: function(date) { return dateFilter(date, 'd'); }
                },
                {
                    key: 'EEEE',
                    regex: $locale.DATETIME_FORMATS.DAY.join('|'),
                    formatter: function(date) { return dateFilter(date, 'EEEE'); }
                },
                {
                    key: 'EEE',
                    regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|'),
                    formatter: function(date) { return dateFilter(date, 'EEE'); }
                },
                {
                    key: 'HH',
                    regex: '(?:0|1)[0-9]|2[0-3]',
                    apply: function(value) { this.hours = +value; },
                    formatter: function(date) { return dateFilter(date, 'HH'); }
                },
                {
                    key: 'hh',
                    regex: '0[0-9]|1[0-2]',
                    apply: function(value) { this.hours = +value; },
                    formatter: function(date) { return dateFilter(date, 'hh'); }
                },
                {
                    key: 'H',
                    regex: '1?[0-9]|2[0-3]',
                    apply: function(value) { this.hours = +value; },
                    formatter: function(date) { return dateFilter(date, 'H'); }
                },
                {
                    key: 'h',
                    regex: '[0-9]|1[0-2]',
                    apply: function(value) { this.hours = +value; },
                    formatter: function(date) { return dateFilter(date, 'h'); }
                },
                {
                    key: 'mm',
                    regex: '[0-5][0-9]',
                    apply: function(value) { this.minutes = +value; },
                    formatter: function(date) { return dateFilter(date, 'mm'); }
                },
                {
                    key: 'm',
                    regex: '[0-9]|[1-5][0-9]',
                    apply: function(value) { this.minutes = +value; },
                    formatter: function(date) { return dateFilter(date, 'm'); }
                },
                {
                    key: 'sss',
                    regex: '[0-9][0-9][0-9]',
                    apply: function(value) { this.milliseconds = +value; },
                    formatter: function(date) { return dateFilter(date, 'sss'); }
                },
                {
                    key: 'ss',
                    regex: '[0-5][0-9]',
                    apply: function(value) { this.seconds = +value; },
                    formatter: function(date) { return dateFilter(date, 'ss'); }
                },
                {
                    key: 's',
                    regex: '[0-9]|[1-5][0-9]',
                    apply: function(value) { this.seconds = +value; },
                    formatter: function(date) { return dateFilter(date, 's'); }
                },
                {
                    key: 'a',
                    regex: $locale.DATETIME_FORMATS.AMPMS.join('|'),
                    apply: function(value) {
                        if (this.hours === 12) {
                            this.hours = 0;
                        }

                        if (value === 'PM') {
                            this.hours += 12;
                        }
                    },
                    formatter: function(date) { return dateFilter(date, 'a'); }
                },
                {
                    key: 'Z',
                    regex: '[+-]\\d{4}',
                    apply: function(value) {
                        var matches = value.match(/([+-])(\d{2})(\d{2})/),
                            sign = matches[1],
                            hours = matches[2],
                            minutes = matches[3];
                        this.hours += toInt(sign + hours);
                        this.minutes += toInt(sign + minutes);
                    },
                    formatter: function(date) {
                        return dateFilter(date, 'Z');
                    }
                },
                {
                    key: 'ww',
                    regex: '[0-4][0-9]|5[0-3]',
                    formatter: function(date) { return dateFilter(date, 'ww'); }
                },
                {
                    key: 'w',
                    regex: '[0-9]|[1-4][0-9]|5[0-3]',
                    formatter: function(date) { return dateFilter(date, 'w'); }
                },
                {
                    key: 'GGGG',
                    regex: $locale.DATETIME_FORMATS.ERANAMES.join('|').replace(/\s/g, '\\s'),
                    formatter: function(date) { return dateFilter(date, 'GGGG'); }
                },
                {
                    key: 'GGG',
                    regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
                    formatter: function(date) { return dateFilter(date, 'GGG'); }
                },
                {
                    key: 'GG',
                    regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
                    formatter: function(date) { return dateFilter(date, 'GG'); }
                },
                {
                    key: 'G',
                    regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
                    formatter: function(date) { return dateFilter(date, 'G'); }
                }
            ];

            if (angular.version.major >= 1 && angular.version.minor > 4) {
                formatCodeToRegex.push({
                    key: 'LLLL',
                    regex: $locale.DATETIME_FORMATS.STANDALONEMONTH.join('|'),
                    apply: function(value) { this.month = $locale.DATETIME_FORMATS.STANDALONEMONTH.indexOf(value); },
                    formatter: function(date) { return dateFilter(date, 'LLLL'); }
                });
            }
        };

        this.init();

        function getFormatCodeToRegex(key) {
            return filterFilter(formatCodeToRegex, {key: key}, true)[0];
        }

        this.getParser = function (key) {
            var f = getFormatCodeToRegex(key);
            return f && f.apply || null;
        };

        this.overrideParser = function (key, parser) {
            var f = getFormatCodeToRegex(key);
            if (f && angular.isFunction(parser)) {
                this.parsers = {};
                f.apply = parser;
            }
        }.bind(this);

        function createParser(format) {
            var map = [], regex = format.split('');

            // check for literal values
            var quoteIndex = format.indexOf('\'');
            if (quoteIndex > -1) {
                var inLiteral = false;
                format = format.split('');
                for (var i = quoteIndex; i < format.length; i++) {
                    if (inLiteral) {
                        if (format[i] === '\'') {
                            if (i + 1 < format.length && format[i+1] === '\'') { // escaped single quote
                                format[i+1] = '$';
                                regex[i+1] = '';
                            } else { // end of literal
                                regex[i] = '';
                                inLiteral = false;
                            }
                        }
                        format[i] = '$';
                    } else {
                        if (format[i] === '\'') { // start of literal
                            format[i] = '$';
                            regex[i] = '';
                            inLiteral = true;
                        }
                    }
                }

                format = format.join('');
            }

            angular.forEach(formatCodeToRegex, function(data) {
                var index = format.indexOf(data.key);

                if (index > -1) {
                    format = format.split('');

                    regex[index] = '(' + data.regex + ')';
                    format[index] = '$'; // Custom symbol to define consumed part of format
                    for (var i = index + 1, n = index + data.key.length; i < n; i++) {
                        regex[i] = '';
                        format[i] = '$';
                    }
                    format = format.join('');

                    map.push({
                        index: index,
                        key: data.key,
                        apply: data.apply,
                        matcher: data.regex
                    });
                }
            });

            return {
                regex: new RegExp('^' + regex.join('') + '$'),
                map: orderByFilter(map, 'index')
            };
        }

        function createFormatter(format) {
            var formatters = [];
            var i = 0;
            var formatter, literalIdx;
            while (i < format.length) {
                if (angular.isNumber(literalIdx)) {
                    if (format.charAt(i) === '\'') {
                        if (i + 1 >= format.length || format.charAt(i + 1) !== '\'') {
                            formatters.push(constructLiteralFormatter(format, literalIdx, i));
                            literalIdx = null;
                        }
                    } else if (i === format.length) {
                        while (literalIdx < format.length) {
                            formatter = constructFormatterFromIdx(format, literalIdx);
                            formatters.push(formatter);
                            literalIdx = formatter.endIdx;
                        }
                    }

                    i++;
                    continue;
                }

                if (format.charAt(i) === '\'') {
                    literalIdx = i;
                    i++;
                    continue;
                }

                formatter = constructFormatterFromIdx(format, i);

                formatters.push(formatter.parser);
                i = formatter.endIdx;
            }

            return formatters;
        }

        function constructLiteralFormatter(format, literalIdx, endIdx) {
            return function() {
                return format.substr(literalIdx + 1, endIdx - literalIdx - 1);
            };
        }

        function constructFormatterFromIdx(format, i) {
            var currentPosStr = format.substr(i);
            for (var j = 0; j < formatCodeToRegex.length; j++) {
                if (new RegExp('^' + formatCodeToRegex[j].key).test(currentPosStr)) {
                    var data = formatCodeToRegex[j];
                    return {
                        endIdx: i + data.key.length,
                        parser: data.formatter
                    };
                }
            }

            return {
                endIdx: i + 1,
                parser: function() {
                    return currentPosStr.charAt(0);
                }
            };
        }

        this.filter = function(date, format) {
            if (!angular.isDate(date) || isNaN(date) || !format) {
                return '';
            }

            format = $locale.DATETIME_FORMATS[format] || format;

            if ($locale.id !== localeId) {
                this.init();
            }

            if (!this.formatters[format]) {
                this.formatters[format] = createFormatter(format);
            }

            var formatters = this.formatters[format];

            return formatters.reduce(function(str, formatter) {
                return str + formatter(date);
            }, '');
        };

        this.parse = function(input, format, baseDate) {
            if (!angular.isString(input) || !format) {
                return input;
            }

            format = $locale.DATETIME_FORMATS[format] || format;
            format = format.replace(SPECIAL_CHARACTERS_REGEXP, '\\$&');

            if ($locale.id !== localeId) {
                this.init();
            }

            if (!this.parsers[format]) {
                this.parsers[format] = createParser(format, 'apply');
            }

            var parser = this.parsers[format],
                regex = parser.regex,
                map = parser.map,
                results = input.match(regex),
                tzOffset = false;
            if (results && results.length) {
                var fields, dt;
                if (angular.isDate(baseDate) && !isNaN(baseDate.getTime())) {
                    fields = {
                        year: baseDate.getFullYear(),
                        month: baseDate.getMonth(),
                        date: baseDate.getDate(),
                        hours: baseDate.getHours(),
                        minutes: baseDate.getMinutes(),
                        seconds: baseDate.getSeconds(),
                        milliseconds: baseDate.getMilliseconds()
                    };
                } else {
                    if (baseDate) {
                        $log.warn('dateparser:', 'baseDate is not a valid date');
                    }
                    fields = { year: 1900, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
                }

                for (var i = 1, n = results.length; i < n; i++) {
                    var mapper = map[i - 1];
                    if (mapper.matcher === 'Z') {
                        tzOffset = true;
                    }

                    if (mapper.apply) {
                        mapper.apply.call(fields, results[i]);
                    }
                }

                var datesetter = tzOffset ? Date.prototype.setUTCFullYear :
                    Date.prototype.setFullYear;
                var timesetter = tzOffset ? Date.prototype.setUTCHours :
                    Date.prototype.setHours;

                if (isValid(fields.year, fields.month, fields.date)) {
                    if (angular.isDate(baseDate) && !isNaN(baseDate.getTime()) && !tzOffset) {
                        dt = new Date(baseDate);
                        datesetter.call(dt, fields.year, fields.month, fields.date);
                        timesetter.call(dt, fields.hours, fields.minutes,
                            fields.seconds, fields.milliseconds);
                    } else {
                        dt = new Date(0);
                        datesetter.call(dt, fields.year, fields.month, fields.date);
                        timesetter.call(dt, fields.hours || 0, fields.minutes || 0,
                            fields.seconds || 0, fields.milliseconds || 0);
                    }
                }

                return dt;
            }
        };

        // Check if date is valid for specific month (and year for February).
        // Month: 0 = Jan, 1 = Feb, etc
        function isValid(year, month, date) {
            if (date < 1) {
                return false;
            }

            if (month === 1 && date > 28) {
                return date === 29 && (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0);
            }

            if (month === 3 || month === 5 || month === 8 || month === 10) {
                return date < 31;
            }

            return true;
        }

        function toInt(str) {
            return parseInt(str, 10);
        }

        this.toTimezone = toTimezone;
        this.fromTimezone = fromTimezone;
        this.timezoneToOffset = timezoneToOffset;
        this.addDateMinutes = addDateMinutes;
        this.convertTimezoneToLocal = convertTimezoneToLocal;

        function toTimezone(date, timezone) {
            return date && timezone ? convertTimezoneToLocal(date, timezone) : date;
        }

        function fromTimezone(date, timezone) {
            return date && timezone ? convertTimezoneToLocal(date, timezone, true) : date;
        }

        //https://github.com/angular/angular.js/blob/622c42169699ec07fc6daaa19fe6d224e5d2f70e/src/Angular.js#L1207
        function timezoneToOffset(timezone, fallback) {
            timezone = timezone.replace(/:/g, '');
            var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
            return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
        }

        function addDateMinutes(date, minutes) {
            date = new Date(date.getTime());
            date.setMinutes(date.getMinutes() + minutes);
            return date;
        }

        function convertTimezoneToLocal(date, timezone, reverse) {
            reverse = reverse ? -1 : 1;
            var dateTimezoneOffset = date.getTimezoneOffset();
            var timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
            return addDateMinutes(date, reverse * (timezoneOffset - dateTimezoneOffset));
        }
    }]);

// Avoiding use of ng-class as it creates a lot of watchers when a class is to be applied to
// at most one element.
angular.module('ui.bootstrap.isClass', [])
    .directive('uibIsClass', [
        '$animate',
        function ($animate) {
            //                    11111111          22222222
            var ON_REGEXP = /^\s*([\s\S]+?)\s+on\s+([\s\S]+?)\s*$/;
            //                    11111111           22222222
            var IS_REGEXP = /^\s*([\s\S]+?)\s+for\s+([\s\S]+?)\s*$/;

            var dataPerTracked = {};

            return {
                restrict: 'A',
                compile: function(tElement, tAttrs) {
                    var linkedScopes = [];
                    var instances = [];
                    var expToData = {};
                    var lastActivated = null;
                    var onExpMatches = tAttrs.uibIsClass.match(ON_REGEXP);
                    var onExp = onExpMatches[2];
                    var expsStr = onExpMatches[1];
                    var exps = expsStr.split(',');

                    return linkFn;

                    function linkFn(scope, element, attrs) {
                        linkedScopes.push(scope);
                        instances.push({
                            scope: scope,
                            element: element
                        });

                        exps.forEach(function(exp, k) {
                            addForExp(exp, scope);
                        });

                        scope.$on('$destroy', removeScope);
                    }

                    function addForExp(exp, scope) {
                        var matches = exp.match(IS_REGEXP);
                        var clazz = scope.$eval(matches[1]);
                        var compareWithExp = matches[2];
                        var data = expToData[exp];
                        if (!data) {
                            var watchFn = function(compareWithVal) {
                                var newActivated = null;
                                instances.some(function(instance) {
                                    var thisVal = instance.scope.$eval(onExp);
                                    if (thisVal === compareWithVal) {
                                        newActivated = instance;
                                        return true;
                                    }
                                });
                                if (data.lastActivated !== newActivated) {
                                    if (data.lastActivated) {
                                        $animate.removeClass(data.lastActivated.element, clazz);
                                    }
                                    if (newActivated) {
                                        $animate.addClass(newActivated.element, clazz);
                                    }
                                    data.lastActivated = newActivated;
                                }
                            };
                            expToData[exp] = data = {
                                lastActivated: null,
                                scope: scope,
                                watchFn: watchFn,
                                compareWithExp: compareWithExp,
                                watcher: scope.$watch(compareWithExp, watchFn)
                            };
                        }
                        data.watchFn(scope.$eval(compareWithExp));
                    }

                    function removeScope(e) {
                        var removedScope = e.targetScope;
                        var index = linkedScopes.indexOf(removedScope);
                        linkedScopes.splice(index, 1);
                        instances.splice(index, 1);
                        if (linkedScopes.length) {
                            var newWatchScope = linkedScopes[0];
                            angular.forEach(expToData, function(data) {
                                if (data.scope === removedScope) {
                                    data.watcher = newWatchScope.$watch(data.compareWithExp, data.watchFn);
                                    data.scope = newWatchScope;
                                }
                            });
                        } else {
                            expToData = {};
                        }
                    }
                }
            };
        }]);
angular.module('ui.bootstrap.timepicker', [])

    .constant('uibTimepickerConfig', {
        hourStep: 1,
        minuteStep: 1,
        secondStep: 1,
        showMeridian: true,
        showSeconds: false,
        meridians: null,
        readonlyInput: false,
        mousewheel: true,
        arrowkeys: true,
        showSpinners: true,
        templateUrl: 'uib/template/timepicker/timepicker.html'
    })

    .controller('UibTimepickerController', ['$scope', '$element', '$attrs', '$parse', '$log', '$locale', 'uibTimepickerConfig', function($scope, $element, $attrs, $parse, $log, $locale, timepickerConfig) {
        var hoursModelCtrl, minutesModelCtrl, secondsModelCtrl;
        var selected = new Date(),
            watchers = [],
            ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
            meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS,
            padHours = angular.isDefined($attrs.padHours) ? $scope.$parent.$eval($attrs.padHours) : true;

        $scope.tabindex = angular.isDefined($attrs.tabindex) ? $attrs.tabindex : 0;
        $element.removeAttr('tabindex');

        this.init = function(ngModelCtrl_, inputs) {
            ngModelCtrl = ngModelCtrl_;
            ngModelCtrl.$render = this.render;

            ngModelCtrl.$formatters.unshift(function(modelValue) {
                return modelValue ? new Date(modelValue) : null;
            });

            var hoursInputEl = inputs.eq(0),
                minutesInputEl = inputs.eq(1),
                secondsInputEl = inputs.eq(2);

            hoursModelCtrl = hoursInputEl.controller('ngModel');
            minutesModelCtrl = minutesInputEl.controller('ngModel');
            secondsModelCtrl = secondsInputEl.controller('ngModel');

            var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepickerConfig.mousewheel;

            if (mousewheel) {
                this.setupMousewheelEvents(hoursInputEl, minutesInputEl, secondsInputEl);
            }

            var arrowkeys = angular.isDefined($attrs.arrowkeys) ? $scope.$parent.$eval($attrs.arrowkeys) : timepickerConfig.arrowkeys;
            if (arrowkeys) {
                this.setupArrowkeyEvents(hoursInputEl, minutesInputEl, secondsInputEl);
            }

            $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : timepickerConfig.readonlyInput;
            this.setupInputEvents(hoursInputEl, minutesInputEl, secondsInputEl);
        };

        var hourStep = timepickerConfig.hourStep;
        if ($attrs.hourStep) {
            watchers.push($scope.$parent.$watch($parse($attrs.hourStep), function(value) {
                hourStep = +value;
            }));
        }

        var minuteStep = timepickerConfig.minuteStep;
        if ($attrs.minuteStep) {
            watchers.push($scope.$parent.$watch($parse($attrs.minuteStep), function(value) {
                minuteStep = +value;
            }));
        }

        var min;
        watchers.push($scope.$parent.$watch($parse($attrs.min), function(value) {
            var dt = new Date(value);
            min = isNaN(dt) ? undefined : dt;
        }));

        var max;
        watchers.push($scope.$parent.$watch($parse($attrs.max), function(value) {
            var dt = new Date(value);
            max = isNaN(dt) ? undefined : dt;
        }));

        var disabled = false;
        if ($attrs.ngDisabled) {
            watchers.push($scope.$parent.$watch($parse($attrs.ngDisabled), function(value) {
                disabled = value;
            }));
        }

        $scope.noIncrementHours = function() {
            var incrementedSelected = addMinutes(selected, hourStep * 60);
            return disabled || incrementedSelected > max ||
                incrementedSelected < selected && incrementedSelected < min;
        };

        $scope.noDecrementHours = function() {
            var decrementedSelected = addMinutes(selected, -hourStep * 60);
            return disabled || decrementedSelected < min ||
                decrementedSelected > selected && decrementedSelected > max;
        };

        $scope.noIncrementMinutes = function() {
            var incrementedSelected = addMinutes(selected, minuteStep);
            return disabled || incrementedSelected > max ||
                incrementedSelected < selected && incrementedSelected < min;
        };

        $scope.noDecrementMinutes = function() {
            var decrementedSelected = addMinutes(selected, -minuteStep);
            return disabled || decrementedSelected < min ||
                decrementedSelected > selected && decrementedSelected > max;
        };

        $scope.noIncrementSeconds = function() {
            var incrementedSelected = addSeconds(selected, secondStep);
            return disabled || incrementedSelected > max ||
                incrementedSelected < selected && incrementedSelected < min;
        };

        $scope.noDecrementSeconds = function() {
            var decrementedSelected = addSeconds(selected, -secondStep);
            return disabled || decrementedSelected < min ||
                decrementedSelected > selected && decrementedSelected > max;
        };

        $scope.noToggleMeridian = function() {
            if (selected.getHours() < 12) {
                return disabled || addMinutes(selected, 12 * 60) > max;
            }

            return disabled || addMinutes(selected, -12 * 60) < min;
        };

        var secondStep = timepickerConfig.secondStep;
        if ($attrs.secondStep) {
            watchers.push($scope.$parent.$watch($parse($attrs.secondStep), function(value) {
                secondStep = +value;
            }));
        }

        $scope.showSeconds = timepickerConfig.showSeconds;
        if ($attrs.showSeconds) {
            watchers.push($scope.$parent.$watch($parse($attrs.showSeconds), function(value) {
                $scope.showSeconds = !!value;
            }));
        }

        // 12H / 24H mode
        $scope.showMeridian = timepickerConfig.showMeridian;
        if ($attrs.showMeridian) {
            watchers.push($scope.$parent.$watch($parse($attrs.showMeridian), function(value) {
                $scope.showMeridian = !!value;

                if (ngModelCtrl.$error.time) {
                    // Evaluate from template
                    var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
                    if (angular.isDefined(hours) && angular.isDefined(minutes)) {
                        selected.setHours(hours);
                        refresh();
                    }
                } else {
                    updateTemplate();
                }
            }));
        }

        // Get $scope.hours in 24H mode if valid
        function getHoursFromTemplate() {
            var hours = +$scope.hours;
            var valid = $scope.showMeridian ? hours > 0 && hours < 13 :
                hours >= 0 && hours < 24;
            if (!valid || $scope.hours === '') {
                return undefined;
            }

            if ($scope.showMeridian) {
                if (hours === 12) {
                    hours = 0;
                }
                if ($scope.meridian === meridians[1]) {
                    hours = hours + 12;
                }
            }
            return hours;
        }

        function getMinutesFromTemplate() {
            var minutes = +$scope.minutes;
            var valid = minutes >= 0 && minutes < 60;
            if (!valid || $scope.minutes === '') {
                return undefined;
            }
            return minutes;
        }

        function getSecondsFromTemplate() {
            var seconds = +$scope.seconds;
            return seconds >= 0 && seconds < 60 ? seconds : undefined;
        }

        function pad(value, noPad) {
            if (value === null) {
                return '';
            }

            return angular.isDefined(value) && value.toString().length < 2 && !noPad ?
                '0' + value : value.toString();
        }

        // Respond on mousewheel spin
        this.setupMousewheelEvents = function(hoursInputEl, minutesInputEl, secondsInputEl) {
            var isScrollingUp = function(e) {
                if (e.originalEvent) {
                    e = e.originalEvent;
                }
                //pick correct delta variable depending on event
                var delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
                return e.detail || delta > 0;
            };

            hoursInputEl.on('mousewheel wheel', function(e) {
                if (!disabled) {
                    $scope.$apply(isScrollingUp(e) ? $scope.incrementHours() : $scope.decrementHours());
                }
                e.preventDefault();
            });

            minutesInputEl.on('mousewheel wheel', function(e) {
                if (!disabled) {
                    $scope.$apply(isScrollingUp(e) ? $scope.incrementMinutes() : $scope.decrementMinutes());
                }
                e.preventDefault();
            });

            secondsInputEl.on('mousewheel wheel', function(e) {
                if (!disabled) {
                    $scope.$apply(isScrollingUp(e) ? $scope.incrementSeconds() : $scope.decrementSeconds());
                }
                e.preventDefault();
            });
        };

        // Respond on up/down arrowkeys
        this.setupArrowkeyEvents = function(hoursInputEl, minutesInputEl, secondsInputEl) {
            hoursInputEl.on('keydown', function(e) {
                if (!disabled) {
                    if (e.which === 38) { // up
                        e.preventDefault();
                        $scope.incrementHours();
                        $scope.$apply();
                    } else if (e.which === 40) { // down
                        e.preventDefault();
                        $scope.decrementHours();
                        $scope.$apply();
                    }
                }
            });

            minutesInputEl.on('keydown', function(e) {
                if (!disabled) {
                    if (e.which === 38) { // up
                        e.preventDefault();
                        $scope.incrementMinutes();
                        $scope.$apply();
                    } else if (e.which === 40) { // down
                        e.preventDefault();
                        $scope.decrementMinutes();
                        $scope.$apply();
                    }
                }
            });

            secondsInputEl.on('keydown', function(e) {
                if (!disabled) {
                    if (e.which === 38) { // up
                        e.preventDefault();
                        $scope.incrementSeconds();
                        $scope.$apply();
                    } else if (e.which === 40) { // down
                        e.preventDefault();
                        $scope.decrementSeconds();
                        $scope.$apply();
                    }
                }
            });
        };

        this.setupInputEvents = function(hoursInputEl, minutesInputEl, secondsInputEl) {
            if ($scope.readonlyInput) {
                $scope.updateHours = angular.noop;
                $scope.updateMinutes = angular.noop;
                $scope.updateSeconds = angular.noop;
                return;
            }

            var invalidate = function(invalidHours, invalidMinutes, invalidSeconds) {
                ngModelCtrl.$setViewValue(null);
                ngModelCtrl.$setValidity('time', false);
                if (angular.isDefined(invalidHours)) {
                    $scope.invalidHours = invalidHours;
                    if (hoursModelCtrl) {
                        hoursModelCtrl.$setValidity('hours', false);
                    }
                }

                if (angular.isDefined(invalidMinutes)) {
                    $scope.invalidMinutes = invalidMinutes;
                    if (minutesModelCtrl) {
                        minutesModelCtrl.$setValidity('minutes', false);
                    }
                }

                if (angular.isDefined(invalidSeconds)) {
                    $scope.invalidSeconds = invalidSeconds;
                    if (secondsModelCtrl) {
                        secondsModelCtrl.$setValidity('seconds', false);
                    }
                }
            };

            $scope.updateHours = function() {
                var hours = getHoursFromTemplate(),
                    minutes = getMinutesFromTemplate();

                ngModelCtrl.$setDirty();

                if (angular.isDefined(hours) && angular.isDefined(minutes)) {
                    selected.setHours(hours);
                    selected.setMinutes(minutes);
                    if (selected < min || selected > max) {
                        invalidate(true);
                    } else {
                        refresh('h');
                    }
                } else {
                    invalidate(true);
                }
            };

            hoursInputEl.on('blur', function(e) {
                ngModelCtrl.$setTouched();
                if (modelIsEmpty()) {
                    makeValid();
                } else if ($scope.hours === null || $scope.hours === '') {
                    invalidate(true);
                } else if (!$scope.invalidHours && $scope.hours < 10) {
                    $scope.$apply(function() {
                        $scope.hours = pad($scope.hours, !padHours);
                    });
                }
            });

            $scope.updateMinutes = function() {
                var minutes = getMinutesFromTemplate(),
                    hours = getHoursFromTemplate();

                ngModelCtrl.$setDirty();

                if (angular.isDefined(minutes) && angular.isDefined(hours)) {
                    selected.setHours(hours);
                    selected.setMinutes(minutes);
                    if (selected < min || selected > max) {
                        invalidate(undefined, true);
                    } else {
                        refresh('m');
                    }
                } else {
                    invalidate(undefined, true);
                }
            };

            minutesInputEl.on('blur', function(e) {
                ngModelCtrl.$setTouched();
                if (modelIsEmpty()) {
                    makeValid();
                } else if ($scope.minutes === null) {
                    invalidate(undefined, true);
                } else if (!$scope.invalidMinutes && $scope.minutes < 10) {
                    $scope.$apply(function() {
                        $scope.minutes = pad($scope.minutes);
                    });
                }
            });

            $scope.updateSeconds = function() {
                var seconds = getSecondsFromTemplate();

                ngModelCtrl.$setDirty();

                if (angular.isDefined(seconds)) {
                    selected.setSeconds(seconds);
                    refresh('s');
                } else {
                    invalidate(undefined, undefined, true);
                }
            };

            secondsInputEl.on('blur', function(e) {
                if (modelIsEmpty()) {
                    makeValid();
                } else if (!$scope.invalidSeconds && $scope.seconds < 10) {
                    $scope.$apply( function() {
                        $scope.seconds = pad($scope.seconds);
                    });
                }
            });

        };

        this.render = function() {
            var date = ngModelCtrl.$viewValue;

            if (isNaN(date)) {
                ngModelCtrl.$setValidity('time', false);
                $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
            } else {
                if (date) {
                    selected = date;
                }

                if (selected < min || selected > max) {
                    ngModelCtrl.$setValidity('time', false);
                    $scope.invalidHours = true;
                    $scope.invalidMinutes = true;
                } else {
                    makeValid();
                }
                updateTemplate();
            }
        };

        // Call internally when we know that model is valid.
        function refresh(keyboardChange) {
            makeValid();
            ngModelCtrl.$setViewValue(new Date(selected));
            updateTemplate(keyboardChange);
        }

        function makeValid() {
            if (hoursModelCtrl) {
                hoursModelCtrl.$setValidity('hours', true);
            }

            if (minutesModelCtrl) {
                minutesModelCtrl.$setValidity('minutes', true);
            }

            if (secondsModelCtrl) {
                secondsModelCtrl.$setValidity('seconds', true);
            }

            ngModelCtrl.$setValidity('time', true);
            $scope.invalidHours = false;
            $scope.invalidMinutes = false;
            $scope.invalidSeconds = false;
        }

        function updateTemplate(keyboardChange) {
            if (!ngModelCtrl.$modelValue) {
                $scope.hours = null;
                $scope.minutes = null;
                $scope.seconds = null;
                $scope.meridian = meridians[0];
            } else {
                var hours = selected.getHours(),
                    minutes = selected.getMinutes(),
                    seconds = selected.getSeconds();

                if ($scope.showMeridian) {
                    hours = hours === 0 || hours === 12 ? 12 : hours % 12; // Convert 24 to 12 hour system
                }

                $scope.hours = keyboardChange === 'h' ? hours : pad(hours, !padHours);
                if (keyboardChange !== 'm') {
                    $scope.minutes = pad(minutes);
                }
                $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];

                if (keyboardChange !== 's') {
                    $scope.seconds = pad(seconds);
                }
                $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
            }
        }

        function addSecondsToSelected(seconds) {
            selected = addSeconds(selected, seconds);
            refresh();
        }

        function addMinutes(selected, minutes) {
            return addSeconds(selected, minutes*60);
        }

        function addSeconds(date, seconds) {
            var dt = new Date(date.getTime() + seconds * 1000);
            var newDate = new Date(date);
            newDate.setHours(dt.getHours(), dt.getMinutes(), dt.getSeconds());
            return newDate;
        }

        function modelIsEmpty() {
            return ($scope.hours === null || $scope.hours === '') &&
                ($scope.minutes === null || $scope.minutes === '') &&
                (!$scope.showSeconds || $scope.showSeconds && ($scope.seconds === null || $scope.seconds === ''));
        }

        $scope.showSpinners = angular.isDefined($attrs.showSpinners) ?
            $scope.$parent.$eval($attrs.showSpinners) : timepickerConfig.showSpinners;

        $scope.incrementHours = function() {
            if (!$scope.noIncrementHours()) {
                addSecondsToSelected(hourStep * 60 * 60);
            }
        };

        $scope.decrementHours = function() {
            if (!$scope.noDecrementHours()) {
                addSecondsToSelected(-hourStep * 60 * 60);
            }
        };

        $scope.incrementMinutes = function() {
            if (!$scope.noIncrementMinutes()) {
                addSecondsToSelected(minuteStep * 60);
            }
        };

        $scope.decrementMinutes = function() {
            if (!$scope.noDecrementMinutes()) {
                addSecondsToSelected(-minuteStep * 60);
            }
        };

        $scope.incrementSeconds = function() {
            if (!$scope.noIncrementSeconds()) {
                addSecondsToSelected(secondStep);
            }
        };

        $scope.decrementSeconds = function() {
            if (!$scope.noDecrementSeconds()) {
                addSecondsToSelected(-secondStep);
            }
        };

        $scope.toggleMeridian = function() {
            var minutes = getMinutesFromTemplate(),
                hours = getHoursFromTemplate();

            if (!$scope.noToggleMeridian()) {
                if (angular.isDefined(minutes) && angular.isDefined(hours)) {
                    addSecondsToSelected(12 * 60 * (selected.getHours() < 12 ? 60 : -60));
                } else {
                    $scope.meridian = $scope.meridian === meridians[0] ? meridians[1] : meridians[0];
                }
            }
        };

        $scope.blur = function() {
            ngModelCtrl.$setTouched();
        };

        $scope.$on('$destroy', function() {
            while (watchers.length) {
                watchers.shift()();
            }
        });
    }])

    .directive('uibTimepicker', ['uibTimepickerConfig', function(uibTimepickerConfig) {
        console.log('fired');
        return {
            require: ['uibTimepicker', '?^ngModel'],
            restrict: 'A',
            controller: 'UibTimepickerController',
            controllerAs: 'timepicker',
            scope: {},
            templateUrl: function(element, attrs) {
                return attrs.templateUrl || uibTimepickerConfig.templateUrl;
            },
            link: function(scope, element, attrs, ctrls) {
                var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                if (ngModelCtrl) {
                    timepickerCtrl.init(ngModelCtrl, element.find('input'));
                }
            }
        };
    }]);

angular.module("uib/template/modal/window.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("uib/template/modal/window.html",
        "<div class=\"modal-dialog {{size ? 'modal-' + size : ''}}\"><div class=\"modal-content\" uib-modal-transclude></div></div>\n" +
        "");
}]);

angular.module("uib/template/datepickerPopup/popup.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("uib/template/datepickerPopup/popup.html",
        "<ul role=\"presentation\" class=\"uib-datepicker-popup dropdown-menu uib-position-measure\" dropdown-nested ng-if=\"isOpen\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n" +
        "  <li ng-transclude></li>\n" +
        "  <li ng-if=\"showButtonBar\" class=\"uib-button-bar\">\n" +
        "    <span class=\"btn-group pull-left\">\n" +
        "      <button type=\"button\" class=\"btn btn-sm btn-info uib-datepicker-current\" ng-click=\"select('today', $event)\" ng-disabled=\"isDisabled('today')\">{{ getText('current') }}</button>\n" +
        "      <button type=\"button\" class=\"btn btn-sm btn-danger uib-clear\" ng-click=\"select(null, $event)\">{{ getText('clear') }}</button>\n" +
        "    </span>\n" +
        "    <button type=\"button\" class=\"btn btn-sm btn-success pull-right uib-close\" ng-click=\"close($event)\">{{ getText('close') }}</button>\n" +
        "  </li>\n" +
        "</ul>\n" +
        "");
}]);

angular.module("uib/template/datepicker/datepicker.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("uib/template/datepicker/datepicker.html",
        "<div ng-switch=\"datepickerMode\">\n" +
        "  <div uib-daypicker ng-switch-when=\"day\" tabindex=\"0\" class=\"uib-daypicker\"></div>\n" +
        "  <div uib-monthpicker ng-switch-when=\"month\" tabindex=\"0\" class=\"uib-monthpicker\"></div>\n" +
        "  <div uib-yearpicker ng-switch-when=\"year\" tabindex=\"0\" class=\"uib-yearpicker\"></div>\n" +
        "</div>\n" +
        "");
}]);

angular.module("uib/template/datepicker/day.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("uib/template/datepicker/day.html",
        "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
        "  <thead>\n" +
        "    <tr>\n" +
        "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></i><span class=\"sr-only\">previous</span></button></th>\n" +
        "      <th colspan=\"{{::5 + showWeeks}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
        "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></i><span class=\"sr-only\">next</span></button></th>\n" +
        "    </tr>\n" +
        "    <tr>\n" +
        "      <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n" +
        "      <th ng-repeat=\"label in ::labels track by $index\" class=\"text-center\"><small aria-label=\"{{::label.full}}\">{{::label.abbr}}</small></th>\n" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>\n" +
        "    <tr class=\"uib-weeks\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
        "      <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
        "      <td ng-repeat=\"dt in row\" class=\"uib-day text-center\" role=\"gridcell\"\n" +
        "        id=\"{{::dt.uid}}\"\n" +
        "        ng-class=\"::dt.customClass\">\n" +
        "        <button type=\"button\" class=\"btn btn-default btn-sm\"\n" +
        "          uib-is-class=\"\n" +
        "            'btn-info' for selectedDt,\n" +
        "            'active' for activeDt\n" +
        "            on dt\"\n" +
        "          ng-click=\"select(dt.date)\"\n" +
        "          ng-disabled=\"::dt.disabled\"\n" +
        "          tabindex=\"-1\"><span ng-class=\"::{'text-muted': dt.secondary, 'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "");
}]);

angular.module("uib/template/datepicker/month.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("uib/template/datepicker/month.html",
        "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
        "  <thead>\n" +
        "    <tr>\n" +
        "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></i><span class=\"sr-only\">previous</span></button></th>\n" +
        "      <th colspan=\"{{::yearHeaderColspan}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
        "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></i><span class=\"sr-only\">next</span></i></button></th>\n" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>\n" +
        "    <tr class=\"uib-months\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
        "      <td ng-repeat=\"dt in row\" class=\"uib-month text-center\" role=\"gridcell\"\n" +
        "        id=\"{{::dt.uid}}\"\n" +
        "        ng-class=\"::dt.customClass\">\n" +
        "        <button type=\"button\" class=\"btn btn-default\"\n" +
        "          uib-is-class=\"\n" +
        "            'btn-info' for selectedDt,\n" +
        "            'active' for activeDt\n" +
        "            on dt\"\n" +
        "          ng-click=\"select(dt.date)\"\n" +
        "          ng-disabled=\"::dt.disabled\"\n" +
        "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "");
}]);

angular.module("uib/template/datepicker/year.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("uib/template/datepicker/year.html",
        "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
        "  <thead>\n" +
        "    <tr>\n" +
        "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></i><span class=\"sr-only\">previous</span></button></th>\n" +
        "      <th colspan=\"{{::columns - 2}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
        "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></i><span class=\"sr-only\">next</span></button></th>\n" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>\n" +
        "    <tr class=\"uib-years\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
        "      <td ng-repeat=\"dt in row\" class=\"uib-year text-center\" role=\"gridcell\"\n" +
        "        id=\"{{::dt.uid}}\"\n" +
        "        ng-class=\"::dt.customClass\">\n" +
        "        <button type=\"button\" class=\"btn btn-default\"\n" +
        "          uib-is-class=\"\n" +
        "            'btn-info' for selectedDt,\n" +
        "            'active' for activeDt\n" +
        "            on dt\"\n" +
        "          ng-click=\"select(dt.date)\"\n" +
        "          ng-disabled=\"::dt.disabled\"\n" +
        "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "");
}]);

angular.module("uib/template/timepicker/timepicker.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("uib/template/timepicker/timepicker.html",
        "<table class=\"uib-timepicker\">\n" +
        "  <tbody>\n" +
        "    <tr class=\"text-center\" ng-show=\"::showSpinners\">\n" +
        "      <td class=\"uib-increment hours\"><a ng-click=\"incrementHours()\" ng-class=\"{disabled: noIncrementHours()}\" class=\"btn btn-link\" ng-disabled=\"noIncrementHours()\" tabindex=\"-1\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
        "      <td>&nbsp;</td>\n" +
        "      <td class=\"uib-increment minutes\"><a ng-click=\"incrementMinutes()\" ng-class=\"{disabled: noIncrementMinutes()}\" class=\"btn btn-link\" ng-disabled=\"noIncrementMinutes()\" tabindex=\"-1\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
        "      <td ng-show=\"showSeconds\">&nbsp;</td>\n" +
        "      <td ng-show=\"showSeconds\" class=\"uib-increment seconds\"><a ng-click=\"incrementSeconds()\" ng-class=\"{disabled: noIncrementSeconds()}\" class=\"btn btn-link\" ng-disabled=\"noIncrementSeconds()\" tabindex=\"-1\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
        "      <td ng-show=\"showMeridian\"></td>\n" +
        "    </tr>\n" +
        "    <tr>\n" +
        "      <td class=\"form-group uib-time hours\" ng-class=\"{'has-error': invalidHours}\">\n" +
        "        <input type=\"text\" placeholder=\"HH\" ng-model=\"hours\" ng-change=\"updateHours()\" class=\"form-control text-center\" ng-readonly=\"::readonlyInput\" maxlength=\"2\" tabindex=\"{{::tabindex}}\" ng-disabled=\"noIncrementHours()\" ng-blur=\"blur()\">\n" +
        "      </td>\n" +
        "      <td class=\"uib-separator\">:</td>\n" +
        "      <td class=\"form-group uib-time minutes\" ng-class=\"{'has-error': invalidMinutes}\">\n" +
        "        <input type=\"text\" placeholder=\"MM\" ng-model=\"minutes\" ng-change=\"updateMinutes()\" class=\"form-control text-center\" ng-readonly=\"::readonlyInput\" maxlength=\"2\" tabindex=\"{{::tabindex}}\" ng-disabled=\"noIncrementMinutes()\" ng-blur=\"blur()\">\n" +
        "      </td>\n" +
        "      <td ng-show=\"showSeconds\" class=\"uib-separator\">:</td>\n" +
        "      <td class=\"form-group uib-time seconds\" ng-class=\"{'has-error': invalidSeconds}\" ng-show=\"showSeconds\">\n" +
        "        <input type=\"text\" placeholder=\"SS\" ng-model=\"seconds\" ng-change=\"updateSeconds()\" class=\"form-control text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\" tabindex=\"{{::tabindex}}\" ng-disabled=\"noIncrementSeconds()\" ng-blur=\"blur()\">\n" +
        "      </td>\n" +
        "      <td ng-show=\"showMeridian\" class=\"uib-time am-pm\"><button type=\"button\" ng-class=\"{disabled: noToggleMeridian()}\" class=\"btn btn-default text-center\" ng-click=\"toggleMeridian()\" ng-disabled=\"noToggleMeridian()\" tabindex=\"{{::tabindex}}\">{{meridian}}</button></td>\n" +
        "    </tr>\n" +
        "    <tr class=\"text-center\" ng-show=\"::showSpinners\">\n" +
        "      <td class=\"uib-decrement hours\"><a ng-click=\"decrementHours()\" ng-class=\"{disabled: noDecrementHours()}\" class=\"btn btn-link\" ng-disabled=\"noDecrementHours()\" tabindex=\"-1\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
        "      <td>&nbsp;</td>\n" +
        "      <td class=\"uib-decrement minutes\"><a ng-click=\"decrementMinutes()\" ng-class=\"{disabled: noDecrementMinutes()}\" class=\"btn btn-link\" ng-disabled=\"noDecrementMinutes()\" tabindex=\"-1\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
        "      <td ng-show=\"showSeconds\">&nbsp;</td>\n" +
        "      <td ng-show=\"showSeconds\" class=\"uib-decrement seconds\"><a ng-click=\"decrementSeconds()\" ng-class=\"{disabled: noDecrementSeconds()}\" class=\"btn btn-link\" ng-disabled=\"noDecrementSeconds()\" tabindex=\"-1\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
        "      <td ng-show=\"showMeridian\"></td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "");
}]);
angular.module('ui.bootstrap.position').run(function() {!angular.$$csp().noInlineStyle && !angular.$$uibPositionCss && angular.element(document).find('head').prepend('<style type="text/css">.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}</style>'); angular.$$uibPositionCss = true; });
angular.module('ui.bootstrap.datepickerPopup').run(function() {!angular.$$csp().noInlineStyle && !angular.$$uibDatepickerpopupCss && angular.element(document).find('head').prepend('<style type="text/css">.uib-datepicker-popup.dropdown-menu{display:block;float:none;margin:0;}.uib-button-bar{padding:10px 9px 2px;}</style>'); angular.$$uibDatepickerpopupCss = true; });
angular.module('ui.bootstrap.datepicker').run(function() {!angular.$$csp().noInlineStyle && !angular.$$uibDatepickerCss && angular.element(document).find('head').prepend('<style type="text/css">.uib-datepicker .uib-title{width:100%;}.uib-day button,.uib-month button,.uib-year button{min-width:100%;}.uib-left,.uib-right{width:100%}</style>'); angular.$$uibDatepickerCss = true; });
angular.module('ui.bootstrap.timepicker').run(function() {!angular.$$csp().noInlineStyle && !angular.$$uibTimepickerCss && angular.element(document).find('head').prepend('<style type="text/css">.uib-time input{width:50px;}</style>'); angular.$$uibTimepickerCss = true; });