/// <reference path="../require.js" />

require.config({
    paths: {
        jquery: '../jquery-2.0.3'
    }
});

define(['jquery'], function ($) {
    var CharacterManager = function () {
        var _characterId = null,
            _characterName = null,
            _selectionCallbacks = $.Callbacks(),
            _notify = function () { _selectionCallbacks.fire(_characterId); };

        return {
            set: function (id, name) {
                _characterId = id;
                _characterName = name;
                _notify();
            },
            getId: function () { return _characterId; },
            getName: function () { return _characterName; },
            attach: function (fn) { _selectionCallbacks.add(fn); },
            detach: function (fn) { _selectionCallbacks.remove(fn); }
        };
    };
    return new CharacterManager();
});