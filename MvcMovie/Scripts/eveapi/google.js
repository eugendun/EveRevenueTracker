require.config({
    paths: {
        async: '../requirejs-plugin/async',
        goog: '../requirejs-plugin/goog',
        propertyParser: '../requirejs-plugin/propertyParser'
    }
});

define('google', ['async!http://maps.google.com/maps/api/js?sensor=false', 'goog!visualization,1,packages:[corechart]'], function () { });