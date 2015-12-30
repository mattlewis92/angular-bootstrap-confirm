/**
   * angular-bootstrap-confirm - Displays a bootstrap confirmation popover when clicking the given element.
   * @version v1.0.0
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

	  .controller('PopoverConfirmCtrl', ["$scope", "$element", "$compile", "$document", "$window", "$timeout", "$injector", "$templateRequest", "confirmationPopoverDefaults", function($scope, $element, $compile, $document, $window, $timeout,
	                                             $injector, $templateRequest, confirmationPopoverDefaults) {
	    var vm = this;
	    vm.defaults = confirmationPopoverDefaults;
	    vm.popoverPlacement = vm.placement || vm.defaults.placement;
	    var positionServiceName = $injector.has('$uibPosition') ? '$uibPosition' : '$position';
	    var positionService = $injector.get(positionServiceName);
	    var templateUrl = vm.templateUrl || confirmationPopoverDefaults.templateUrl;

	    $templateRequest(templateUrl).then(function(template) {
	      vm.popover = angular.element(template);
	      vm.popover.css('display', 'none');
	      $compile(vm.popover)($scope);
	      $document.find('body').append(vm.popover);
	    });

	    vm.isVisible = false;

	    function positionPopover() {
	      var position = positionService.positionElements($element, vm.popover, vm.popoverPlacement, true);
	      position.top += 'px';
	      position.left += 'px';
	      vm.popover.css(position);
	    }

	    function applyFocus(target) {
	      var shouldFocus = angular.isDefined(vm.focusConfirmButton) ? vm.focusConfirmButton : vm.defaults.focusConfirmButton;
	      if (shouldFocus) {
	        target[0].focus();
	      }
	    }

	    function showPopover() {
	      if (!vm.isVisible && !vm.isDisabled) {
	        vm.popover.css({display: 'block'});
	        positionPopover();
	        applyFocus(vm.popover[0].getElementsByClassName('confirm-button'));
	        vm.isVisible = true;
	      }
	      vm.isOpen = true;
	    }

	    function hidePopover(focusElement) {
	      if (vm.isVisible) {
	        vm.popover.css({display: 'none'});
	        vm.isVisible = false;
	        if (focusElement) {
	          applyFocus($element);
	        }
	      }
	      vm.isOpen = false;
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

	    $scope.$watch('vm.isOpen', function(isOpen) {
	      $timeout(function() { //timeout required so that documentClick() event doesn't fire and close it
	        if (isOpen) {
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
	    });

	  }])

	  .directive('mwlConfirm', function() {

	    return {
	      restrict: 'EA',
	      controller: 'PopoverConfirmCtrl as vm',
	      bindToController: true,
	      scope: {
	        confirmText: '@',
	        cancelText: '@',
	        message: '@',
	        title: '@',
	        placement: '@',
	        onConfirm: '&',
	        onCancel: '&',
	        confirmButtonType: '@',
	        cancelButtonType: '@',
	        isOpen: '=?',
	        focusConfirmButton: '=',
	        templateUrl: '@',
	        isDisabled: '='
	      }
	    };

	  })

	  .value('confirmationPopoverDefaults', {
	    confirmText: 'Confirm',
	    cancelText: 'Cancel',
	    confirmButtonType: 'success',
	    cancelButtonType: 'default',
	    placement: 'top',
	    focusConfirmButton: true,
	    templateUrl: DEFAULT_POPOVER_URL
	  })

	  .name;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "<div class=\"popover\" ng-class=\"vm.popoverPlacement\">\n  <div class=\"arrow\"></div>\n  <h3 class=\"popover-title\" ng-bind-html=\"vm.title\"></h3>\n  <div class=\"popover-content\">\n    <p ng-bind-html=\"vm.message\"></p>\n    <div class=\"row\">\n      <div class=\"col-xs-6\">\n        <button\n          class=\"btn btn-block confirm-button\"\n          ng-class=\"'btn-' + (vm.confirmButtonType || vm.defaults.confirmButtonType)\"\n          ng-click=\"vm.onConfirm(); vm.hidePopover()\"\n          ng-bind-html=\"vm.confirmText || vm.defaults.confirmText\">\n        </button>\n      </div>\n      <div class=\"col-xs-6\">\n        <button\n          class=\"btn btn-block cancel-button\"\n          ng-class=\"'btn-' + (vm.cancelButtonType || vm.defaults.cancelButtonType)\"\n          ng-click=\"vm.onCancel(); vm.hidePopover(true)\"\n          ng-bind-html=\"vm.cancelText || vm.defaults.cancelText\">\n        </button>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])
});
;