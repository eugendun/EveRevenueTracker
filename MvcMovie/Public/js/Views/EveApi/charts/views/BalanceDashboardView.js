/// <reference path="~/Scripts/backbone.js" />

define([
    'EveApi/charts/views/GoogleChartView'
], function (GoogleChartView) {
    var BalanceDashboardView = GoogleChartView.extend({
        chartName: 'Balance',

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
            // create google control wrapper
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

            // create google chart wrapper
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

            // create google dashboar and bind google controller and google chart 
            var dashboard = new google.visualization.Dashboard(this.el);
            dashboard.bind(this.control, chart);
            return dashboard;
        },

        render: function () {
            var dataTable = this.model.get('dataTable'),
                rowCount = dataTable.getNumberOfRows();

            // format the data table
            this.iskFormatter.format(dataTable, 1);
            this.iskFormatter.format(dataTable, 2);
            this.iskFormatter.format(dataTable, 3);
            this.iskFormatter.format(dataTable, 4);

            // set state of the range controller by calculating start and end date
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