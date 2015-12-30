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

  .controller('PopoverConfirmCtrl', function($scope, $element, $compile, $document, $window, $timeout,
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

  })

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
