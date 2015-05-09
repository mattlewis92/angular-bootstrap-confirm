describe('Confirm popover', function() {

  beforeEach(module('mwl.confirm'));

  beforeEach(module(function($provide) {

    $provide.factory('$position', function() {
      return {
        positionElements: function() {
          return {
            top: 10,
            left: 50
          };
        }
      };
    });

  }));

  describe('PopoverConfirmController', function() {

    var ctrl, scope, element, popover;

    beforeEach(inject(function($controller, $rootScope) {

      scope = $rootScope.$new();
      element = angular.element('<button>Test</button>');
      ctrl = $controller('PopoverConfirmController as vm', {
        $scope: scope,
        $element: element
      });
      popover = $('body').find('.popover:first');

    }));

    afterEach(function() {
      scope.$destroy();
    });

    it('should set an id on the element if it isnt set', function() {
      expect(element.attr('id')).to.be.defined;
      expect(element.attr('id')).to.equal('popover-trigger-0');
    });

    describe('showPopover', function() {

      it('should show the popover', function() {
        expect(popover.is(':visible')).to.be.false;
        scope.vm.showPopover();
        expect(popover.is(':visible')).to.be.true;
      });

    });

    describe('hidePopover', function() {

      it('should hide the popover', function() {
        expect(popover.is(':visible')).to.be.false;
        scope.vm.showPopover();
        expect(popover.is(':visible')).to.be.true;
        scope.vm.hidePopover();
        expect(popover.is(':visible')).to.be.false;
      });

    });

    describe('togglePopover', function() {

      it('should show the popover if hidden', function() {
        expect(popover.is(':visible')).to.be.false;
        scope.vm.togglePopover();
        expect(popover.is(':visible')).to.be.true;
      });

      it('should hide the popover if visible', function() {
        scope.vm.showPopover();
        expect(popover.is(':visible')).to.be.true;
        scope.vm.togglePopover();
        expect(popover.is(':visible')).to.be.false;
      });

    });

    describe('positionPopover', function() {

      beforeEach(function() {
        scope.vm.showPopover();
      });

      it('should set the top css property', function() {
        //TODO
      });

      it('should set the left css property', function() {
        //TODO
      });

    });

    describe('element click', function() {

      it('should show the popover when the element is clicked and the element is hidden', function() {
        expect(popover.is(':visible')).to.be.false;
        $(element).click();
        expect(popover.is(':visible')).to.be.true;
      });

      it('should hide the popover when the element is clicked and the element is visible', function() {
        scope.vm.showPopover();
        expect(popover.is(':visible')).to.be.true;
        $(element).click();
        expect(popover.is(':visible')).to.be.false;
      });

    });

    describe('window resize', function() {

      it('should reposition the popover when the window resizes', function() {
        //TODO
      });

    });

    describe('$destroy', function() {

      it('should remove the popover when the scope is destroyed', function() {
        scope.$destroy();
        expect($('body').find('.popover').size()).to.equal(0);
      });

    });

  });

  describe('mwlConfirmDirective', function() {

    it('should set the default confirm text', function() {

    });

    it('should set the confirm text when specified', function() {

    });

    it('should set the default cancel text', function() {

    });

    it('should set the cancel text when specified', function() {

    });

    it('should set the popover message', function() {

    });

    it('should allow html in the popover message', function() {

    });

    it('should set the popover title', function() {

    });

    it('should allow html in the popover title', function() {

    });

    it('should set the default placement to top', function() {

    });

    it('should set the placement when specified', function() {

    });

    it('should call onConfirm when the confirm button is clicked', function() {

    });

    it('should call onCancel when the cancel button is clicked', function() {

    });

    it('should set the default confirm button class to danger', function() {

    });

    it('should allow html in the confirm button text', function() {

    });

    it('should set confirm button class when specified', function() {

    });

    it('should set the default cancel button class to default', function() {

    });

    it('should set cancel button class when specified', function() {

    });

    it('should allow html in the cancel button text', function() {

    });

    it('should close the popover when another element that isn\'t the popover is clicked', function() {

    });

    it('should keep the popover open when an element inside the popover is clicked', function() {

    });

    it('should close the popover when the confirm button is clicked', function() {

    });

    it('should close the popover when the cancel button is clicked', function() {

    });

    it('should not throw any errors when the default interpolation symbols are changed', function() {

    });

  });

});
