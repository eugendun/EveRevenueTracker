/// <reference path="~/Scripts/underscore.js" />

define([
    'underscore'
], function (_) {
    var EveApiCall = function () { };

    EveApiCall.prototype.load = function (url, params, callbacks) {
        _.delay(callbacks.success, 1000);
    };

    return EveApiCall;
});