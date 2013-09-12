/// <reference path="../../require.js" />

require.config({
    paths: {
        'chart': 'charts/chart'
    }
});

define('revenuechart', ['chart'], function () {
    var Chart = require('chart');

    function RevenueChart(chartsContainer, data) {
        RevenueChart.superclass.constructor.call(this, 'RevenueChart', chartsContainer);

        this.chart = new google.visualization.ColumnChart(this.getChartContainer()),
        this.columns = [['string', 'Type'], ['number', 'Revenue']];

        this.updateDataTable(data);
    };
    extend(RevenueChart, Chart);

    RevenueChart.prototype.updateDataTable = function (data) {
        RevenueChart.superclass.updateDataTable.call(this, data);
    };

    return RevenueChart;
});