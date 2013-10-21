/// <reference path="../../../backbone.js" />

require.config({
    paths: {
        TableView: '/Scripts/eveapi/charts/views/GoogleChartView'
    }
});

define(['GoogleChartView', 'backbone'], function (GoogleChartView) {
    var BalanceDashboardView = GoogleChartView.extend({
        initialize: function (params) {
            // div container for chart
            this.chartContainer = document.createElement('div');
            this.chartContainer.id = 'BalanceChart';
            this.$el.append(this.chartContainer);

            // div container for control wrapper
            this.rangeFilterContainer = document.createElement('div');
            this.rangeFilterContainer.id = 'BalanceRangeFilter';
            this.$el.append(this.rangeFilterContainer);

            GoogleChartView.prototype.initialize.apply(this, [params]);
        },

        createChart: function () {
            this.control = new google.visualization.ControlWrapper({
                controlType: 'ChartRangeFilter',
                containerId: this.rangeFilterContainer.id,
                options: {
                    filterColumnIndex: 0,
                    ui: {
                        chartType: 'LineChart',
                        chartOptions: {
                            chartArea: { height: '90%', width: '90%' },
                            hAxis: { baselineColor: 'none' }
                        },
                        chartView: {
                            columns: [0, 1]
                        },
                        minRangeSize: 86400000
                    }
                }
            });

            var chart = new google.visualization.ChartWrapper({
                chartType: 'LineChart',
                containerId: this.chartContainer.id,
                options: {
                    title: 'Balance',
                    chartArea: { height: '80%', width: '60%' },
                    hAxis: { slantedText: false }
                },
                view: {
                    columns: [{
                        calc: function (dataTable, rowIndex) {
                            return dataTable.getFormattedValue(rowIndex, 0);
                        },
                        type: 'string'
                    }, 1, 2, 3, 4]
                }
            });

            var dashboard = new google.visualization.Dashboard(this.el);
            dashboard.bind(this.control, chart);
            return dashboard;
        },

        render: function () {
            var dataTable = this.model.get('dataTable'),
                rowCount = dataTable.getNumberOfRows();

            if (rowCount > 0) {
                var endRangeDate = dataTable.getValue(rowCount - 1, 0),
                    startRangeDate,
                    state;

                // set the start point for the range filter 7 days ago
                // if row count is less then 7 set the start point to
                // the first row
                if (rowCount > 7)
                    startRangeDate = new Date(endRangeDate.getTime() - 86400000 * 7);
                else
                    startRangeDate = dataTable.getValue(0, 0);

                state = {
                    range: {
                        start: startRangeDate,
                        end: endRangeDate
                    }
                };

                this.control.setState(state);
            }
            return GoogleChartView.prototype.render.apply(this);
        }
    });

    return BalanceDashboardView;
});