/// <reference path="../../../backbone.js" />

require.config({
    paths: {
        TableModel: '/Scripts/eveapi/charts/models/TableModel'
    }
});

define([
    'TableModel',
    'backbone'
], function (TableModel) {
    var SuggestedTableModel = TableModel.extend({
        initialize: function () {
            var params = {
                url: '/EveApi/GetProfitableItemsNotInMarketOrder',
                columns: [['string', 'Type'], ['number', 'Price']]
            };
            TableModel.prototype.initialize.apply(this, [params]);
        }
    });

    return SuggestedTableModel;
});