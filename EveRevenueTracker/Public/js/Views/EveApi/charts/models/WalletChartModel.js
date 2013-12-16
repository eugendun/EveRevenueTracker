define([
    'EveApi/charts/models/TableModel'
], function (TableModel) {
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