/**
   * angular-bootstrap-confirm - Displays a bootstrap confirmation popover when clicking the given element.
   * @version v2.3.0
   * @link https://github.com/mattlewis92/angular-bootstrap-confirm
   * @license MIT
   */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("angular-sanitize"));
	else if(typeof define === 'function' && define.amd)
		define(["angular", "angular-sanitize"], factory);
	else if(typeof exports === 'object')
		exports["angularBootstrapConfirmModuleName"] = factory(require("angular"), require("angular-sanitize"));
	else
		root["angularBootstrapConfirmModuleName"] = factory(root["angular"], root["angular-sanitize"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(1);
	var defaultPopoverTemplate = __webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(1);
	var DEFAULT_POPOVER_URL = 'angular-bootstrap-confirm.html';

	module.exports = angular

	  .module('mwl.confirm', [
	    'ngSanitize',
	    'ui.bootstrap.position'
	  ])

	  .run(["$templateCache", function($templateCache) {
	    $templateCache.put(DEFAULT_POPOVER_URL, defaultPopoverTemplate);
	  }])

	  .controller('PopoverConfirmCtrl', ["$scope", "$rootScope", "$element", "$attrs", "$compile", "$document", "$window", "$timeout", "$injector", "$templateRequest", "$parse", "$log", "confirmationPopoverDefaults", function($scope, $rootScope, $element, $attrs, $compile, $document, $window, $timeout,
	                                             $injector, $templateRequest, $parse, $log, confirmationPopoverDefaults) {
	    var vm = this;
	    vm.defaults = confirmationPopoverDefaults;
	    vm.$attrs = $attrs;
	    var positionServiceName = $injector.has('$uibPosition') ? '$uibPosition' : '$position';
	    var positionService = $injector.get(positionServiceName);
	    var templateUrl = $attrs.templateUrl || confirmationPopoverDefaults.templateUrl;
	    var popoverScope = $rootScope.$new(true);
	    popoverScope.vm = vm;

	    function assignOuterScopeValue(attributeName, value) {
	      var scopeName = $attrs[attributeName];
	      if (angular.isDefined(scopeName)) {
	        if ($parse(scopeName).assign) {
	          $parse(scopeName).assign($scope, value);
	        } else {
	          $log.warn('Could not set value of ' + attributeName + ' to ' + value + '. This is normally because the value is not a variable.');
	        }
	      }
	    }

	    function evaluateOuterScopeValue(scopeName, defaultValue) {
	      if (angular.isDefined(scopeName)) {
	        return $parse(scopeName)($scope);
	      } else {
	        return defaultValue;
	      }
	    }

	    $templateRequest(templateUrl).then(function(template) {
	      vm.popover = angular.element(template);
	      vm.popover.css('display', 'none');
	      $compile(vm.popover)(popoverScope);
	      $document.find('body').append(vm.popover);
	    });

	    vm.isVisible = false;

	    function positionPopover() {
	      var position = positionService.positionElements($element, vm.popover, $attrs.placement || vm.defaults.placement, true);
	      position.top += 'px';
	      position.left += 'px';
	      vm.popover.css(position);
	    }

	    function applyFocus() {
	      var buttonToFocus = $attrs.focusButton || vm.defaults.focusButton;
	      if (buttonToFocus) {
	        var targetButtonClass = buttonToFocus + '-button';
	        vm.popover[0].getElementsByClassName(targetButtonClass)[0].focus();
	      }
	    }

	    function showPopover() {
	      if (!vm.isVisible && !evaluateOuterScopeValue($attrs.isDisabled, false)) {
	        vm.popover.css({display: 'block'});
	        positionPopover();
	        applyFocus();
	        vm.isVisible = true;
	        assignOuterScopeValue('isOpen', true);
	      }
	    }

	    function hidePopover() {
	      if (vm.isVisible) {
	        vm.popover.css({display: 'none'});
	        vm.isVisible = false;
	        assignOuterScopeValue('isOpen', false);
	      }
	    }

	    function togglePopover() {
	      if (!vm.isVisible) {
	        showPopover();
	      } else {
	        hidePopover();
	      }
	      $scope.$apply();
	    }

	    function documentClick(event) {
	      if (vm.isVisible && !vm.popover[0].contains(event.target) && !$element[0].contains(event.target)) {
	        hidePopover();
	        $scope.$apply();
	      }
	    }

	    vm.showPopover = showPopover;
	    vm.hidePopover = hidePopover;
	    vm.togglePopover = togglePopover;

	    vm.onConfirm = function() {
	      evaluateOuterScopeValue($attrs.onConfirm);
	    };

	    vm.onCancel = function() {
	      evaluateOuterScopeValue($attrs.onCancel);
	    };

	    $scope.$watch($attrs.isOpen, function(newIsOpenValue) {
	      $timeout(function() { //timeout required so that documentClick() event doesn't fire and close it
	        if (newIsOpenValue) {
	          showPopover();
	        } else {
	          hidePopover();
	        }
	      });
	    });

	    $element.bind('click', togglePopover);

	    $window.addEventListener('resize', positionPopover);

	    $document.bind('click', documentClick);
	    $document.bind('touchend', documentClick);

	    $scope.$on('$destroy', function() {
	      vm.popover.remove();
	      $element.unbind('click', togglePopover);
	      $window.removeEventListener('resize', positionPopover);
	      $document.unbind('click', documentClick);
	      $document.unbind('touchend', documentClick);
	      popoverScope.$destroy();
	    });

	  }])

	  .directive('mwlConfirm', function() {

	    return {
	      restrict: 'A',
	      controller: 'PopoverConfirmCtrl'
	    };

	  })

	  .value('confirmationPopoverDefaults', {
	    confirmText: 'Confirm',
	    cancelText: 'Cancel',
	    confirmButtonType: 'success',
	    cancelButtonType: 'default',
	    placement: 'top',
	    focusButton: null,
	    templateUrl: DEFAULT_POPOVER_URL,
	    hideConfirmButton: false,
	    hideCancelButton: false
	  })

	  .name;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "<div\n  class=\"popover\"\n  ng-class=\"[vm.$attrs.placement || vm.defaults.placement, 'popover-' + (vm.$attrs.placement || vm.defaults.placement), vm.$attrs.popoverClass || vm.defaults.popoverClass]\">\n  <div class=\"popover-arrow arrow\"></div>\n  <h3 class=\"popover-title\" ng-bind-html=\"vm.$attrs.title\"></h3>\n  <div class=\"popover-content\">\n    <p ng-bind-html=\"vm.$attrs.message\"></p>\n    <div class=\"row\">\n      <div\n        class=\"col-xs-6\"\n        ng-if=\"!vm.$attrs.hideConfirmButton && !vm.defaults.hideConfirmButton\"\n        ng-class=\"{'col-xs-offset-3': vm.$attrs.hideCancelButton || vm.defaults.hideCancelButton}\">\n        <button\n          class=\"btn btn-block confirm-button\"\n          ng-class=\"'btn-' + (vm.$attrs.confirmButtonType || vm.defaults.confirmButtonType)\"\n          ng-click=\"vm.onConfirm(); vm.hidePopover()\"\n          ng-bind-html=\"vm.$attrs.confirmText || vm.defaults.confirmText\">\n        </button>\n      </div>\n      <div\n        class=\"col-xs-6\"\n        ng-if=\"!vm.$attrs.hideCancelButton && !vm.defaults.hideCancelButton\"\n        ng-class=\"{'col-xs-offset-3': vm.$attrs.hideConfirmButton || vm.defaults.hideConfirmButton}\">\n        <button\n          class=\"btn btn-block cancel-button\"\n          ng-class=\"'btn-' + (vm.$attrs.cancelButtonType || vm.defaults.cancelButtonType)\"\n          ng-click=\"vm.onCancel(); vm.hidePopover()\"\n          ng-bind-html=\"vm.$attrs.cancelText || vm.defaults.cancelText\">\n        </button>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])
});
;