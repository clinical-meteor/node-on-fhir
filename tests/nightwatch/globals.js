module.exports = {
  "before": function (done) {
    // var chai = require('chai-nightwatch');
    // chai.use(require('dirty-chai'));
    done();
  },
  "default" : {
    "url" : "http://localhost:3000",
    // test user
    "user": {
      "name": "Jane Doe",  
      "username" : "janedoe",
      "password" : "janedoe123",
      "email" : "janedoe@test.org",
      "userId": null
    }
  },
  "circle" : {
    "url" : "http://localhost:3000",
    // test user
    "user": {
      "name": "Jane Doe",
      "username" : "janedoe",
      "password" : "janedoe123",
      "email" : "janedoe@test.org",
      "userId": null
    }
  }
}
