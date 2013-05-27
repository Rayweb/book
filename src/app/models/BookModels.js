Books.AppController = (function (App, Marionette) {
    'use strict';

    App.BookModel = Backbone.Model.extend({});

    App.BookCollection = Backbone.Collection.extend({
        model: App.BookModel
    });

})(Books, Backbone.Marionette);
