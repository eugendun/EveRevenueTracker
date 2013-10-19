/// <reference path="../require.js" />
/// <reference path="../jquery-2.0.3.js" />

require.config({
    paths: {
        'jquery': '../jquery-2.0.3'
    }
});

define(['jquery'], function () {
    var ApiCall = function (name, url, callback) {
        var _callbacks = $.Callbacks();

        this.name = name;
        this.url = url;
        this.status = "initiate";

        this.addCallback = function (callback) {
            if (typeof (callback) === "function") {
                _callbacks.add(callback);
            }
            return this;
        };

        this.removeCallback = function (callback) {
            if (typeof (callback) === "function") {
                _callbacks.remove(callback);
            }
            return this;
        };

        this.load = function (params) {
            if (typeof (params) !== "object")
                throw Error("Argument should be an object, " + typeof (params) + " is given!");

            if (Object.getOwnPropertyNames(params).length !== 1 && typeof (params.characterid) === undefined)
                throw Error("Invalid object passed. Argument object should have only characterid!");

            this.status = "loading";

            var that = this;
            $.post(url, params)
                .done(function () {
                    that.status = "done"
                    _callbacks.fireWith(that);
                });
        };

        this.addCallback(callback);
        _callbacks.fireWith(this);

        return this;
    };

    var ApiCallView = function (apiCall) {
        if (typeof (apiCall) !== "object" || typeof (apiCall.load) === undefined)
            throw Error("The first argument has to be an object and implements an load function!");

        this.apiCall = apiCall;

        var $container = $("<div></div>"),
            $nameCon = $("<div name='ApiCallName'></div>"),
            $statusCon = $("<div name='ApiCallStatus'></div>");

        $container.append($nameCon);
        $container.append($statusCon);

        $nameCon.text(this.apiCall.name);

        var that = this;
        this.refreshStatus = function () {
            $statusCon.text(that.apiCall.status);
        };

        this.getViewContainer = function () {
            return $container;
        };

        this.apiCall.addCallback(this.refreshStatus);
        this.refreshStatus();
    };

    ApiCallView.prototype.update = function (charId) {
        this.apiCall.load({ characterid: charId });
    };

    var DataUpdater = function (containerId) {
        var css = {
            "float": "left",
            "color": "rgba(117, 238, 48, 0.62)",
            "display": "block",
            "font-size": "12pt",
            "text-shadow": "1px 1px 5px #F8F0F0",
            "font-family": "monospace"
        };

        var $container = $("<div></div>");
        $container.text('Update Status');
        $container.css(css);
        $container.fadeIn(1000);
        $("#" + containerId).prepend($container);

        var statuslog = function (call, container) {
            console.log(call.name + "->" + call.status)
        };

        this.apiCalls = [
            new ApiCallView(new ApiCall("Wallet Transactions", "/EveApi/UpdateWalletTransactions")),
            new ApiCallView(new ApiCall("Market Orders", "/EveApi/UpdateMarketOrders")),
            //new ApiCallView(new ApiCall("Wallet Journal", "/EveApi/UpdateWalletJournal"))
        ];

        this.apiCalls.forEach(function (object) {
            $container.append(object.getViewContainer());
        });
    };

    DataUpdater.prototype.update = function (charId) {
        this.apiCalls.forEach(function (apicall) {
            apicall.update(charId);
        });
    };

    return DataUpdater;
});