Books.module("CartApp", function (CartApp, App, Backbone, Marionette, $, _) {
    "use strict";

    CartApp.BookItemView = Marionette.ItemView.extend({
        template: "#catalogRow",
        tagName: "tr",
        events: { 'click .btn-primary': 'itemClick' },

        itemClick: function(){
            App.vent.trigger("itemAdded", this.model, $(this.el).find('input').val());
        },

    });

    CartApp.BookListView = Backbone.Marionette.CompositeView.extend({
        tagName: "table",
        template: "#catalogGrid",
        itemView: CartApp.BookItemView,
        className: "table table-hover",

        appendHtml: function (collectionView, itemView) {
            collectionView.$("tbody").append(itemView.el);
        }
    });

    CartApp.OrderItemView = Marionette.ItemView.extend({
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
        className: "table table-hover",

        intialize : function(){

        },

        appendHtml: function (collectionView, itemView) {
            collectionView.$("tbody").append(itemView.el);
        }
    });
});
