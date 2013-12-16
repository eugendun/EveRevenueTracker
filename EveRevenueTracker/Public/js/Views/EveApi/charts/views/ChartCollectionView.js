define([
    'EveApi/charts/collections/ChartCollection',
    'text!EveApi/charts/templates/TabsTemplate.html',
    'jqueryui',
    'EveApi/charts/models/SuggestedTableModel',
    'EveApi/charts/views/SuggestedTableView',
    'EveApi/charts/models/BalanceDashboardModel',
    'EveApi/charts/views/BalanceDashboardView',
    'EveApi/charts/models/WalletChartModel',
    'EveApi/charts/views/WalletChartView',
    'EveApi/charts/models/RevenueChartModel',
    'EveApi/charts/views/RevenueChartView'
], function (ChartCollection, TabsTemplate) {
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
        };

        return Backbone.View.extend({
            tagName: 'div',
            className: 'charts-container',
            compiledTemplate: _.template(TabsTemplate),

            events: {
                'characterSelected': 'onCharacterSelected'
            },

            initialize: function () {
                this.collection = new ChartCollection();

                this._chartViews = _([
                    _createWalletChartView(this.collection),
                    _createBalanceDashboardView(this.collection),
                    _createRevenueChartView(this.collection),
                    _createSuggestedTableView(this.collection)
                ]);

                this.render();

                // bind onResize event to the window
                // charts have to be redrawed whe container size change
                var that = this;
                $(window).resize(function () {
                    that._chartViews.each(function (view) {
                        view.render();
                    });
                });
            },

            remove: function () {
                // unbound onResize event to redraw the charts
                $(window).off('resize');
                
                Backbone.View.prototype.remove.call(this);
            },

            render: function () {
                // render the tab structure from the template into the view element container
                this.$el.html(this.compiledTemplate({ _chartViews: this._chartViews }));

                // each chart view has it's own tab container identified by tag id and model cid
                // tab containers are bound to the dom by the template above
                var that = this;
                this._chartViews.each(function (view) {
                    that.$el.find('#' + view.model.cid).html(view.el);
                });

                // to avoid strange effects, it is important to render the chart when a tab is activated
                // whithout new rendering, activated charts have wrong size
                var t = this.$el.find('#tabs').tabs({
                    activate: function (event, ui) {
                        var cid = ui.newPanel.attr('id');

                        that._chartViews.each(function (view) {
                            if (view.model.cid == cid) {
                                view.render();
                            }
                        });
                    }
                });
            },

            onCharacterSelected: function (charId) {
                this.collection.update(charId);
            }
        });
    })();

    return ChartCollectionView;
});