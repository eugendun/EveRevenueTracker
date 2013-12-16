define([
    'EveApi/charts/views/GoogleChartView',
    'google'
], function (GoogleChartView) {
    var TableView = GoogleChartView.extend({
        createChart: function () {
            return new google.visualization.Table(this.el);
        }
    });
    return TableView;
});