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
            };

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
    }

    return new EveApiCharts();
});