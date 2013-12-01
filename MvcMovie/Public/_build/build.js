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

