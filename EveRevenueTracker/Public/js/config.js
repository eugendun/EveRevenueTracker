require.config({
    baseUrl: '/Public/js',
    paths: {
        jquery: '../../Scripts/jquery-2.0.3',
        jqueryui: '../../Scripts/jquery-ui-1.10.3',
        jqueryUnobtrusiveAjax: '../../Scripts/jquery.unobtrusive-ajax',
        jqueryValidate: '../../Scripts/jquery.validate',
        jqueryValidateUnobtrusive: '../../Scripts/jquery.validate.unobtrusive',
        jqueryVal: 'helper/jqueryVal',
        underscore: '../../Scripts/underscore',
        backbone: '../../Scripts/backbone',
        text: '../../Scripts/text',
        async: 'requirejs-plugin/async',
        goog: 'requirejs-plugin/goog',
        propertyParser: 'requirejs-plugin/propertyParser',
        google: 'helper/google',
        domReady: 'helper/domReady',
        modernizr: '../../Scripts/modernizr-2.6.2',
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
        },
        jqueryUnobtrusiveAjax: {
            deps: ['jquery']
        },
        jqueryValidate: {
            deps: ['jquery']
        },
        jqueryValidateUnobtrusive: {
            deps: ['jquery', 'jqueryUnobtrusiveAjax']
        }
    }
});