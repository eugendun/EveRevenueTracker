define(function (require) {
    var Chart = require('./Chart');

    function RevenueChart(chartsContainer) {
        RevenueChart.superclass.constructor.call(this, 'RevenueDashboard', chartsContainer);

        this.chartContainer = document.createElement('div');
        this.chartContainer.id = 'RevenueChart';

        this.controlContainer = document.createElement('div');
        this.controlContainer.id = 'RevenueControl';
        this.controlContainer.className = 'chart-control';

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

        var totalRevenue = 0,
            totalLoss = 0;

        if ($.isArray(data) && data.length > 0) {
            data.forEach(function (element) {
                if (element[1] >= 0) {
                    totalRevenue += element[1];
                } else {
                    totalLoss += element[1];
                }
            });
        }

        this.updateTotalOverview(totalRevenue, totalLoss);
    };

    RevenueChart.prototype.updateTotalOverview = function (amountOfRevenue, amountOfLoss) {
        var containerId = this.controlContainer.id + '-TotalOverview',
            revenueId = containerId + '-Revenue',
            lossId = containerId + '-Loss',
            totalId = containerId + '-Total',
            avgProfitPerDayId = containerId + '-AvgProfitPerDay',
            container = document.getElementById(containerId);
        if (!container) {
            var container = $('<div>').attr('id', containerId).appendTo(this.controlContainer),
                fieldset = $('<fieldset>').appendTo(container);
            $('<label>').attr('for', revenueId).text('Revenue:').appendTo(fieldset),
            $('<div>').attr('id', revenueId).css('color', 'green').appendTo(fieldset),
            $('<label>').attr('for', lossId).text('Loss:').appendTo(fieldset),
            $('<div>').attr('id', lossId).css('color', 'red').appendTo(fieldset);
            $('<label>').attr('for', totalId).text('Total:').appendTo(fieldset);
            $('<div>').attr('id', totalId).appendTo(fieldset);
            $('<label>').attr('for', avgProfitPerDayId).text('Average profit per day:').appendTo(fieldset);
            $('<div>').attr('id', avgProfitPerDayId).appendTo(fieldset);
        }

        $('#' + revenueId).text(this.getIskFormatter().formatValue(amountOfRevenue));
        $('#' + lossId).text(this.getIskFormatter().formatValue(amountOfLoss));

        var total = amountOfLoss + amountOfRevenue,
            valueColor = total >= 0 ? 'green' : 'red';
        $('#' + totalId).css('color', valueColor).text(this.getIskFormatter().formatValue(total));

        var avgProfitPerDay = total / this.days;
        $('#' + avgProfitPerDayId).css('color', valueColor).text(this.getIskFormatter().formatValue(avgProfitPerDay));
    }

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

            if ($.isArray(stations)) {
                stations.unshift('Select...');
            } else {
                stations = ['Select...'];
            }

            var options = { values: stations, defaultValue: 'Select...' },
                that = this;

            element = createSelect(id, options);
            $(element).change(function () {
                var value = $('#' + this.id + ' :selected').val();
                that.stationName = value == 'Select station...' ? '' : value;
                that.update();
            });

            var container = $('<div>'),
                label = $('<label>').text('Station:').attr('for', id);
            container.append(label).append(element);

            $(this.controlContainer).append(container);
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

            var container = $('<div>'),
                label = $('<label>').text('Count:').attr('for', id);
            container.append(label).append(element);

            $(this.controlContainer).append(container);
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

            var container = $('<div>'),
                label = $('<label>').text('Days:').attr('for', id);
            container.append(label).append(element);

            $(this.controlContainer).append(container);
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