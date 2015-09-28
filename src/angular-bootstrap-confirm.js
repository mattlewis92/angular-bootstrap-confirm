'use strict';

var angular = require('angular');
require('angular-sanitize');
require('./ui-bootstrap-position');

module.exports = angular

  .module('mwl.confirm', [
    'ngSanitize',
    'ui.bootstrap.position'
  ])

  .controller('PopoverConfirmCtrl', function($scope, $element, $compile, $document, $window, $timeout, $position, confirmationPopoverDefaults) {
    var vm = this;
    vm.defaults = confirmationPopoverDefaults;
    vm.popoverPlacement = vm.placement || vm.defaults.placement;

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
      var position = $position.positionElements($element, popover, vm.popoverPlacement, true);
      position.top += 'px';
      position.left += 'px';
      popover.css(position);
    }

    function applyFocus(target) {
      if (vm.handleFocus || vm.defaults.handleFocus) {
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
