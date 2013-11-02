﻿require([
    'EveApi/character_manager/collections/CharacterCollection',
    'EveApi/character_manager/views/SelectView',
    'EveApi/charts/views/TableCollectionView',
    'jquery'
], function (CharacterCollection, SelectView, TableCollectionView, $) {
    // get html container for charts
    var $chartsContainer = $('#charts_container');

    // character selection
    var characterSelectionView = new SelectView();
    $chartsContainer.prepend(characterSelectionView.el);

    var tableCollectionView = new TableCollectionView();
    $chartsContainer.append(tableCollectionView.el);

    tableCollectionView.listenTo(characterSelectionView, 'characterSelected', tableCollectionView.onCharacterSelected);
});