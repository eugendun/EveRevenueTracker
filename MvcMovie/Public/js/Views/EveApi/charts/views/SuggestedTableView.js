/// <reference path="~/Scripts/backbone.js" />

define([
    'EveApi/charts/views/TableView',
    'EveApi/charts/models/SuggestedTableModel'
], function (TableView, SuggestedTableModel) {
    var SuggestedTableView = TableView.extend({
        chartName: 'Suggested Items',

        render: function () {
            this.iskFormatter.format(this.model.get('dataTable'), 1);

            return TableView.prototype.render.apply(this);
        }
    });

    return SuggestedTableView;
});