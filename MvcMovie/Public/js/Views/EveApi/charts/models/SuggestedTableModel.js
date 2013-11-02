/// <reference path="~/Scripts/backbone.js" />

define([
    'EveApi/charts/models/TableModel'
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