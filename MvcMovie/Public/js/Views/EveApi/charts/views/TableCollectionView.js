/// <reference path="~/Scripts/backbone.js" />

define([
    'EveApi/charts/collections/TableCollection',
    'EveApi/charts/models/TableModel',
    'EveApi/charts/views/TableView',
    'EveApi/charts/models/BalanceDashboardModel',
    'EveApi/charts/views/BalanceDashboardView',
    'EveApi/charts/models/WalletChartModel',
    'EveApi/charts/views/WalletChartView',
    'EveApi/charts/models/RevenueChartModel',
    'EveApi/charts/views/RevenueChartView'
], function (TableCollection) {
    var TableCollectionView = (function () {
        // suggested orders table
        var _createSuggestedTableView = function (tableCollection) {
            var TableModel = require('EveApi/charts/models/TableModel'),
                TableView = require('EveApi/charts/views/TableView');

            var suggestedTableModel = new TableModel({
                url: '/EveApi/GetProfitableItemsNotInMarketOrder',
                columns: [['string', 'Type'], ['number', 'Price']]
            });
            tableCollection.add(suggestedTableModel)
            return new TableView({ model: suggestedTableModel });
        };

        // balance dashboard
        var _createBalanceDashboardView = function (tableCollection) {
            var BalanceDashboardModel = require('EveApi/charts/models/BalanceDashboardModel'),
                BalanceDashboardView = require('EveApi/charts/views/BalanceDashboardView');

            var balanceDashboard = new BalanceDashboardModel();
            tableCollection.add(balanceDashboard);

            return new BalanceDashboardView({ model: balanceDashboard });
        };

        // wallet chart
        var _createWalletChartView = function (tableCollection) {
            var WalletChartModel = require('EveApi/charts/models/WalletChartModel'),
                WalletChartView = require('EveApi/charts/views/WalletChartView');

            var walletChartModel = new WalletChartModel();
            tableCollection.add(walletChartModel);

            return new WalletChartView({ model: walletChartModel });
        };

        // revenue chart
        var _createRevenueChartView = function (tableCollection) {
            var RevenueChartModel = require('EveApi/charts/models/RevenueChartModel'),
                RevenueChartView = require('EveApi/charts/views/RevenueChartView');

            var revenueChartModel = new RevenueChartModel();
            tableCollection.add(revenueChartModel);

            return new RevenueChartView({ model: revenueChartModel });
        }

        return Backbone.View.extend({
            tagName: 'div',
            className: 'charts-container',

            events: {
                'characterSelected': 'onCharacterSelected'
            },

            initialize: function () {
                this.collection = new TableCollection();

                this.$el.css('display', 'none');

                this.$el.append(_createSuggestedTableView(this.collection).el);
                this.$el.append(_createBalanceDashboardView(this.collection).el);
                this.$el.append(_createWalletChartView(this.collection).el);
                this.$el.append(_createRevenueChartView(this.collection).el);
            },

            onCharacterSelected: function (charId) {
                var that = this;
                this.$el.hide({
                    duration: 1000,
                    complete: function () {
                        that.collection.update(charId);
                        that.$el.show({
                            duration: 1000
                        });
                    }
                });
            }
        });
    })();

    return TableCollectionView;
});