/// <reference path="~/Scripts/backbone.js" />

define([
    'EveApi/charts/views/GoogleChartView'
], function (GoogleChartView) {
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