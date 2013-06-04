Books.module('CartApp', {
    startWithParent: false,
    define: function (CartApp, App, Backbone, Marionette, $, _) {
        'use strict';

        var Router = Backbone.Router.extend({
            routes: {
                "(:category)(/:id)": "init"
            },
            
            before: function () {
            var ordersPlaced = new Backbone.Collection();
                ordersPlaced.localStorage = new Backbone.LocalStorage("orders");
                ordersPlaced.fetch();
                console.log(ordersPlaced.toJSON());
                _.each(ordersPlaced.toArray(),function(model){
                    model.destroy();
                });
                console.log(ordersPlaced.toJSON());

                App.startSubApp('CartApp', {
                    mainRegion: App.main,
                });
            },

            init: function (category,id) {
                Books.CartApp.controller.loadProducts(category,id);
            }
        });

        App.addInitializer(function () {
            var router = new Router();
        });
    }
});