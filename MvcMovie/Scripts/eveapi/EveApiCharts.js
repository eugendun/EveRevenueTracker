/// <reference path="../require.js" />
/// <reference path="../jsapi.js" />

require.config({
    paths: {
        'eutils': '../utils/eutils'
    }
});

define('EveApiCharts', ['eutils', 'google'], function () {
    /* Class Chart */
    function Chart(chartId, chartsContainer) {
        // chart container
        var _chart = document.createElement('div');
        _chart.id = chartId;
        _chart.className = 'chart';

        // append the chart container to the charts container
        chartsContainer.appendChild(_chart);

        // table formatter to show ISK values like in ingame
        var _iskFormatter = new google.visualization.TableNumberFormat({
            decimalSymbol: '.',
            groupingSymbol: ',',
            suffix: ' ISK'
        });


        // public methods
        // get chart container
        this.getChartContainer = function () {
            return _chart;
        };

        // get ISK formatter
        this.getIskFormatter = function () {
            return _iskFormatter;
        };
    };

    function WalletChart(chartsContainer, data) {
        WalletChart.superclass.constructor.call(this, 'WalletChart', chartsContainer);

        var _chart = new google.visualization.BarChart(this.getChartContainer()),
            _data = new google.visualization.arrayToDataTable(data),
            _options = {
                'title': 'Transactions',
                'legend': { 'position': 'top', 'alignment': 'start' }
            };

        this.getIskFormatter().format(_data, 1);
        _chart.draw(_data, _options);
    };
    extend(WalletChart, Chart);

    function BalanceChart(chartsContainer, data) {
        BalanceChart.superclass.constructor.call(this, 'BalanceChart', chartsContainer);

        var _chart = new google.visualization.LineChart(this.getChartContainer()),
            _data = new google.visualization.DataTable(),
            _options = {
                'title': 'Balance',
                'legend': { 'position': 'top', 'alignment': 'start' }
            };

        _data.addColumn('date', 'Date');
        _data.addColumn('number', 'Balance');
        _data.addRows(data);

        this.getIskFormatter().format(_data, 1);
        _chart.draw(_data, _options);
    };
    extend(BalanceChart, Chart);

    function BalanceDashboard(chartsContainer, data) {
        BalanceDashboard.superclass.constructor.call(this, 'BalanceDashboard', chartsContainer);

        // setup the html structure
        var _chartContainer = document.createElement('div'),
            _rangeFilterContainer = document.createElement('div');
        _chartContainer.id = 'BalanceChart';
        _rangeFilterContainer.id = 'BalanceRangeFilter';
        this.getChartContainer().appendChild(_chartContainer);
        this.getChartContainer().appendChild(_rangeFilterContainer);

        // setup the table
        var _data = new google.visualization.DataTable();
        _data.addColumn('date', 'Date');
        _data.addColumn('number', 'Balance');
        _data.addColumn('number', 'Buy');
        _data.addColumn('number', 'Sell');
        _data.addColumn('number', 'Revenue');

        // fill the table with data, the first column has to be converted to Date and the
        // last column is the sum of sell and buy values
        data.forEach(function (row) {
            _data.addRow([new Date(row[0]), row[1], row[2], row[3], row[2] + row[3]]);
        });

        // format the table columns with the isk formatter
        this.getIskFormatter().format(_data, 1);
        this.getIskFormatter().format(_data, 2);
        this.getIskFormatter().format(_data, 3);
        this.getIskFormatter().format(_data, 4);

        // set the intial range to a week (7 days)
        var _endRangeDate = new Date(data[data.length - 1][0]),
            _startRangeDate = new Date(_endRangeDate.getTime() - 86400000 * 7);

        var _control = new google.visualization.ControlWrapper({
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
            },
            'state': { 'range': { 'start': _startRangeDate, 'end': _endRangeDate } }
        });

        var _chart = new google.visualization.ChartWrapper({
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

        var _dashboard = new google.visualization.Dashboard(this.getChartContainer());
        _dashboard.bind(_control, _chart);
        _dashboard.draw(_data);
    };
    extend(BalanceDashboard, Chart);

    function RevenueChart(chartsContainer, data) {
        RevenueChart.superclass.constructor.call(this, 'RevenueChart', chartsContainer);

        var _chart = new google.visualization.ColumnChart(this.getChartContainer()),
            _data = new google.visualization.DataTable(),
            _options = {
                'title': 'Revenue'
            };

        _data.addColumn('string', 'Type');
        _data.addColumn('number', 'Revenue');
        _data.addRows(data);

        this.getIskFormatter().format(_data, 1);
        _chart.draw(_data, _options);
    };
    extend(RevenueChart, Chart);

    var EveApiCharts = function () { };
    EveApiCharts.prototype = {
        WalletChart: function (chartsContainer, data) {
            return new WalletChart(chartsContainer, data);
        },
        BalanceChart: function (chartsContainer, data) {
            return new BalanceChart(chartsContainer, data);
        },
        BalanceDashboard: function (chartsContainer, data) {
            return new BalanceDashboard(chartsContainer, data);
        },
        RevenueChart: function (chartsContainer, data) {
            return new RevenueChart(chartsContainer, data);
        }
    };
    return new EveApiCharts();
});