/// <reference path="../../require.js" />
/// <reference path="Chart.js" />

define(function (require) {
    var Chart = require('./Chart');

    function RevenueChart(chartsContainer) {
        RevenueChart.superclass.constructor.call(this, 'RevenueDashboard', chartsContainer);

        this.chartContainer = document.createElement('div');
        this.chartContainer.id = 'RevenueChart';
        this.controlContainer = document.createElement('div');
        this.controlContainer.id = 'RevenueControl';
        this.getChartContainer().appendChild(this.chartContainer);
        this.getChartContainer().appendChild(this.controlContainer);

        this.chart = new google.visualization.ColumnChart(this.chartContainer),
        this.columns = [['string', 'Type'], ['number', 'Revenue']];
    };
    extend(RevenueChart, Chart);

    RevenueChart.prototype.updateDataTable = function (data) {
        RevenueChart.superclass.updateDataTable.call(this, data);
    };

    RevenueChart.prototype.update = function (characterId) {
        var that = this;
        $.post("EveApi/GetRevenue", "characterId=" + characterId, function (data) {
            that.updateDataTable(eval(data));
        });

        $.post('EveApi/GetTransactionStations', 'characterId=' + characterId, function (data) {
            that.createSelect('RevenueChart-Station-Select', eval(data));
        });
    };

    RevenueChart.prototype.createSelect = function (id, data) {
        var selectElement = document.getElementById(id);
        if (selectElement) {
            var parent = selectElement.parentElement;
            parent.removeChild(selectElement);
        }
        selectElement = document.createElement('select');
        selectElement.id = id;
        this.controlContainer.appendChild(selectElement);

        var firstOption = document.createElement('option');
        firstOption.label = '-- Station --';
        firstOption.value = '';
        firstOption.selected = true;
        selectElement.appendChild(firstOption);

        for (var i = 0; i < data.length; i++) {
            var optionElement = document.createElement('option');
            optionElement.label = data[i];
            selectElement.appendChild(optionElement);
        }
    };

    return RevenueChart;
});