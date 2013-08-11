var CharacterManager = function () {
    var characterId = null,
        characterName = null,

        characterSelectionHandler = (function () {
            var selectionCallbacks = $.Callbacks();
            return {
                addSelectionCallback: function (fn) { selectionCallbacks.add(fn); },
                removeSelectionCallback: function (fn) { selectionCallbacks.remove(fn); },
                executeSelectionCallbacks: function (characterId) { selectionCallbacks.fire(characterId); },
                getCharacterId: function () { return characterId; }
            };
        })();
    function logger(characterId) {
        console.log("Logger--> Character id: " + characterId);
    };
    characterSelectionHandler.addSelectionCallback(logger);

    // character selection - dialog
    $("#selectable").selectable({
        selected: function (event, ui) {
            // it is importend to have only one selected character
            $(ui.selected).siblings().removeClass("ui-selected");

            var selected = $(ui.selected).children();
            characterId = selected[0].value;
            characterName = selected[1].value;

            $("#character_id").val(characterId);
            $("#character_name").val(characterName);
            $("#display_character_name").text("Current Character: " + characterName);
            characterSelectionHandler.executeSelectionCallbacks(characterId);

            // cache selected character data
            $.get("/EveApi/CacheCharacterId", { characterid: characterId, charactername: characterName });

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

    $("#open_character_dialog").click(function () {
        $("#select_character").dialog("open");
    });

    if ($("#character_id").val() == "") {
        $("#select_character").dialog("open");
    } else {
        characterId = $("#character_id").val();
        characterName = $("#character_name").val();
        characterSelectionHandler.executeSelectionCallbacks(characterId);
    }

    return characterSelectionHandler;
};

$(document).ready(function () {
    Charman = new CharacterManager();
});
