Books.module('CartApp', {
    startWithParent: false,
    define: function (CartApp, App, Backbone, Marionette, $, _) {
        'use strict';

        var Router = Backbone.Router.extend({
            routes: {
                '': 'init'
            },

            before: function () {
                App.startSubApp('CartApp', {
                    mainRegion: App.main,
                });
            },

            init: function () {
                Books.CartApp.controller.loadProducts();
            }
        });

        App.addInitializer(function () {
            var router = new Router();
        });
    }
});