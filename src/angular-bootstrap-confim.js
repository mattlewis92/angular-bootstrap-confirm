(function(angular) {

  'use strict';

  var idIncrementor = 0;

  angular
    .module('mwl.confirm', [
      'ngSanitize',
      'ui.bootstrap.position',
      'offClick'
    ])

    .controller('PopoverConfirmController', function($scope, $element, $compile, $document, $window, $position) {
      var vm = this;
      vm.placement = vm.placement || 'top';

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
                '<button class="btn btn-block" ng-class="\'btn-\' + (vm.confirmButtonType || \'danger\')" ng-click="vm.onConfirm(); vm.hidePopover()" ng-bind-html="vm.confirmText || \'Confirm\'"></button>',
              '</div>',
              '<div class="col-xs-6">',
                '<button class="btn btn-block" ng-class="\'btn-\' + (vm.cancelButtonType || \'default\')" ng-click="vm.onCancel(); vm.hidePopover()" ng-bind-html="vm.cancelText || \'Cancel\'"></button>',
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
    });

})(angular);
