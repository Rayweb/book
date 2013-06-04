Books.module("CartApp", function (CartApp, App, Backbone, Marionette, $, _) {
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
        events: { 'click .btn-primary': 'addItem' },

        addItem: function(){
            if(this.$('input').val() > 0) {
                this.model.set({ qty : this.$('input').val()});
                App.vent.trigger("itemAdded", this.model);
            }  
            this.$('input').val("");
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

        events: { 'click .btn-primary': 'removeItem' },

        removeItem: function(){
            App.vent.trigger("itemRemoved", this.model);
        }
    });
 
    CartApp.EmptyOrderView = Backbone.Marionette.ItemView.extend({
        template : "#emptyOrder"
    })
    
    CartApp.OrderListView = Backbone.Marionette.CompositeView.extend({
        tagName: "table",
        template: "#orderGrid",
        itemView: CartApp.OrderItemView,
        emptyView : CartApp.EmptyOrderView,
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
            var subtotal = this.collection.getTotal();
            var tax = subtotal * .08;
            var total = subtotal + tax;
            this.model.set({subtotal : subtotal});
            this.model.set({tax : tax});
            this.model.set({total : total});
        },

        onRender: function (){
             if(this.collection.length > 0) {
                this.$('thead').removeClass('hide');
                this.$('tfoot').removeClass('hide');
            }
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
            this.collection.reset();
            this.render();
        }

    });
});
