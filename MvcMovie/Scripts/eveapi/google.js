require.config({
    baseurl: '../Scripts',
    paths: {
        async: 'requirejs-plugin/async',
        goog: 'requirejs-plugin/goog',
        propertyParser: 'requirejs-plugin/propertyParser'
    }
});

define(['async!http://maps.google.com/maps/api/js?sensor=false', 'goog!visualization,1,packages:[corechart, controls, table]'], function () { });