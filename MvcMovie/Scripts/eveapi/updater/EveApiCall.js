define(['jquery'], function () {
    var EveApiCall = function () {
        this.load = function (url, params, callbacks) {
            $.post(url, params, callbacks.success).fail(callbacks.fail);
        }
    }

    return EveApiCall;
});