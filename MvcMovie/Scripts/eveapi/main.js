/// <reference path="../require.js" />
/// <reference path="CharacterManager.js" />
/// <reference path="EveApiCharts.js" />

require.config({
    baseUrl: '../Scripts/eveapi',
    paths: {
        'jquery': '../jquery-2.0.3'
    }
});

require(['jquery', 'domReady', 'EveApiCharts', 'CharacterManager'], function ($) {
    // load modules
    EveApiCharts = require('EveApiCharts');
    CharacterManager = require('CharacterManager');

    // prepare the page
    $(document).ready(function () {
        var WalletChart = null,
            BalanceDashboard = null,
            RevenueChart = null,
            chartsContainerElement = document.getElementById('charts_container');

        RevenueChart = EveApiCharts.RevenueChart(chartsContainerElement);
        BalanceDashboard = EveApiCharts.BalanceDashboard(chartsContainerElement);
        WalletChart = EveApiCharts.WalletChart(chartsContainerElement);

        SuggestedOrderTable = EveApiCharts.Table('SuggestedOrderTable', chartsContainerElement, [['string', 'Type Name'], ['number', 'Type ID']]);
        SuggestedOrderTable.update = function (charId) {
            $.post("/EveApi/GetProfitableItemsNotInMarketOrder", { characterID: charId })
                .done(function (data) {
                    SuggestedOrderTable.updateDataTable(eval(data));
                });
        };


        function update(charId) {
            RevenueChart.update(charId);
            BalanceDashboard.update(charId);
            WalletChart.update(charId);
            SuggestedOrderTable.update(charId);

            // Get statistics
            $('#eve_stats').load("EveApi/GetStats", { characterId: charId });
        };

        CharacterManager.attach(update);

        // update tables link
        $("#update_tables").click(function () {
            if (CharacterManager != null && CharacterManager.getId() != null) {
                var progressbar = $("#progressbar");
                var that = $(this);
                that.css("display", "none");
                progressbar.css("display", "block");

                var updateList = ["WalletTransactions", "MarketOrders", "WalletJournal"];

                // TODO should be refactored
                var progressbarHandler = function (listEntry) {
                    var index = updateList.indexOf(listEntry);
                    if (index >= 0) {
                        updateList.splice(index, 1);
                    }

                    if (updateList.length == 0) {
                        progressbar.css("display", "none");
                        that.css("display", "block");

                        update(CharacterManager.getId());
                    }
                }

                $.post("/EveApi/UpdateWalletTransactions", { characterID: CharacterManager.getId() })
                    .complete(function () {
                        progressbarHandler("WalletTransactions");
                    });

                $.post("/EveApi/UpdateMarketOrders", { characterID: CharacterManager.getId() })
                    .complete(function () {
                        progressbarHandler("MarketOrders");
                    });

                $.post("/EveApi/UpdateWalletJournal", { characterID: CharacterManager.getId() })
                    .complete(function () {
                        progressbarHandler("WalletJournal");
                    });
            }
        });
    });
});