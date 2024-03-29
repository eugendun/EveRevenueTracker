﻿define([
    'EveApi/updater/models/UpdateCallModel'
], function (UpdateCallModel) {
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