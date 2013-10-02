/// <reference path="../require.js" />
/// <reference path="../jquery-2.0.3.js" />

require.config({
    baseUrl: '../Scripts',
    paths: {
        'jquery': 'jquery-2.0.3',
        'jqueryui': 'jquery-ui-1.10.3'
    }
});

define(['jquery', 'jqueryui'], function () {
    var CharacterManager = function () {
        var _characterId,

            _characterName,

            _selectionCallbacks = $.Callbacks(),

            _notify = function () {
                _selectionCallbacks.fire(_characterId); console.log("CharacterManager notifier");
            },

            initialize = function () {
                $("#open_character_dialog").click(function () {
                    $("#select_character").dialog("open");
                });

                $('#selectable').selectable({
                    selected: function (event, ui) {
                        // it is importend to have only one selected character
                        $(ui.selected).siblings().removeClass("ui-selected");

                        var selected = $(ui.selected).children(),
                            charId = selected[0].value,
                            charName = selected[1].value;

                        set(charId, charName);

                        $("#select_character").dialog("close");
                    }
                });

                $("#select_character").dialog({
                    autoOpen: false,
                    dialogClass: "no-close",
                    modal: true,
                    show: {
                        effect: "blind",
                        duration: 1000
                    },
                    hide: {
                        effect: "blind",
                        duration: 1000
                    }
                });

                if ($("#character_id").val() == "") {
                    $("#select_character").dialog("open");
                } else {
                    var charId = $("#character_id").val(),
                        charName = $("#character_name").val();
                    set(charId, charName);
                }

                console.log("CharacterManager initialized");
            },

            set = function (charId, charName) {
                _characterId = charId;
                _characterName = charName;

                updateInfoDisplay();
                _notify();
                cacheOnServer();
            },

            updateInfoDisplay = function () {
                $("#character_id").val(_characterId);
                $("#character_name").val(_characterName);
                $("#display_character_name").text("Current Character: " + _characterName);
            },

            cacheOnServer = function () {
                // cache selected character data
                // TODO this call should be a post call
                $.get("/EveApi/CacheCharacterId", { characterid: _characterId, charactername: _characterName });
            };

        // Load SelectCharacter view to the specified location
        $('#character_display').load('EveApi/SelectCharacter', initialize);

        return {
            getId: function () {
                return _characterId;
            },

            getName: function () {
                return _characterName;
            },

            // Adds function fn to the callback list and call this function with current character id.
            attach: function (fn) {
                _selectionCallbacks.add(fn);
                fn(_characterId);
            },

            // Removes function fn from the callback list.
            detach: function (fn) {
                _selectionCallbacks.remove(fn);
            }
        };
    };

    return new CharacterManager();
});