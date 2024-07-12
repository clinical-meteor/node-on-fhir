// // add tests to this file using the Nightwatch.js API
// // http://nightwatchjs.org/api

// module.exports = {
//   tags: ['routes', 'patients'],
//   before: function(client){
//     client
//       .url("http://localhost:3000").pause(3000)
//       .executeAsync(function(done){
//         Meteor.call('initializeTestUsers');
//         done();
//       });
//   },
//   "/": function (client) {
//     client
//       .resizeWindow(1024, 768)

//       .url("http://localhost:3000").pause(1000)
//         .verify.elementPresent("body")
//         .verify.elementPresent("#publicNavigation")
//         .verify.elementPresent("#signupLink")
//         .verify.elementPresent("#signinLink")
//         .saveScreenshot("tests/nightwatch/screenshots/routes.patients/root.png");
//   },
//   "/signin": function (client) {
//     client
//       .url("http://localhost:3000/signin").pause(1200)
//         .verify.elementPresent("#signinPage");
//   },
//   "/signup": function (client) {
//     client.page.signupPage()
//       .navigate()
//       .fillOutSignupPage('Alice', 'Doe', 'alice@test.org', 'alicedoe')
//       .saveScreenshot('tests/nightwatch/screenshots/routes.patients/A-signupPage.png')
//       .signup()
//       .pause(1000);
//   },
//   "/ (signed in)": function (client) {
//     client
//       .url("http://localhost:3000").pause(2000)
//         .verify.elementPresent("#mainPanel")
//         .verify.elementPresent("#appHeader")        
//         .verify.elementPresent("#authenticatedUsername")
//         .verify.elementNotPresent("#notFoundPage")
//         .saveScreenshot("tests/nightwatch/screenshots/routes.patients/index.png");
//   },
//   "End": function (client) {
//     client
//       .end();
//   }
// };
