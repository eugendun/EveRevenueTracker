/// <reference path="../require.js" />
/// <reference path="CharacterManager.js" />
/// <reference path="EveApiCharts.js" />

require.config({
    paths: {
        jquery: '../jquery-2.0.3',
        jqueryui: '../jquery-ui-1.10.3'
    }
});

require(['jquery', 'jqueryui', 'domReady', 'EveApiCharts', 'CharacterManager'], function () {
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

        function update(charId) {
            RevenueChart.update(charId);
            BalanceDashboard.update(charId);
            WalletChart.update(charId);

            // Get statistics
            $('#eve_stats').load("EveApi/GetStats", { characterId: charId });
        };

        $('#character_display').load('EveApi/SelectCharacter', function () {
            CharacterManager.attach(update);
        });

        // update tables link
        $("#update_tables").click(function () {
            if (CharacterManager != null && CharacterManager.getId() != null) {
                var progressbar = $("#progressbar");
                var that = $(this);
                that.css("display", "none");
                progressbar.css("display", "block");

                $.post("/EveApi/UpdateWalletTransactions", { characterID: CharacterManager.getId() })
                    .complete(function () {
                        update(CharacterManager.getId());
                        progressbar.css("display", "none");
                        that.css("display", "block");
                    });

                $.post("/EveApi/UpdateMarketOrders", { characterID: CharacterManager.getId() });

                $.post("/EveApi/GetProfitableItemsNotInMarketOrder", { characterID: CharacterManager.getId() })
                    .done(function (data) {
                        progressbar.css("display", "none");
                        that.css("display", "block");

                        SuggestedOrderTable.updateDataTable(eval(data));
                    });
            }
        });
    });
});