define(['backbone'], function (Backbone) {
    var CharacterModel = Backbone.Model.extend({
        defaults: {
            characterID: null,
            characterName: null
        },

        validate: function (attrs, options) {
            if (!_.isNumber(attrs.characterID))
                return "character id must be a number";
            if (!_.isString(attrs.characterName) || _.isEmpty(attrs.characterName))
                return "character name must be a not empty string";
        }
    });

    return CharacterModel;
});