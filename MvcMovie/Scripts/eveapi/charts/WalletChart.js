/// <reference path="../../require.js" />
/// <reference path="Chart.js" />

require.config({
    baseUrl:'../Scripts/eveapi/charts'
});

define(function (require) {
    var Chart = require('Chart');

    function WalletChart(chartsContainer, data) {
        WalletChart.superclass.constructor.call(this, 'WalletChart', chartsContainer);

        this.chart = new google.visualization.BarChart(this.getChartContainer());
        this.options = {
            'title': 'Transactions',
            'legend': { 'position': 'top', 'alignment': 'start' }
        };
        this.columns = [['string', 'Type Name'], ['number', 'Price']];
    };
    extend(WalletChart, Chart);

    WalletChart.prototype.updateDataTable = function (data) {
        WalletChart.superclass.updateDataTable.call(this, data);
    };

    WalletChart.prototype.update = function (characterId) {
        var that = this;
        $.post("/EveApi/GetTransactions", "characterid=" + characterId, function (data) {
            that.updateDataTable(eval(data));
        });
    };

    return WalletChart;
});