define(['underscore'], function () {
    var EveApiCall = function () { };

    EveApiCall.prototype.load = function (url, params, callbacks) {
        _.delay(callbacks.success, 1000);
    };

    return EveApiCall;
});