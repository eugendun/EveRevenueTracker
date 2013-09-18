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
        if (characterId) {
            this.characterId = characterId;
        }

        if (this.characterId == '') {
            throw new Error('Empty character id!');
        }

        var that = this;
        $.post("EveApi/GetRevenue", {
            characterId: that.characterId,
            station: that.stationName,
            number: that.number,
            days: that.days
        }, function (data) {
            that.updateDataTable(eval(data));
        });

        $.post('EveApi/GetTransactionStations', 'characterId=' + this.characterId, function (stations) {
            that.stationSelect(eval(stations));
        });

        this.lastDaysSelect();
        this.quantitySelect();
    };

    RevenueChart.prototype.stationSelect = function (stations) {
        var id = this.chartContainer.id + '-stationSelect',
            element = document.getElementById(id);
        if (!element) {
            // add a default selection - no station 
            stations.unshift('Select station...');
            var options = { values: stations, defaultValue: 'Select station...' },
                that = this;

            element = createSelect(id, options);
            $(element).change(function () {
                var value = $('#' + this.id + ' :selected').val();
                that.stationName = value == 'Select station...' ? '' : value;
                that.update();
            });

            $(this.controlContainer).append(element);
        }
    };

    RevenueChart.prototype.quantitySelect = function () {
        var id = this.chartContainer.id + '-quantitySelect',
            element = document.getElementById(id);
        if (!element) {
            var options = { values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120], defaultValue: 20 },
                that = this;

            element = createSelect(id, options);
            $(element).change(function () {
                var value = $('#' + this.id + ' :selected').val();
                that.number = value;
                that.update();
            });

            $(this.controlContainer).append(element);
        }
    };

    RevenueChart.prototype.lastDaysSelect = function () {
        var id = this.chartContainer.id + '-laystDaysSelect',
            element = document.getElementById(id);
        if (!element) {
            var options = { values: [7, 14, 30, 60], defaultValue: 14 },
                that = this;

            element = createSelect(id, options);
            $(element).change(function () {
                var value = $('#' + this.id + ' :selected').val();
                that.days = value;
                that.update();
            });

            $(this.controlContainer).append(element);
        }
    };

    /**
        options = {values: ..., dafaultValue:...}
    */
    function createSelect(id, options) {
        var selectElement = document.createElement('select')
        selectElement.id = id;

        options.values.forEach(function (element) {
            var optionElement = document.createElement('option');
            optionElement.text = element;
            optionElement.value = element;
            selectElement.appendChild(optionElement);

            if (options.defaultValue == element) {
                optionElement.selected = true;
            }
        });

        return selectElement;
    };

    return RevenueChart;
});