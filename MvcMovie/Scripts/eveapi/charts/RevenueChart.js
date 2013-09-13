/// <reference path="../../require.js" />
/// <reference path="Chart.js" />

define(function (require) {
    var Chart = require('./Chart');

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