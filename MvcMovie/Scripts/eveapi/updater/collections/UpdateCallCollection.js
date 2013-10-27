require.config({
    paths: {
        UpdateCallModel: '/Scripts/eveapi/updater/models/UpdateCallModel'
    }
});

define(['UpdateCallModel', 'backbone'], function (UpdateCallModel) {
    var UpdateCallCollection = Backbone.Collection.extend({
        model: UpdateCallModel,

        update: function (charId) {
            this.models.forEach(function (model) {
                model.update(charId);
            });
        }
    });

    return UpdateCallCollection;
});