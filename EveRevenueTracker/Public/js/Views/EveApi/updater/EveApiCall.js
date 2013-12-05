/// <reference path="~/Scripts/jquery-2.0.3.js" />

define([
    'jquery'
], function ($) {
    var EveApiCall = function () {
        this.load = function (url, params, callbacks) {
            $.post(url, params, callbacks.success).fail(callbacks.fail);
        }
    }

    return EveApiCall;
});