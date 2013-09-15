﻿/// <reference path="../require.js" />

define(function (require) {
    require('../utils/eutils');
    require('./google');
    var RevenueChart = require('./charts/RevenueChart');
    var WalletChart = require('./charts/WalletChart');
    var BalanceDashboard = require('./charts/BalanceDashboard');

    var EveApiCharts = function () { };
    EveApiCharts.prototype = {
        WalletChart: function (chartsContainer, data) {
            return new WalletChart(chartsContainer, data);
        },
        BalanceDashboard: function (chartsContainer, data) {
            return new BalanceDashboard(chartsContainer, data);
        },
        RevenueChart: function (chartsContainer, data) {
            return new RevenueChart(chartsContainer, data);
        }
    };
    return new EveApiCharts();
});