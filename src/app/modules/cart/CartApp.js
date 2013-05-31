Books.module('CartApp', function (CartApp, App) {
    'use strict';

    CartApp.Controller = App.AppController.extend({
        
        orderCollection: {},
        orderView: {},
        totals: {},

        initialize: function (options) {
            var self = this;
            this.cartLayout = new CartApp.Layout();
            this.mainRegion.show(this.cartLayout);
            App.vent.on("itemAdded", function (model, qty) {
                self.addProduct(model, qty);
            });

            App.vent.on("itemRemoved", function (model) {
                self.removeProduct(model);
            });
        },


        addProduct: function (model) {
            this.orderCollection.add(model);
            if(this.orderView !== undefined){
                this.orderView = new CartApp.OrderListView({ model : this.totals, collection: this.orderCollection});
                this.cartLayout.order.show(this.orderView);
            }
        },

        removeProduct: function(model){
            this.orderCollection.remove(model);
            this.orderView.render();
        },

        loadProducts: function(category,id){
            this.totals = new App.TotalsModel();
            this.orderCollection = new App.BookCollection();
            this.bookList = new App.BookCollection(Books.CartApp.Books);
            this.displayCategories();
            if(category){
                var matched = this.bookList.where({category:category});
                this.bookList.reset(matched);
            }
            this.bookListView = new CartApp.BookListView({
                collection: this.bookList
            });
            this.cartLayout.products.show(this.bookListView);
        },

        displayCategories: function () {

            var Category = Backbone.Model.extend({
                defaults :{
                    name : '',
                    booksOnCategory:0
                }
            });
            var Categories = Backbone.Collection.extend({
                model: Category
            });
            this.categories = new Categories();
            var categoriesData = this.bookList.groupBy("category");
            for (var key in categoriesData) {
                var category = new Category({
                    name:key,
                    booksOnCategory:categoriesData[key].length
                });
                this.categories.add(category);
                
            }
            this.categoriesView = new CartApp.CategoriesView({collection:this.categories});
            this.cartLayout.categories.show(this.categoriesView);
        }

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