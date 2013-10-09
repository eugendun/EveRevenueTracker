/// <reference path="../../require.js" />

define(function (require) {
    var Table = require('Table');

    function SuggestedOrdersTable(container) {
        SuggestedOrdersTable.superclass.constructor.call(this, 'SuggestedOrdersTable', container, [['string', 'Type Name'], ['number', 'Type ID']]);
    };
    extend(SuggestedOrdersTable, Table);

    SuggestedOrdersTable.prototype.updateDataTable = function (data) {
        SuggestedOrdersTable.superclass.updateDataTable.call(this, data);
    };

    SuggestedOrdersTable.prototype.update = function (charId) {
        var that = this;
        $.post("/EveApi/GetProfitableItemsNotInMarketOrder", { characterID: charId })
            .done(function (data) {
                that.updateDataTable(eval(data));
            });
    };

    return SuggestedOrdersTable;
});