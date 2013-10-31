/// <reference path="../../../backbone.js" />

require.config({
    paths: {
        TableView: '/Scripts/eveapi/charts/views/TableView'
    }
});

define([
    'TableView',
    'backbone'
], function (TableView) {
    var SuggestedTableView = TableView.extend({
        render: function () {
            this.iskFormatter.format(this.model.get('dataTable'), 1);
            TableView.prototype.render.apply(this);
            return this;
        }
    });

    return SuggestedTableView;
});