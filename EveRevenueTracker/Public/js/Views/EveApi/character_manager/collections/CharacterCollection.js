define([
    'EveApi/character_manager/models/CharacterModel',
    'EveApi/updater/EveApiCall'
], function (CharacterModel, EveApiCall) {
    var eveApiCall = new EveApiCall();

    var CharacterCollection = Backbone.Collection.extend({
        model: CharacterModel,
        url: 'EveApi/GetCharacters',

        initialize: function () {
            this.listenTo(this, 'success', this.success);
            this.listenTo(this, 'fail', this.fail);

            this.fetch({ reset: true });
        }
    });

    return CharacterCollection;
});