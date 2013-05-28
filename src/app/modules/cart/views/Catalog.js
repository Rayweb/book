Books.module("CartApp", function (CartApp, App, Backbone, Marionette, $, _) {
    "use strict";

    CartApp.Layout = Backbone.Marionette.Layout.extend({
        template: "#CatalogLayout",
        regions: {
            categories : '#categories',
            products : '#products',
            order : '#order'
        }
    });

    CartApp.BookItemView = Marionette.ItemView.extend({
        template: "#catalogRow",
        tagName: "tr",
        events: { 'click .btn-primary': 'itemClick' },

        itemClick: function(){
            App.vent.trigger("itemAdded", this.model, this.$('input').val());
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
        className: "table table-hover",

        appendHtml: function (collectionView, itemView) {
            collectionView.$("tbody").append(itemView.el);
        },

        onRender : function(){
            this.calculateTotal();
        },
        calculateTotal: function () {
            this.$('input').val(this.collection.getTotal());
        }
    });
});
