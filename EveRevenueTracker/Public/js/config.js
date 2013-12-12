/// <reference path="../../Scripts/require.js" />

require.config({
    baseUrl: '/Public/js',
    paths: {
        jquery: '../../Scripts/jquery-2.0.3',
        jqueryui: '../../Scripts/jquery-ui-1.10.3',
        underscore: '../../Scripts/underscore',
        backbone: '../../Scripts/backbone',
        text: '../../Scripts/text',
        async: 'requirejs-plugin/async',
        goog: 'requirejs-plugin/goog',
        propertyParser: 'requirejs-plugin/propertyParser',
        google: 'helper/google',
        domReady: 'domReady',
        EveApi: 'Views/EveApi'
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