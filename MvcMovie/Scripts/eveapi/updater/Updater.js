require.config({
    paths: {
        templates: 'updater/templates'
    }
});

define([
    'updater/collections/UpdateCallCollection',
    'updater/views/UpdateCallCollectionView'
], function (UpdateCallCollection, UpdateCallCollectionView) {
    var Updater = Backbone.Model.extend({
        initialize: function (el) {
            this.upCalls = new UpdateCallCollection();
            this.upCallsView = new UpdateCallCollectionView({ element: el, collection: this.upCalls });
        },

        getUpdateCalls: function () {
            return this.upCalls;
        },

        getUpdateCallsView: function () {
            return this.upCallsView;
        },

        update: function (charId) {
            this.upCalls.update(charId);
        }
    });

    return Updater;
});