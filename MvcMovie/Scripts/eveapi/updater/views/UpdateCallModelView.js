require.config({
    paths: {
        templates: '/Scripts/eveapi/updater/templates'
    }
});

define(['text!templates/UpdateCallTemplate.html', 'backbone'], function (templateFile) {
    _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

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