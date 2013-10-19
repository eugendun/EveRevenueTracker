/// <reference path="../require.js" />

//require.config({
//    paths: {
//        charts:'/Scripts/eveapi/charts'
//    }
//});

define(function (require) {
    var RevenueChart = require('./charts/RevenueChart'),
        WalletChart = require('./charts/WalletChart'),
        BalanceDashboard = require('./charts/BalanceDashboard'),
        Table = require('./charts/Table'),
        SuggestedOrdersTable = require('./charts/SuggestedOrdersTable');


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