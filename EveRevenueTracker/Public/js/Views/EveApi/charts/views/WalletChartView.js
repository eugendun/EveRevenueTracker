/// <reference path="~/Scripts/backbone.js" />

define([
    'EveApi/charts/views/GoogleChartView'
], function (GoogleChartView) {
    var WalletChartView = GoogleChartView.extend({
        chartName: 'Wallet',

        initialize: function (params) {
            _.extend(this.chartOptions, {
                'title': 'Transactions',
                'legend': { 'position': 'top', 'alignment': 'start' }
            });

            GoogleChartView.prototype.initialize.apply(this, [params]);
        },

        createChart: function () {
            var chart = new google.visualization.BarChart(this.el);
            return chart;
        },

        render: function () {
            var dataTable = this.model.get('dataTable');
            this.iskFormatter.format(dataTable, 1);

            return GoogleChartView.prototype.render.apply(this);
        }
    });
    return WalletChartView;
});