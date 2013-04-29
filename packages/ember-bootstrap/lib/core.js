var Bootstrap = window.Bootstrap = Ember.Namespace.create();

Ember.Route.reopen({
  events: {
    _modalCloseClick: function(modalView) {
      this.handleModalActionAndDestroy(modalView, modalView.get('closeAction'));
    },

    _modalPrimaryClick: function(modalView) {
      this.handleModalActionAndDestroy(modalView, modalView.get('primaryAction'));
    },

    _modalSecondaryClick: function(modalView) {
      this.handleModalActionAndDestroy(modalView, modalView.get('secondaryAction'));
    }
  },
  
  handleModalActionAndDestroy: function(modalView, action) {
    if (action) {
      var passedTarget = action.match(/(.+)\:/);
      var target = passedTarget ? passedTarget[1] : null;
      var actionName = passedTarget ? action.replace(passedTarget[0], '') : action;
      var result;

      if (target === 'controller') {
        var controller = modalView.get('controller');
        Ember.warn("Callback for modal not found in controller", controller && controller[actionName]);

        if (typeof controller[actionName] === "function") {
          result = controller[actionName](modalView);
        }
      } else if (target === "view") {
        Ember.warn("Callback for modal not found in view", modalView[actionName]);

        if (typeof modalView[actionName] === "function") {
          result = modalView[actionName]();
        }
      } else {
        this.send(action, modalView);
      }
    }

    if (result) {
      modalView.destroy();
    }
  }
});