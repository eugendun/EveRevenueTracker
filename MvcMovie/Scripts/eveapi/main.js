/// <reference path="../require.js" />
/// <reference path="CharacterManager.js" />
/// <reference path="EveApiCharts.js" />

require.config({
    baseUrl: '../Scripts/eveapi',
    paths: {
        'jquery': '../jquery-2.0.3'
    }
});

require(['jquery', 'domReady', 'EveApiCharts', 'CharacterManager', 'DataUpdater'], function () {
    // load modules
    var EveApiCharts = require('EveApiCharts'),
        CharacterManager = require('CharacterManager'),
        DataUpdater = require('DataUpdater');

    // prepare the page
    $(document).ready(function () {
        var chartsContainerElement = document.getElementById('charts_container'),
            charts = [];

        charts.push(EveApiCharts.RevenueChart(chartsContainerElement));
        charts.push(EveApiCharts.BalanceDashboard(chartsContainerElement));
        charts.push(EveApiCharts.WalletChart(chartsContainerElement));
        charts.push(EveApiCharts.SuggestedOrdersTable(chartsContainerElement));

        var test = new DataUpdater('body');


        function update(charId) {
            charts.forEach(function (element) {
                element.update(charId);
            });

            // Get statistics
            $('#eve_stats').load("EveApi/GetStats", { characterId: charId });

            test.update(charId);
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