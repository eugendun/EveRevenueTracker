/// <reference path="../require.js" />

define(function (require) {
    require('../utils/eutils');
    require('./google');
    var RevenueChart = require('./charts/RevenueChart');
    var WalletChart = require('./charts/WalletChart');
    var BalanceChart = require('./charts/BalanceChart');
    var BalanceDashboard = require('./charts/BalanceDashboard');

    var EveApiCharts = function () { };
    EveApiCharts.prototype = {
        WalletChart: function (chartsContainer, data) {
            return new WalletChart(chartsContainer, data);
        },
        BalanceChart: function (chartsContainer, data) {
            return new BalanceChart(chartsContainer, data);
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