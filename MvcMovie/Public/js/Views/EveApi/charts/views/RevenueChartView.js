/// <reference path="~/Scripts/backbone.js" />

define([
    'EveApi/charts/views/GoogleChartView',
    'text!EveApi/charts/templates/RevenueChartTemplate.html'
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
            GoogleChartView.prototype.render.apply(this);
            this.renderControls();
            return this;
        },

        renderControls: function () {
            var formattedModel = {
                number: this.model.get('number'),
                days: this.model.get('days'),
                totalRevenue: this.iskFormatter.formatValue(this.model.get('totalRevenue')),
                totalLoss: this.iskFormatter.formatValue(this.model.get('totalLoss')),
                total: this.iskFormatter.formatValue(this.model.get('total')),
                stations: this.model.get('stations')
            };

            this.$controlContainer.html(this.compiledTemplate(formattedModel));
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