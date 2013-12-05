({
    appDir: '../js',
    baseUrl: './',
    mainConfigFile: '../js/config.js',
    dir: '../release',
    optimize: 'uglify2',
    uglify2: {
        output: {
            beautify: false
        }
    },
    modules: [
                { name: 'views/EveApi/Index'},
                { name: 'views/EveApi/character_manager/collections/CharacterCollection'},
                { name: 'views/EveApi/character_manager/models/CharacterModel'},
                { name: 'views/EveApi/character_manager/views/SelectView'},
                { name: 'views/EveApi/charts/collections/ChartCollection'},
                { name: 'views/EveApi/charts/models/BalanceDashboardModel'},
                { name: 'views/EveApi/charts/models/RevenueChartModel'},
                { name: 'views/EveApi/charts/models/SuggestedTableModel'},
                { name: 'views/EveApi/charts/models/TableModel'},
                { name: 'views/EveApi/charts/models/WalletChartModel'},
                { name: 'views/EveApi/charts/views/BalanceDashboardView'},
                { name: 'views/EveApi/charts/views/ChartCollectionView'},
                { name: 'views/EveApi/charts/views/GoogleChartView'},
                { name: 'views/EveApi/charts/views/RevenueChartView'},
                { name: 'views/EveApi/charts/views/SuggestedTableView'},
                { name: 'views/EveApi/charts/views/TableView'},
                { name: 'views/EveApi/charts/views/WalletChartView'},
                { name: 'views/EveApi/updater/EveApiCall'},
                { name: 'views/EveApi/updater/EveApiCallTest'},
                { name: 'views/EveApi/updater/Updater'},
                { name: 'views/EveApi/updater/collections/UpdateCallCollection'},
                { name: 'views/EveApi/updater/models/UpdateCallModel'},
                { name: 'views/EveApi/updater/views/UpdateCallCollectionView'},
                { name: 'views/EveApi/updater/views/UpdateCallModelView'},
            ],
    onBuildRead: function(moduleName, path, contents) {
        if (moduleName === "config") {
            return contents.replace("/Public/js", "/Public/release");
        }
        return contents;
    },
    // to exclude all text! files set to false
    inlineText: true
})

