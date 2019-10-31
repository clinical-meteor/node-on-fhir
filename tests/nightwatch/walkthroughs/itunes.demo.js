// // add tests to this file using the Nightwatch.js API
// // http://nightwatchjs.org/api
//
// module.exports = {
//   tags: ['simple', 'static'],
//   "A. Sign In Page" : function (client) {
//     client
//       .url("http://localhost:3000/entrySignUp")
//       .resizeWindow(1024, 768).pause(500)
//       .verify.elementPresent("#entrySignUp")
//       .reviewSignUpPage()
//       .saveScreenshot("tests/nightwatch/screenshots/simple/A-signUpPage.png")
//       .verify.elementNotPresent("#logoutButton")
//       .signUp("carl@somewhere.com", "carl123").pause(1000);
//   },
//   "B. Home Page": function (client){
//     client
//       .resizeWindow(1024, 768).pause(500)
//       .verify.elementPresent("#checklistPage")
//       .saveScreenshot("tests/nightwatch/screenshots/simple/B-ChecklistPage.png")
//       .reviewMainLayout()
//       .reviewSidebar();
//   },
//   "B. Static Pages": function (client){
//     client
//       .click("#aboutButton")
//       .verify.elementPresent("#aboutPage")
//       .saveScreenshot("tests/nightwatch/screenshots/simple/C-AboutPage.png")
//
//       .click("#eulaButton")
//       .waitForPage("#eulaPage")
//       .saveScreenshot("tests/nightwatch/screenshots/simple/D-EulaPage.png")
//
//       .click("#privacyButton")
//       .verify.elementPresent("#privacyPage")
//       .saveScreenshot("tests/nightwatch/screenshots/simple/E-PrivacyPage.png");
//   },
//   "D. Logout": function(client){
//     client
//       .verify.elementPresent("#logoutButton")
//       .click("#logoutButton").pause(300)
//       .verify.containsText("#usernameLink", "Sign In")
//       .verify.elementNotPresent("#logoutButton");
//   },
//   after: function(client){
//     client.end();
//   }
// };
