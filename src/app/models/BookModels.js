Books.AppController = (function (App, Marionette) {
    'use strict';

    App.BookModel = Backbone.Model.extend({});

    App.BookCollection = Backbone.Collection.extend({
        model: App.BookModel,

        getTotal: function(){
            return this.reduce(
                function (total, value) {
                    return total + value.get("price") * value.get("qty")
                }, 0);
        }
    });

})(Books, Backbone.Marionette);
