/// <reference path="../../../backbone.js" />

require.config({
    paths: {
        TableModel: '/Scripts/eveapi/charts/models/TableModel'
    }
});

define(['TableModel', 'backbone'], function (TableModel) {
    var WalletChartModel = TableModel.extend({
        initialize: function () {
            var params = {
                url: 'EveApi/GetTransactions',
                columns: [['string', 'Type Name'], ['number', 'Price']]
            };
            TableModel.prototype.initialize.apply(this, [params]);
        }
    });
    return WalletChartModel;
});