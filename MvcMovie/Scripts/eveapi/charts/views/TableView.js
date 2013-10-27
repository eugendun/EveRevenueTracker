/// <reference path="../../../backbone.js" />

require.config({
    paths: {
        GoogleChartView: '/Scripts/eveapi/charts/views/GoogleChartView'
    }
});

define([
    'GoogleChartView',
    'backbone',
    'google',
], function (GoogleChartView) {
    var TableView = GoogleChartView.extend({
        createChart: function () {
            return new google.visualization.Table(this.el);
        }
    });
    return TableView;
});