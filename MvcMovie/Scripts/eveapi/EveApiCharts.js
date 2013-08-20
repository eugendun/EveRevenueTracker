/// <reference path="https://www.google.com/jsapi" />
/// <reference path="../require.js" />

define('EveApiCharts', ['google'], function () {
    var EveApiCharts = function () { };

    EveApiCharts.prototype.WalletChart = function (container, data) {
        var _container = container,
            _chart = new google.visualization.BarChart(container),
            _data = new google.visualization.arrayToDataTable(eval(data)),
            _options = {
                'title': 'Transactions',
                'legend': { 'position': 'top', 'alignment': 'start' }
            },
            _formatter = new google.visualization.TableNumberFormat({
                decimalSymbol: '.',
                groupingSymbol: ',',
                suffix: ' ISK'
            });

        _formatter.format(_data, 1)
        _chart.draw(_data, _options);

        return {
            getChart: function () {
                return _chart;
            },

            addRows: function (data) {
                _dt.addRows(data);
                _chart.draw(_dt, _options);
            }
        };
    };

    EveApiCharts.prototype.BalanceChart = function (container, data) {
        var _container = container,
            _chart = new google.visualization.LineChart(container),
            _data = new google.visualization.DataTable(),
            _options = {
                'title': 'Balance',
                'legend': { 'position': 'top', 'alignment': 'start' }
            },
            _formatter = new google.visualization.TableNumberFormat({
                decimalSymbol: '.',
                groupingSymbol: ',',
                suffix: ' ISK'
            });

        _data.addColumn('date', 'Date');
        _data.addColumn('number', 'Balance');
        _data.addRows(data);

        _formatter.format(_data, 1)
        _chart.draw(_data, _options);

        return {
            getChart: function () {
                return _chart;
            },

            addRows: function (data) {
                _dt.addRows(data);
                _chart.draw(_dt, _options);
            }
        };
    };

    EveApiCharts.prototype.BalanceDashboard = function (container, data) {
        var _dashboard,
            _data,
            _formatter,
            _control,
            _chart;

        _data = new google.visualization.DataTable();

        _data.addColumn('date', 'Date');
        _data.addColumn('number', 'Balance');
        _data.addColumn('number', 'Buys');
        _data.addColumn('number', 'Sells');

        data.forEach(function (row) {
            _data.addRow([new Date(row[0]), row[1], row[2], row[3]]);
        });

        _formatter = new google.visualization.TableNumberFormat({
            decimalSymbol: '.',
            groupingSymbol: ',',
            suffix: ' ISK'
        });

        _formatter.format(_data, 1);
        _formatter.format(_data, 2);
        _formatter.format(_data, 3);

        // set the intial range to a week (7 days)
        var _endRangeDate = new Date(data[data.length - 1][0]),
            _startRangeDate = new Date(_endRangeDate.getTime() - 86400000 * 7);

        _control = new google.visualization.ControlWrapper({
            'controlType': 'ChartRangeFilter',
            'containerId': 'balance_range_filter',
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
            },
            'state': { 'range': { 'start': _startRangeDate, 'end': _endRangeDate } }
        });

        _chart = new google.visualization.ChartWrapper({
            'chartType': 'LineChart',
            'containerId': 'balance_chart',
            'options': {
                'chartArea': { 'height': '80%', 'width': '60%' },
                'hAxis': { 'slantedText': false }
            },
            'view': {
                'columns': [{
                    'calc': function (dataTable, rowIndex) {
                        return dataTable.getFormattedValue(rowIndex, 0);
                    },
                    'type': 'string'
                }, 1, 2, 3]
            }
        });

        _dashboard = new google.visualization.Dashboard(container),
        _dashboard.bind(_control, _chart);
        _dashboard.draw(_data);

        return {
            getChart: function () {
                return _chart;
            },

            addRows: function (data) {
                _dt.addRows(data);
                _chart.draw(_dt, _options);
            }
        };
    };


    return new EveApiCharts();
});