/// <reference path="../../Scripts/require.js" />

require.config({
    baseUrl: '/Public/js',
    paths: {
        jquery: '../../Scripts/jquery-2.0.3',
        jqueryui: '../../Scripts/jquery-ui-1.10.3',
        underscore: '../../Scripts/underscore',
        backbone: '../../Scripts/backbone',
        text: '../../Scripts/text',
        async: '../../Scripts/requirejs-plugin/async',
        goog: '../../Scripts/requirejs-plugin/goog',
        propertyParser: '../../Scripts/requirejs-plugin/propertyParser',
        google: '../../Scripts/helper/google',
        domReady: '../../Scripts/domReady',
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
        }
    }
});