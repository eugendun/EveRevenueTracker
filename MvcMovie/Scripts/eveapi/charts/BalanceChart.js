/// <reference path="../../require.js" />

require.config({
    paths: {
        'chart': 'charts/chart'
    }
});

define('balancechart', ['chart'], function () {
    var Chart = require('chart');

    function BalanceChart(chartsContainer, data) {
        BalanceChart.superclass.constructor.call(this, 'BalanceChart', chartsContainer);

        this.chart = new google.visualization.LineChart(this.getChartContainer());
        this.options = {
            'title': 'Balance',
            'legend': { 'position': 'top', 'alignment': 'start' }
        };
        this.columns = [['data', 'Data'], ['number', 'Balance']];
    };
    extend(BalanceChart, Chart);

    BalanceChart.prototype.updateDataTable = function (data) {
        BalanceChart.superclass.updateDataTable.call(this, data);
    };

    return BalanceChart;
});