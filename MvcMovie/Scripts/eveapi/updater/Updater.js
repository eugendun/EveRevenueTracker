require.config({
    baseUrl: 'Scripts/eveapi',
    paths: {
        collections: 'updater/collections',
        models: 'updater/models',
        views: 'updater/views',
        templates: 'updater/templates'
    }
});

define([
    'collections/UpdateCallCollection',
    'views/UpdateCallCollectionView'
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