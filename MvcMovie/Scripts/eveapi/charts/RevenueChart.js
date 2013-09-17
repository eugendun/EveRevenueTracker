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

        this.characterId = '';
        this.stationName = '';
        this.number = 10;
        this.days = 14;
    };
    extend(RevenueChart, Chart);

    RevenueChart.prototype.updateDataTable = function (data) {
        RevenueChart.superclass.updateDataTable.call(this, data);
    };

    RevenueChart.prototype.update = function (characterId) {
        this.characterId = characterId;

        var that = this;
        $.post("EveApi/GetRevenue", {
            characterId: that.characterId,
            station: that.stationName,
            number: that.number,
            days: that.days
        }, function (data) {
            that.updateDataTable(eval(data));
        });

        $.post('EveApi/GetTransactionStations', 'characterId=' + characterId, function (data) {
            that.createSelect('RevenueChart-Station-Select', eval(data));
        });

        this.createNumberSelect('RevenueChart-Number-Select');
        this.createLastDaysSelect('RevenueChart-LastDays-Select');
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
            optionElement.text = data[i];
            optionElement.value = data[i];
            selectElement.appendChild(optionElement);

            if (data[i] == this.stationName) {
                optionElement.selected = true;
            }
        }

        var that = this;
        $(selectElement).change(function () {
            var value = $('#' + this.id + ' :selected').val();
            that.stationName = value;
            if (that.characterId != '') {
                that.update(that.characterId);
            }
        });
    };

    RevenueChart.prototype.createNumberSelect = function (id) {
        var selectElement = document.getElementById(id);
        if (selectElement) {
            var parent = selectElement.parentElement;
            parent.removeChild(selectElement);
        }

        selectElement = document.createElement('select');
        selectElement.id = id;
        this.controlContainer.appendChild(selectElement);

        for (var i = 1; i <= 12; i++) {
            var optionElement = document.createElement('option');
            optionElement.text = i * 10;
            optionElement.value = i * 10;
            selectElement.appendChild(optionElement);

            if (this.number == i * 10) {
                optionElement.selected = true;
            };
        }

        var that = this;
        $(selectElement).change(function () {
            var value = $('#' + this.id + ' :selected').val();
            that.number = value;
            if (that.characterId != '') {
                that.update(that.characterId);
            }
        });
    };

    RevenueChart.prototype.createLastDaysSelect = function (id) {
        var selectElement = document.getElementById(id);
        if (selectElement) {
            var parent = selectElement.parentElement;
            parent.removeChild(selectElement);
        }

        selectElement = document.createElement('select');
        selectElement.id = id;
        this.controlContainer.appendChild(selectElement);

        var that = this;
        var values = [7, 14, 30, 60];
        values.forEach(function (element) {
            var optionElement = document.createElement('option');
            optionElement.text = element;
            optionElement.value = element;
            selectElement.appendChild(optionElement);

            if (that.days == element) {
                optionElement.selected = true;
            }
        });

        $(selectElement).change(function () {
            var value = $('#' + this.id + ' :selected').val();
            that.days = value;
            if (that.characterId != '') {
                that.update(that.characterId);
            }
        });
    };

    return RevenueChart;
});