define([
    'EveApi/updater/collections/UpdateCallCollection',
    'EveApi/updater/views/UpdateCallCollectionView'
], function (UpdateCallCollection, UpdateCallCollectionView) {
    var Updater = Backbone.Model.extend({
        initialize: function (el) {
            this.upCalls = new UpdateCallCollection();
            this.upCallsView = new UpdateCallCollectionView({ element: el, collection: this.upCalls });

            this.upCalls.add({ name: 'Wallet Transactions', url: '/EveApi/UpdateWalletTransactions' });
            this.upCalls.add({ name: 'Market Orders', url: '/EveApi/UpdateMarketOrders' });
            this.upCalls.add({ name: 'Wallet Journal', url: '/EveApi/UpdateWalletJournal' });
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