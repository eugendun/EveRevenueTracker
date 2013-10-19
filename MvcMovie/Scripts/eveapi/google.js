require.config({
    paths: {
        async: '/Scripts/requirejs-plugin/async',
        goog: '/Scripts/requirejs-plugin/goog',
        propertyParser: '/Scripts/requirejs-plugin/propertyParser'
    }
});

define(['async!http://maps.google.com/maps/api/js?sensor=false', 'goog!visualization,1,packages:[corechart, controls, table]'], function () { });