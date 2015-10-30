/**
   * angular-bootstrap-confirm - Displays a bootstrap confirmation popover when clicking the given element.
   * @version v0.5.2
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
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
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
	__webpack_require__(2);
	__webpack_require__(1);

	module.exports = angular

	  .module('mwl.confirm', [
	    'ngSanitize',
	    'ui.bootstrap.position'
	  ])

	  .controller('PopoverConfirmCtrl', ["$scope", "$element", "$compile", "$document", "$window", "$timeout", "$injector", "confirmationPopoverDefaults", function($scope, $element, $compile, $document, $window, $timeout, $injector, confirmationPopoverDefaults) {
	    var vm = this;
	    vm.defaults = confirmationPopoverDefaults;
	    vm.popoverPlacement = vm.placement || vm.defaults.placement;
	    var positionServiceName = $injector.has('$uibPosition') ? '$uibPosition' : '$position';
	    var positionService = $injector.get(positionServiceName);

	    var template = [
	      '<div class="popover" ng-class="vm.popoverPlacement">',
	        '<div class="arrow"></div>',
	        '<h3 class="popover-title" ng-bind-html="vm.title"></h3>',
	        '<div class="popover-content">',
	          '<p ng-bind-html="vm.message"></p>',
	          '<div class="row">',
	            '<div class="col-xs-6">',
	              '<button class="btn btn-block" ng-class="\'btn-\' + (vm.confirmButtonType || vm.defaults.confirmButtonType)" ' +
	              'ng-click="vm.onConfirm(); vm.hidePopover()" ng-bind-html="vm.confirmText || vm.defaults.confirmText"></button>',
	            '</div>',
	            '<div class="col-xs-6">',
	              '<button class="btn btn-block" ng-class="\'btn-\' + (vm.cancelButtonType || vm.defaults.cancelButtonType)" ' +
	              'ng-click="vm.onCancel(); vm.hidePopover(true)" ng-bind-html="vm.cancelText || vm.defaults.cancelText"></button>',
	            '</div>',
	          '</div>',
	        '</div>',
	      '</div>'
	    ].join('\n');

	    var popover = angular.element(template);
	    popover.css('display', 'none');
	    $compile(popover)($scope);
	    $document.find('body').append(popover);

	    vm.isVisible = false;

	    function positionPopover() {
	      var position = positionService.positionElements($element, popover, vm.popoverPlacement, true);
	      position.top += 'px';
	      position.left += 'px';
	      popover.css(position);
	    }

	    function applyFocus(target) {
	      var shouldFocus = angular.isDefined(vm.handleFocus) ? vm.handleFocus : vm.defaults.handleFocus;
	      if (shouldFocus) {
	        target[0].focus();
	      }
	    }

	    function showPopover() {
	      if (!vm.isVisible) {
	        popover.css({display: 'block'});
	        positionPopover();
	        applyFocus(popover.find('button'));
	        vm.isVisible = true;
	      }
	      vm.isOpen = true;
	    }

	    function hidePopover(focusElement) {
	      if (vm.isVisible) {
	        popover.css({display: 'none'});
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
	      if (vm.isVisible && !popover[0].contains(event.target) && !$element[0].contains(event.target)) {
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
	      popover.remove();
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
	        handleFocus: '='
	      }
	    };
	  })

	  .value('confirmationPopoverDefaults', {
	    confirmText: 'Confirm',
	    cancelText: 'Cancel',
	    confirmButtonType: 'success',
	    cancelButtonType: 'default',
	    placement: 'top',
	    handleFocus: true
	  })

	  .name;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;