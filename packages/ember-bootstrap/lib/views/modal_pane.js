var get = Ember.get;
var Bootstrap = window.Bootstrap;
var jQuery = window.jQuery;

var modalPaneTemplate = [
'<div class="modal-header">',
'  <a href="#" class="close" rel="close" {{action "_modalCloseClick" view}}>&times;</a>',
'  {{view view.headerViewClass}}',
'</div>',
'<div class="modal-body">{{view view.bodyViewClass}}</div>',
'<div class="modal-footer">',
'  {{#if view.secondary}}<button class="btn btn-secondary" rel="secondary" {{action "_modalSecondaryClick" view}} {{bindAttr disabled="view.secondaryButtonDisabled"}}>{{view.secondary}}</button>{{/if}}',
'  {{#if view.primary}}<button {{bindAttr class=":btn :btn-primary view.primaryClass"}} rel="primary" {{action "_modalPrimaryClick" view}} {{bindAttr disabled="view.primaryButtonDisabled"}}>{{view.primary}}</button>{{/if}}',
'</div>'].join("\n");
var modalPaneBackdrop = '<div class="modal-backdrop" {{action "backdropClicked" target="view.modalView"}}></div>';

Bootstrap.ModalPane = Ember.View.extend({
  classNames: 'modal',
  defaultTemplate: Ember.Handlebars.compile(modalPaneTemplate),

  heading: null,
  bodyTemplateName: null,
  primary: null,
  secondary: null,

  primaryClass: null,

  primaryAction: null,
  secondaryAction: null,
  closeAction: null,

  primaryButtonDisabled: false,
  secondaryButtonDisabled: false,

  showBackdrop: true,
  closeOnBackdropClick: true,

  headerViewClass: Ember.View.extend({
    tagName: 'h3',
    template: Ember.Handlebars.compile('{{#if view.parentView.heading}}{{view.parentView.heading}}{{else}}&nbsp;{{/if}}')
  }),

  bodyViewClass: Ember.View.extend({
    templateName: function() {
      return this.get('parentView.bodyTemplateName');
    }.property()
  }),

  didInsertElement: function() {
    if (get(this, 'showBackdrop')) this._appendBackdrop();
    this._setupDocumentKeyHandler();
  },

  willDestroyElement: function() {
    if (this._backdrop) this._backdrop.remove();
    this._removeDocumentKeyHandler();
    this.onClose();
  },

  onClose: Ember.K,

  keyPress: function(event) {
    if (event.keyCode === 27) {
      this._triggerCallbackAndDestroy({ close: true }, event);
    }
  },

  backdropClicked: function() {
    if (this.closeOnBackdropClick) {
      this.destroy();
    }
  },

  _appendBackdrop: function() {
    var parentLayer = this.$().parent();
    var modalView = this;

    this._backdrop = Ember.View.create({
      template: Ember.Handlebars.compile(modalPaneBackdrop),
      modalView: modalView
    });

    this._backdrop.appendTo(parentLayer);
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

