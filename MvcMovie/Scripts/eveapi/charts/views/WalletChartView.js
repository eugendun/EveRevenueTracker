/// <reference path="../../../backbone.js" />

require.config({
    paths: {
        GoogleChartView: '/Scripts/eveapi/charts/views/GoogleChartView'
    }
});

define(['GoogleChartView', 'backbone'], function (GoogleChartView) {
    var WalletChartView = GoogleChartView.extend({
        initialize: function (params) {
            this.options = {
                'title': 'Transactions',
                'legend': { 'position': 'top', 'alignment': 'start' }
            };
            GoogleChartView.prototype.initialize.apply(this, [params]);
        },

        createChart: function () {
            var chart = new google.visualization.BarChart(this.el);
            return chart;
        }
    });
    return WalletChartView;
});