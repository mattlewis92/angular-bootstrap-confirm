'use strict';

var angular = require('angular');
var defaultPopoverTemplate = require('./angular-bootstrap-confirm.html');
require('angular-sanitize');
require('./ui-bootstrap-position');
var DEFAULT_POPOVER_URL = 'angular-bootstrap-confirm.html';

module.exports = angular

  .module('mwl.confirm', [
    'ngSanitize',
    'ui.bootstrap.position'
  ])

  .run(function($templateCache) {
    $templateCache.put(DEFAULT_POPOVER_URL, defaultPopoverTemplate);
  })

  .controller('PopoverConfirmCtrl', function($scope, $rootScope, $element, $attrs, $compile, $document, $window, $timeout,
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

  })

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
