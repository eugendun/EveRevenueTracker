/// <reference path="../../../backbone.js" />

require.config({
    paths: {
        GoogleChartView: '/Scripts/eveapi/charts/views/GoogleChartView',
        RevenueChartTemplate: '/Scripts/eveapi/charts/templates/RevenueChartTemplate.html'
    }
});

define([
    'GoogleChartView',
    'text!RevenueChartTemplate',
    'backbone'
], function (GoogleChartView, RevenueChartTemplate) {
    var RevenueChartView = GoogleChartView.extend({
        compiledTemplate: _.template(RevenueChartTemplate),

        events: {
            'change #revenueDaysSelector': 'onChangeDays',
            'change #revenueStationSelector': 'onChangeStation',
            'change #revenueNumberSelector': 'onChangeNumber'
        },

        initialize: function (params) {
            this.chartContainer = document.createElement('div');
            this.chartContainer.id = 'revenueChart';
            this.$el.append(this.chartContainer);

            this.$controlContainer = $('<div>');
            this.$el.append(this.$controlContainer);

            GoogleChartView.prototype.initialize.apply(this, [params]);
        },

        createChart: function () {
            return new google.visualization.ColumnChart(this.chartContainer);
        },

        render: function () {
            var formattedModel = {
                number: this.model.get('number'),
                days: this.model.get('days'),
                totalRevenue: this.iskFormatter.formatValue(this.model.get('totalRevenue')),
                totalLoss: this.iskFormatter.formatValue(this.model.get('totalLoss')),
                total: this.iskFormatter.formatValue(this.model.get('total'))
            };

            this.$controlContainer.html(this.compiledTemplate(formattedModel));
            this.chart.draw(this.model.get('dataTable'), this.chartOptions);
            return this;
        },

        onChangeDays: function (event) {
            this.model.set({ days: event.target.value });
        },

        onChangeStation: function (event) {
            this.model.set({ station: event.target.value });
        },

        onChangeNumber: function (event) {
            this.model.set({ number: event.target.value });
        }
    });

    return RevenueChartView
});