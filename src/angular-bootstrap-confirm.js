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
                                             $injector, $templateRequest, $parse, confirmationPopoverDefaults) {
    var vm = this;
    vm.defaults = confirmationPopoverDefaults;
    vm.$attrs = $attrs;
    var positionServiceName = $injector.has('$uibPosition') ? '$uibPosition' : '$position';
    var positionService = $injector.get(positionServiceName);
    var templateUrl = $attrs.templateUrl || confirmationPopoverDefaults.templateUrl;
    var isOpen = $attrs.isOpen ? $parse($attrs.isOpen) : null;
    var isDisabled = $attrs.isDisabled ? $parse($attrs.isDisabled) : null;
    var focusConfirmButton = $attrs.focusConfirmButton ? $parse($attrs.focusConfirmButton) : null;
    var popoverScope = $rootScope.$new(true);
    popoverScope.vm = vm;

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

    function applyFocus(target) {
      var shouldFocus = focusConfirmButton ? focusConfirmButton($scope) : vm.defaults.focusConfirmButton;
      if (shouldFocus) {
        target[0].focus();
      }
    }

    function showPopover() {
      if (!vm.isVisible && (!isDisabled || !isDisabled($scope))) {
        vm.popover.css({display: 'block'});
        positionPopover();
        applyFocus(vm.popover[0].getElementsByClassName('confirm-button'));
        vm.isVisible = true;
        if (isOpen) {
          isOpen.assign($scope, true);
        }
      }
    }

    function hidePopover(focusElement) {
      if (vm.isVisible) {
        vm.popover.css({display: 'none'});
        vm.isVisible = false;
        if (focusElement) {
          applyFocus($element);
        }
        if (isOpen) {
          isOpen.assign($scope, false);
        }
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
      if ($attrs.onConfirm) {
        $parse($attrs.onConfirm)($scope);
      }
    };

    vm.onCancel = function() {
      if ($attrs.onCancel) {
        $parse($attrs.onCancel)($scope);
      }
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
    focusConfirmButton: true,
    templateUrl: DEFAULT_POPOVER_URL
  })

  .name;
