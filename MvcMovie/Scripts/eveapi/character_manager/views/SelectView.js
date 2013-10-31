/// <reference path="../../../backbone.js" />

require.config({
    paths: {
        CharacterCollection: '/Scripts/eveapi/character_manager/collections/CharacterCollection',
        SelectTemplate: '/Scripts/eveapi/character_manager/templates/select-template.html'
    }
});

define([
    'CharacterCollection',
    'text!SelectTemplate',
    'backbone'
], function (CharacterCollection, SelectTemplate) {
    var SelectView = Backbone.View.extend({
        collection: CharacterCollection,
        compiled_template: _.template(SelectTemplate),
        
        events: {
            'change #character-selector': 'onSelect'
        },

        initialize: function () {
            this.collection = new CharacterCollection();
            this.listenTo(this.collection, 'reset', this.render);
        },

        render: function () {
            this.$el.html(this.compiled_template({ id: 'character-selector', label: 'Character:', characters: this.collection.toJSON() }));

            // find selected character and trigger the characterSelected event
            var selectedCharacterId = -1;
            this.$el.find('option').each(function (index, option) {
                if ($(option).prop('selected') === true)
                    selectedCharacterId = $(option).val();
            });
            if (selectedCharacterId !== -1)
                this.trigger('characterSelected', selectedCharacterId);
        },

        onSelect: function (event) {
            this.trigger('characterSelected', event.target.value);
        }
    });
    return SelectView;
});