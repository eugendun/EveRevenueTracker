define([
    'EveApi/updater/views/UpdateCallModelView'
], function (UpdateCallView) {
    var UpdateCallCollectionView = Backbone.View.extend({
        tagName: 'div',
        className: 'updateCallCollection-wrap',

        initialize: function (params) {
            $(params.element).append(this.$el);
            this.collection = params.collection;
            this.render();
            this.collection.on('change', this.render, this);
        },

        render: function () {
            this.$el.html('');
            this.collection.each(function (updateCall) {
                this.renderUpdateCall(updateCall);
            }, this);
        },

        renderUpdateCall: function (updateCall) {
            var updateCallView = new UpdateCallView({ model: updateCall });
            this.$el.append(updateCallView.render().el);
        }
    });

    return UpdateCallCollectionView;
});