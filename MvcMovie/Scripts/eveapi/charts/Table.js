/// <reference path="../../require.js" />

define(function (require) {
    //require('../google');
    var Chart = require('./Chart');

    function Table(id, container, columns) {
        Table.superclass.constructor.call(this, id, container);

        this.chart = new google.visualization.Table(this.getChartContainer());
        this.columns = columns;

    };
    extend(Table, Chart);

    Table.prototype.updateDataTable = function (data) {
        Table.superclass.updateDataTable.call(this, data);
    };

    return Table;
});