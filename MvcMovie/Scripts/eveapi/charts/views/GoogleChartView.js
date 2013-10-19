/// <reference path="../../../backbone.js" />

define(['backbone', 'google'], function () {
    _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

    var GoogleChart = Backbone.View.extend({
        tagName: 'div',
        className: 'chart-wrap',
        //compiledTemplate: _.template('todo'),

        initialize: function (params) {
            $(params.element).append(this.$el);
            this.model = params.model;
            this.chart = this.createChart();

            this.model.on('change:dataTable', this.render, this);
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