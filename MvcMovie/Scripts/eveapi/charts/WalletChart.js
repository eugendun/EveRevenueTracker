/// <reference path="../../require.js" />
/// <reference path="Chart.js" />

define(function (require) {
    var Chart = require('./Chart');

    function WalletChart(chartsContainer, data) {
        WalletChart.superclass.constructor.call(this, 'WalletChart', chartsContainer);

        this.chart = new google.visualization.BarChart(this.getChartContainer());
        this.options = {
            'title': 'Transactions',
            'legend': { 'position': 'top', 'alignment': 'start' }
        };

        this.updateDataTable(data);
    };
    extend(WalletChart, Chart);

    WalletChart.prototype.updateDataTable = function (data) {
        var dataTable = new google.visualization.arrayToDataTable(data);
        this.getIskFormatter().format(dataTable, 1);
        this.chart.draw(dataTable, this.options);
    };

    return WalletChart;
});