(function(angular) {

  'use strict';

  var idIncrementor = 0;

  angular
    .module('mwl.confirm', [
      'ngSanitize',
      'ui.bootstrap.position',
      'offClick'
    ])

    .controller('PopoverConfirmCtrl', function($scope, $element, $compile, $document, $window, $position, confirmationPopover) {
      var vm = this;
      vm.defaults = confirmationPopover;
      vm.placement = vm.placement || vm.defaults.placement;

      if (!$element.attr('id')) {
        $element.attr('id', 'popover-trigger-' + idIncrementor++);
      }

      $scope.triggerSelector = '#' + $element.attr('id'); //eslint-disable-line angular/ng_controller_as

      var template = [
        '<div class="popover" ng-class="vm.placement" off-click="vm.hidePopover()" off-click-filter="triggerSelector">',
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
                'ng-click="vm.onCancel(); vm.hidePopover()" ng-bind-html="vm.cancelText || vm.defaults.cancelText"></button>',
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
        var position = $position.positionElements($element, popover, vm.placement, true);
        position.top += 'px';
        position.left += 'px';
        popover.css(position);
      }

      function showPopover() {
        if (!vm.isVisible) {
          popover.css({display: 'block'});
          positionPopover();
          vm.isVisible = true;
        }
      }

      function hidePopover() {
        if (vm.isVisible) {
          popover.css({display: 'none'});
          vm.isVisible = false;
        }
      }

      function togglePopover() {
        if (!vm.isVisible) {
          showPopover();
        } else {
          hidePopover();
        }
      }

      vm.showPopover = showPopover;
      vm.hidePopover = hidePopover;
      vm.togglePopover = togglePopover;

      $element.bind('click', togglePopover);

      $window.addEventListener('resize', positionPopover);

      var unbindOnDestroy = $scope.$on('$destroy', function() {
        unbindOnDestroy();
        popover.remove();
        $element.unbind('click', togglePopover);
        $window.removeEventListener('resize', positionPopover);
      });

    })

    .directive('mwlConfirm', function() {

      return {
        restrict: 'EA',
        controller: 'PopoverConfirmController as vm',
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
          cancelButtonType: '@'
        }
      };
    })

    .provider('confirmationPopover', function() {

      var defaults = {
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        confirmButtonType: 'success',
        cancelButtonType: 'default',
        placement: 'top'
      };

      var provider = this;

      this.setDefaultConfirmText = function(value) {
        defaults.confirmText = value;
        return provider;
      };

      this.setDefaultCancelText = function(value) {
        defaults.cancelText = value;
        return provider;
      };

      this.setDefaultConfirmButtonType = function(value) {
        defaults.confirmButtonType = value;
        return provider;
      };

      this.setDefaultCancelButtonType = function(value) {
        defaults.cancelButtonType = value;
        return provider;
      };

      this.setDefaultPlacement = function(value) {
        defaults.placement = value;
        return provider;
      };

      this.$get = function() {
        return defaults;
      };

    });

}(angular));
