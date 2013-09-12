/// <reference path="../require.js" />

require.config({
    paths: {
        'eutils': '../utils/eutils',
        'revenuechart': 'charts/RevenueChart',
        'walletchart': 'charts/WalletChart',
        'balancechart': 'charts/BalanceChart',
        'balancedashboard': 'charts/BalanceDashboard'
    }
});

define('EveApiCharts', ['revenuechart', 'walletchart', 'balancechart', 'balancedashboard', 'eutils', 'google'], function () {
    var RevenueChart = require('revenuechart');
    var WalletChart = require('walletchart');
    var BalanceChart = require('balancechart');
    var BalanceDashboard = require('balancedashboard');

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