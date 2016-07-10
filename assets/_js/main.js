'use strict';

var Vue = require('vue');

var api = 'http://api.wp-app.org/wp-json/wp/v2/posts';

document.addEventListener('DOMContentLoaded', function () {
  var vm = new Vue({
    el: '#vue-app',
    data: {
      articles: [],
      nowWatching: -1
    },
    computed: {
      articlesNum: function () {
        return this.articles.length;
      },
      fetchDone: function () {
        return this.nowWatching >= 0;
      }
    },
    methods: {
      fetchData: function () {
        var self = this;
        fetch(api, {mode: 'cors'}).then(function (response) {
          return response.json()
        }).then(function (data) {
          data.forEach(function (e) {
            self.articles.push(e.content.rendered);
          });
          self.nowWatching = 0;
        });
      },
      next: function () {
        this.nowWatching = (this.nowWatching + 1) % this.articlesNum;
        window.scroll(0, 0);
      },
      prev: function () {
        this.nowWatching = (this.nowWatching - 1 + this.articlesNum) % this.articlesNum;
        window.scroll(0, 0);
      },
      keyDown: function (event) {
        if (event.keyCode === 0x25)
          this.prev();
        else if (event.keyCode == 0x27)
          this.next();
      }
    }
  });

});
