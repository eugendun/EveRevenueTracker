/// <reference path="../../../backbone.js" />

require.config({
    paths: {
        TableModel: '/Scripts/eveapi/charts/models/TableModel'
    }
});

define(['TableModel', 'backbone'], function (TableModel) {
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