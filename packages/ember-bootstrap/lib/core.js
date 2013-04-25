var Bootstrap = window.Bootstrap = Ember.Namespace.create();

Ember.Route.reopen({
	events: {
		_modalCloseClick: function(modalView) {
			this.handleModalActionAndDestroy(modalView.get('closeActionName'));
		},

		_modalPrimaryClick: function(modalView) {
			this.handleModalActionAndDestroy(modalView.get('primaryActionName'));
		},

		_modalSecondaryClick: function(modalView) {
			this.handleModalActionAndDestroy(modalView.get('secondaryActionName'));
		}
	},

	handleModalActionAndDestroy: function(modalView, actionName) {
		if (actionName) {
			this.send(actionName, modalView);
		}
		modalView.destroy();
	}
});