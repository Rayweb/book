Books.module('CartApp', function (CartApp, App) {
    'use strict';

    CartApp.Controller = App.AppController.extend({
        
        orderCollection: {},
        orderView: {},
        

        initialize: function (options) {
            var self = this;

            App.vent.on("itemAdded", function (model, qty) {
                self.addProduct(model, qty);
            });

            App.vent.on("itemRemoved", function (model) {
                self.removeProduct(model);
            });
        },


        addProduct: function (model, qty) {
            if (qty > 0) {
                model.set({ qty : qty})
                this.orderCollection.add(model);
                this.renderOrder();
            }
        },

        removeProduct: function(model){
            this.orderCollection.remove(model);
            this.renderOrder();
        },

        renderOrder: function(){
            this.orderView = new CartApp.OrderListView({
                collection: this.orderCollection
            });
            this.orderView.render();
            this.orderView.calculateTotal();
            $("#order").html(this.orderView.el);
        },

        loadProducts: function(){

            this.orderCollection = new App.BookCollection();

            var bookList = new App.BookCollection(Books.CartApp.Books);

            var bookListView = new CartApp.BookListView({
                collection: bookList
            });

            bookListView.render();

            $("#products").html(bookListView.el);

        },

    });

    CartApp.addInitializer(function (args) {
        CartApp.controller = new CartApp.Controller({
            mainRegion: args.mainRegion,
        });
        CartApp.controller.show();
    });

    CartApp.addFinalizer(function () {
        if (CartApp.controller) {
            CartApp.controller.close();
            delete CartApp.controller;
        }
    });

});