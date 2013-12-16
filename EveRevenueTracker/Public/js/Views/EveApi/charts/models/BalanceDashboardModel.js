define([
    'EveApi/charts/models/TableModel'
], function (TableModel) {
    var BalanceDashboardModel = TableModel.extend({
        initialize: function () {
            var params = {
                url: 'EveApi/GetBalance',
                columns: [['date', 'Date'], ['number', 'Balance'], ['number', 'Buy'], ['number', 'Sell'], ['number', 'Revenue']]
            };
            TableModel.prototype.initialize.apply(this, [params]);
        },

        setData: function (data) {
            data.forEach(function (row) {
                this.get('dataTable').addRow([
                    new Date(row[0]),
                    row[1],
                    row[2],
                    row[3],
                    row[2] + row[3]
                ]);
            }, this);
        }
    });
    return BalanceDashboardModel;
});