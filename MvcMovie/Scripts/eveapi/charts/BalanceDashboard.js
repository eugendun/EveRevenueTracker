/// <reference path="../../require.js" />
/// <reference path="Chart.js" />

define(function (require) {
    var Chart = require('./Chart');

    function BalanceDashboard(chartsContainer, data) {
        BalanceDashboard.superclass.constructor.call(this, 'BalanceDashboard', chartsContainer);

        // setup the html structure
        var _chartContainer = document.createElement('div'),
            _rangeFilterContainer = document.createElement('div');
        _chartContainer.id = 'BalanceChart';
        _rangeFilterContainer.id = 'BalanceRangeFilter';
        this.getChartContainer().appendChild(_chartContainer);
        this.getChartContainer().appendChild(_rangeFilterContainer);

        this.columns = [['date', 'Date'], ['number', 'Balance'], ['number', 'Buy'], ['number', 'Sell'], ['number', 'Revenue']];

        this.control = new google.visualization.ControlWrapper({
            'controlType': 'ChartRangeFilter',
            'containerId': _rangeFilterContainer.id,
            'options': {
                // Filter by the date axis.
                'filterColumnIndex': 0,
                'ui': {
                    'chartType': 'LineChart',
                    'chartOptions': {
                        'chartArea': { 'height': '90%', 'width': '90%' },
                        'hAxis': { 'baselineColor': 'none' }
                    },
                    'chartView': {
                        'columns': [0, 1]
                    },
                    'minRangeSize': 86400000
                }
            }
        });

        this.chart = new google.visualization.ChartWrapper({
            'chartType': 'LineChart',
            'containerId': _chartContainer.id,
            'options': {
                'title': 'Balance',
                'chartArea': { 'height': '80%', 'width': '60%' },
                'hAxis': { 'slantedText': false }
            },
            'view': {
                'columns': [{
                    'calc': function (dataTable, rowIndex) {
                        return dataTable.getFormattedValue(rowIndex, 0);
                    },
                    'type': 'string'
                }, 1, 2, 3, 4]
            }
        });

        this.dashboard = new google.visualization.Dashboard(this.getChartContainer());
        this.dashboard.bind(this.control, this.chart);
    };
    extend(BalanceDashboard, Chart);

    BalanceDashboard.prototype.updateDataTable = function (data) {
        // setup the table
        var dataTable = new google.visualization.DataTable();
        for (var i = 0; i < this.columns.length; i++) {
            dataTable.addColumn(this.columns[i][0], this.columns[i][1]);
        };

        // fill the table with data, the first column has to be converted to Date and the
        // last column is the sum of sell and buy values
        data.forEach(function (row) {
            dataTable.addRow([new Date(row[0]), row[1], row[2], row[3], row[2] + row[3]]);
        });

        // format the table columns with the isk formatter
        this.getIskFormatter().format(dataTable, 1);
        this.getIskFormatter().format(dataTable, 2);
        this.getIskFormatter().format(dataTable, 3);
        this.getIskFormatter().format(dataTable, 4);

        // set the intial range to a week (7 days)
        var _endRangeDate = new Date(data[data.length - 1][0]),
            _startRangeDate = new Date(_endRangeDate.getTime() - 86400000 * 7),
            _state = { 'range': { 'start': _startRangeDate, 'end': _endRangeDate } };

        this.control.setState(_state);
        this.dashboard.draw(dataTable);
    };

    BalanceDashboard.prototype.update = function (characterId) {
        var that = this;
        $.post("EveApi/GetBalance", "characterId=" + characterId, function (data) {
            that.updateDataTable(eval(data));
        });
    };

    return BalanceDashboard;
});