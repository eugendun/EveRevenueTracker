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
            BalanceChart = null;

        // Get new transcations from the database.
        function updateCharts(charId) {
            $.post("/EveApi/GetTransactions", "characterid=" + charId, function (data) {
                WalletChart = EveApiCharts.WalletChart(document.getElementById('right_overview'), data);
            });
        };

        function updateBalance(charId) {
            $.post("EveApi/GetBalance", "characterId=" + charId, function (data) {
                data = eval(data);
                BalanceChart = EveApiCharts.BalanceDashboard(document.getElementById('Balance'), data);
            });
        };

        // Get statistics
        function updateStats(charId) {
            $('#eve_stats').load("EveApi/GetStats", { characterId: charId });
        };

        $('#character_display').load('EveApi/SelectCharacter', function () {
            CharacterManager.attach(updateStats);
            CharacterManager.attach(updateCharts);
            CharacterManager.attach(updateBalance);
        });

        function getDataFromEveServer() {
            var charId = $("#character_id").val();
            //$.post("/EveApi/UpdateWalletJournal", { characterID: charId });
            $.post("/EveApi/UpdateWalletTransactions", { characterID: charId });
        };

        // update tables link
        $("#update_tables").click(function () {
            //if (characterManager != null && characterManager.getCharacterId() != null) {
            //    var progressbar = $("#progressbar");
            //    var that = $(this);
            //    that.css("display", "none");
            //    progressbar.css("display", "block");

            //    $.post("/EveApi/UpdateWalletTransactions", { characterID: characterManager.getCharacterId() })
            //        .complete(function () {
            //            updateStats(characterManager.getCharacterId());
            //            updateCharts(characterManager.getCharacterId());
            //            progressbar.css("display", "none");
            //            that.css("display", "block");
            //        });
            //}
        });
    });
});