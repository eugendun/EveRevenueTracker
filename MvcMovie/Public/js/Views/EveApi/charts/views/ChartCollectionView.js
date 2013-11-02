/// <reference path="~/Scripts/backbone.js" />

define([
    'EveApi/charts/collections/ChartCollection',
    'EveApi/charts/models/SuggestedTableModel',
    'EveApi/charts/views/SuggestedTableView',
    'EveApi/charts/models/BalanceDashboardModel',
    'EveApi/charts/views/BalanceDashboardView',
    'EveApi/charts/models/WalletChartModel',
    'EveApi/charts/views/WalletChartView',
    'EveApi/charts/models/RevenueChartModel',
    'EveApi/charts/views/RevenueChartView'
], function (ChartCollection) {
    var ChartCollectionView = (function () {
        // suggested orders table
        var _createSuggestedTableView = function (chartCollection) {
            var SuggestedTableModel = require('EveApi/charts/models/SuggestedTableModel'),
                SuggestedTableView = require('EveApi/charts/views/SuggestedTableView');

            var suggestedTableModel = new SuggestedTableModel();
            chartCollection.add(suggestedTableModel)

            return new SuggestedTableView({ model: suggestedTableModel });
        };

        // balance dashboard
        var _createBalanceDashboardView = function (chartCollection) {
            var BalanceDashboardModel = require('EveApi/charts/models/BalanceDashboardModel'),
                BalanceDashboardView = require('EveApi/charts/views/BalanceDashboardView');

            var balanceDashboard = new BalanceDashboardModel();
            chartCollection.add(balanceDashboard);

            return new BalanceDashboardView({ model: balanceDashboard });
        };

        // wallet chart
        var _createWalletChartView = function (chartCollection) {
            var WalletChartModel = require('EveApi/charts/models/WalletChartModel'),
                WalletChartView = require('EveApi/charts/views/WalletChartView');

            var walletChartModel = new WalletChartModel();
            chartCollection.add(walletChartModel);

            return new WalletChartView({ model: walletChartModel });
        };

        // revenue chart
        var _createRevenueChartView = function (chartCollection) {
            var RevenueChartModel = require('EveApi/charts/models/RevenueChartModel'),
                RevenueChartView = require('EveApi/charts/views/RevenueChartView');

            var revenueChartModel = new RevenueChartModel();
            chartCollection.add(revenueChartModel);

            return new RevenueChartView({ model: revenueChartModel });
        }

        return Backbone.View.extend({
            tagName: 'div',
            className: 'charts-container',

            events: {
                'characterSelected': 'onCharacterSelected'
            },

            initialize: function () {
                this.collection = new ChartCollection();

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

    return ChartCollectionView;
});