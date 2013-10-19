require.config({
    paths: {
        'eutils': '/Scripts/utils/eutils',
        'google': '/Scripts/eveapi/google'
    }
});

define(['eutils', 'google'], function () {

    /* Class Chart */
    function Chart(chartId, chartsContainer) {
        // chart container
        var _chartContainer = document.createElement('div');
        _chartContainer.id = chartId;
        _chartContainer.className = 'chart';

        // append the chart container to the charts container
        chartsContainer.appendChild(_chartContainer);

        // table formatter to show ISK values like in ingame
        var _iskFormatter = new google.visualization.TableNumberFormat({
            decimalSymbol: '.',
            groupingSymbol: ',',
            suffix: ' ISK'
        });

        // public methods
        // get chart container
        this.getChartContainer = function () {
            return _chartContainer;
        };

        // get ISK formatter
        this.getIskFormatter = function () {
            return _iskFormatter;
        };
    };

    Chart.prototype.updateDataTable = function (data) {
        var dataTable = new google.visualization.DataTable();
        for (var i = 0; i < this.columns.length; i++) {
            dataTable.addColumn(this.columns[i][0], this.columns[i][1]);
        };

        if ($.isArray(data) && data.length > 0) {
            dataTable.addRows(data);
            this.getIskFormatter().format(dataTable, 1);
        }

        this.chart.draw(dataTable, this.options);
    };

    return Chart;
});