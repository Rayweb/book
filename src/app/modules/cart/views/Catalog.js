﻿Books.module("CartApp", function (CartApp, App, Backbone, Marionette, $, _) {
    "use strict";

    CartApp.Layout = Backbone.Marionette.Layout.extend({
        template: "#CatalogLayout",
        regions: {
            categories : '#categories',
            products : '#products',
            order : '#order',
            book: '#book'
        }
    });

    CartApp.CategoryView = Backbone.Marionette.ItemView.extend({
        template: "#categoryTemplate"
    });


    CartApp.CategoriesView = Backbone.Marionette.CollectionView.extend({
        itemView:CartApp.CategoryView
    });


    CartApp.BookItemView = Backbone.Marionette.ItemView.extend({
        template: "#catalogRow",
        tagName: "tr",
        events: { 'click .btn-primary': 'itemClick' },

        itemClick: function(){
            if(this.$('input').val() > 0) {
                this.model.set({ qty : this.$('input').val()});
                App.vent.trigger("itemAdded", this.model);
            }  
        },

    });

    CartApp.BookListView = Backbone.Marionette.CompositeView.extend({
        tagName: "table",
        template: "#catalogGrid",
        itemView: CartApp.BookItemView,
        className: "table table-hover table-condensed",

        appendHtml: function (collectionView, itemView) {
            collectionView.$("tbody").append(itemView.el);
        }
    });

    CartApp.OrderItemView = Backbone.Marionette.ItemView.extend({
        template: "#orderRow",
        tagName: "tr",

        events: { 'click .btn-primary': 'itemClick' },

        itemClick: function(){
            App.vent.trigger("itemRemoved", this.model);
        }
    });

    
    CartApp.OrderListView = Backbone.Marionette.CompositeView.extend({
        tagName: "table",
        template: "#orderGrid",
        itemView: CartApp.OrderItemView,
        className: "table table-hover table-condensed",
        initialize : function () {
            this.orders = new App.Orders();
            this.orders.localStorage = new Backbone.LocalStorage("orders");
        },
        events : {
            "click #placeOrder" : "saveOrder"
        },
        appendHtml: function (collectionView, itemView) {
            collectionView.$("tbody").append(itemView.el);
        },

        onBeforeRender: function () {
            this.model.set({total :  this.collection.getTotal()});
        },

        saveOrder : function () {
            this.order = new App.Order();
            this.order.set({
                totals: this.model,
                booksOrdered : this.collection,
                datePlaced : new Date()
            });
            this.orders.add(this.order);
            this.order.save();
          //  this.orders.each(function(model) {
          //       model.save();
          //  });

            var c = new Backbone.Collection();
            c.localStorage = new Backbone.LocalStorage("orders");
            c.fetch();
            console.log(c.toJSON());
        }

    });
});
