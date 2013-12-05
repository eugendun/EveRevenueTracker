/// <reference path="../../../../Scripts/domReady.js" />

require([
    'EveApi/character_manager/collections/CharacterCollection',
    'EveApi/character_manager/views/SelectView',
    'EveApi/charts/views/ChartCollectionView',
    'EveApi/updater/Updater',
    'jquery',
    'domReady'
], function (CharacterCollection, SelectView, ChartCollectionView, Updater, $, domReady) {
    domReady(function () {
        // get html container for charts
        var $chartsContainer = $('#charts_container');

        // character selection
        var characterSelectionView = new SelectView();
        $chartsContainer.prepend(characterSelectionView.el);

        var chartCollectionView = new ChartCollectionView();
        $chartsContainer.append(chartCollectionView.el);
        chartCollectionView.listenTo(characterSelectionView, 'characterSelected', chartCollectionView.onCharacterSelected);

        var ud = new Updater();
        ud.listenTo(characterSelectionView, 'characterSelected', ud.update);
    });
});