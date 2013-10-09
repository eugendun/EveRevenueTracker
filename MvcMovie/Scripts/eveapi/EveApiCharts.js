/// <reference path="../require.js" />

require.config({
    baseUrl: 'Scripts/eveapi/charts'
});

define(function (require) {
    var RevenueChart = require('RevenueChart'),
        WalletChart = require('WalletChart'),
        BalanceDashboard = require('BalanceDashboard'),
        Table = require('Table'),
        SuggestedOrdersTable = require('SuggestedOrdersTable');


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
        },
        Table: function (id, container, columns) {
            return new Table(id, container, columns);
        },
        SuggestedOrdersTable: function (chartsContainer) {
            return new SuggestedOrdersTable(chartsContainer);
        }
    };
    return new EveApiCharts();
});