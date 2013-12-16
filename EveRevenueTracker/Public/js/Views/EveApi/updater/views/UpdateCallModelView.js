define([
    'text!EveApi/updater/templates/UpdateCallTemplate.html',
    'backbone'
], function (templateFile) {
    var UpdateCallView = Backbone.View.extend({
        tagName: 'div',
        className: 'updateCall-wrap',
        compiledTemplate: _.template(templateFile),

        render: function () {
            this.$el.html(this.compiledTemplate(this.model.toJSON()));
            return this;
        }
    });

    return UpdateCallView;
});