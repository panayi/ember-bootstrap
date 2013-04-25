var get = Ember.get;
var Bootstrap = window.Bootstrap;
var jQuery = window.jQuery;

var modalPaneTemplate = [
'<div class="modal-header">',
'  <a href="#" class="close" rel="close" {{action "_modalCloseClick" view.parentView}}>&times;</a>',
'  {{view view.headerViewClass}}',
'</div>',
'<div class="modal-body">{{view view.bodyViewClass}}</div>',
'<div class="modal-footer">',
'  {{#if view.secondary}}<a href="#" class="btn btn-secondary" rel="secondary" {{action "_modalPrimaryClick" view.parentView}}>{{view.secondary}}</a>{{/if}}',
'  {{#if view.primary}}<a href="#" class="btn btn-primary" rel="primary" {{action "_modalSecondaryClick" view.parentView}}>{{view.primary}}</a>{{/if}}',
'</div>'].join("\n");
var modalPaneBackdrop = '<div class="modal-backdrop"></div>';

Bootstrap.ModalPane = Ember.View.extend({
  classNames: 'modal',
  defaultTemplate: Ember.Handlebars.compile(modalPaneTemplate),
  heading: null,
  message: null,
  primary: null,
  secondary: null,
  primaryAction: null,
  secondaryAction: null,
  closeAction: null,
  showBackdrop: true,
  headerViewClass: Ember.View.extend({
    tagName: 'h3',
    template: Ember.Handlebars.compile('{{view.parentView.heading}}')
  }),
  bodyViewClass: Ember.View.extend({
    template: Ember.Handlebars.compile('{{{view.parentView.message}}}')
  }),

  didInsertElement: function() {
    if (get(this, 'showBackdrop')) this._appendBackdrop();
    this._setupDocumentKeyHandler();
  },

  willDestroyElement: function() {
    if (this._backdrop) this._backdrop.remove();
    this._removeDocumentKeyHandler();
  },

  keyPress: function(event) {
    if (event.keyCode === 27) {
      this._triggerCallbackAndDestroy({ close: true }, event);
    }
  },

  _appendBackdrop: function() {
    var parentLayer = this.$().parent();
    this._backdrop = jQuery(modalPaneBackdrop).appendTo(parentLayer);
  },

  _setupDocumentKeyHandler: function() {
    var cc = this,
        handler = function(event) {
          cc.keyPress(event);
        };
    jQuery(window.document).bind('keyup', handler);
    this._keyUpHandler = handler;
  },

  _removeDocumentKeyHandler: function() {
    jQuery(window.document).unbind('keyup', this._keyUpHandler);
  },

  _triggerCallbackAndDestroy: function(options, event) {
    var destroy;
    if (this.callback) {
      destroy = this.callback(options, event);
    }
    if (destroy === undefined || destroy) this.destroy();
  }
});

Bootstrap.ModalPane.reopenClass({
  rootElement: ".ember-application",
  popup: function(options) {
    var modalPane, rootElement;
    if (!options) options = {};
    modalPane = this.create(options);
    rootElement = get(this, 'rootElement');
    modalPane.appendTo(rootElement);
    return modalPane;
  }
});

