/// <reference path="../../../backbone.js" />

define(['backbone', 'google'], function () {
    var GoogleChart = Backbone.View.extend({
        tagName: 'div',
        className: 'chart',

        events: {
            'change:dataTable': 'render'
        },

        initialize: function (params) {
            this.model = params.model;
            this.chart = this.createChart();
            this.iskFormatter = new google.visualization.TableNumberFormat({
                decimalSymbol: '.',
                groupingSymbol: ',',
                negativeColor: 'red',
                suffix: ' ISK'
            });

            this.listenTo(this.model, 'change:dataTable', this.render);
        },

        createChart: function () {
            throw new Error("Abstract class, createChart not implemented!");
        },

        render: function () {
            this.chart.draw(this.model.get('dataTable'), this.chartOptions);
            return this;
        }
    });

    return GoogleChart;
});