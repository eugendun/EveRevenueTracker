require.config({
    baseUrl: 'Scripts',
    paths: {
        jquery: '/Scripts/jquery-2.0.3',
        jqueryui: '/Scripts/jquery-ui-1.10.3',
        updater: 'eveapi/updater',
        charts: 'eveapi/charts',
        character_manager: 'eveapi/character_manager',
        eveapicall: '/Scripts/eveapi/updater/EveApiCall',
        google: '/Scripts/eveapi/google',
        backbone: '/Scripts/backbone',
        underscore: '/Scripts/underscore',
        text: '/Scripts/text'
    },

    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        jquery: {
            exports: '$'
        },
        jqueryui: {
            deps: ['jquery']
        }
    }
});

require([
    //'updater/Updater',
    'character_manager/collections/CharacterCollection',
    'character_manager/views/SelectView',
    'charts/views/TableCollectionView',
    'backbone',
    'jquery',
    'domReady'
], function (CharacterCollection, SelectView, TableCollectionView) {
    // get html container for charts
    var $chartsContainer = $('#charts_container');

    // character selection
    var characterSelectionView = new SelectView();
    $chartsContainer.prepend(characterSelectionView.el);

    var tableCollectionView = new TableCollectionView();
    $chartsContainer.append(tableCollectionView.el);

    tableCollectionView.listenTo(characterSelectionView, 'characterSelected', tableCollectionView.onCharacterSelected);

    // eve api updater
    //var updater = new Updater(document.getElementById('#todo'));
    //updater.getUpdateCalls().add([
    //    { name: 'Wallet Transactions', url: 'EveApi/UpdateWalletTransactions' },
    //    { name: 'Market Orders', url: 'EveApi/UpdateMarketOrders' },
    //    { name: 'Wallet Journal', url: 'EveApi/UpdateWalletJournal' }
    //]);

    //updater.listenTo(characterSelectionView, 'characterSelected', updater.update);
});