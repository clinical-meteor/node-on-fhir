module.exports = {
  url: 'http://localhost:3000/weblog',
  commands: [{
    post: function(text) {
      var self = this;
      var textArray = text.split('');

      self.verify.elementPresent('#addPostCard textarea').clearValue('#addPostCard textarea');

      textArray.forEach(function(letter){
        self.setValue('#addPostCard textarea', letter);
      });

      self.verify.attributeEquals('#addPostCard textarea', 'value', text).click('#addPostButton');

      return self;
    },
    confirmPostCreated: function(text, index) {
      return this
        .verify.elementPresent('#weblogPage')
        .verify.elementPresent('#weblogPage .postDeck')
        .verify.elementPresent('#weblogPage .postDeck .postCard:nth-child(' + index + ')')
        .verify.elementPresent('#weblogPage .postDeck .postCard:nth-child(' + index + ') .postTitle')
        .verify.containsText('#weblogPage .postDeck .postCard:nth-child(' + index + ') .postTitle', text);
        // .verify.elementPresent('#weblogPage .postDeck .postCard:nth-child(1) .title')
        // .verify.attributeEquals('#weblogPage .postDeck .postCard:nth-child(1) .title', 'value', text)
    },
    edit: function(title, text, image, labels) {
      return this;
       //.stuff()
    },
    search: function(string) {
      return this;
       //.stuff()
    },
    remove: function(postId) {
      return this;
       //.stuff()
    },
    filterByLabel: function(postId) {
      return this;
       //.stuff()
    },
    verifyElements: function() {
      return this
        .verify.elementPresent('#addPostCard textarea')
        .verify.elementPresent('#weblogPage')
        .verify.elementPresent('#addPostCard')
        .verify.elementPresent('#addPostButton');
    }
  }],
  elements: {}
};
