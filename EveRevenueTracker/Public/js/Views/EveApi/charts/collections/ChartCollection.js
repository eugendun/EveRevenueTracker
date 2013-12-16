define([
    'EveApi/charts/models/TableModel'
], function (TableModel) {
    var ChartCollection = Backbone.Collection.extend({
        model: TableModel,

        update: function (charId) {
            this.models.forEach(function (model) {
                model.update(charId);
            });
        }
    });

    return ChartCollection;
});