/// <reference path="~/Scripts/backbone.js" />

define([
    'EveApi/charts/models/TableModel'
], function (TableModel) {
    var TableCollection = Backbone.Collection.extend({
        model: TableModel,

        update: function (charId) {
            this.models.forEach(function (model) {
                model.update(charId);
            });
        }
    });

    return TableCollection;
});