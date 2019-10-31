//
// // - it should resize templates when window resized
// // - it should resize templates when device orientation changes
//
//
// // Gagarin Verification Tests
// // - it should display in fullscreen mode
// // - it should display in sidebar mode
// // - it should display in page mode
// // - it should display in fence mode
// // - it should specify a northFence for templates
// // - it should specify a southFence for templates
// // - it should specify an eastFemce for templates
// // - it should specify a westFence for templates
// // - it should hide/show sidebar
//
// // - swipe right should open menu on phone and portrait tablet
// // - swipe left should close menu on phone and portrait tablet
//
// // Nightwatch Validation Tests
// // - it should display menu and fullscreen offset on phone instead of in a mode
// // - it should only display page mode on tablet when in landscape mode
// // - it should display menu and fullscreen offset on tablet when in portrait mode
//
// // - it should hide/show navbars
// // - it should hide/show footer
// // - it should hide/show header
//
// module.exports = {
//   tags: ['layout'],
//   before: function(client){
//     // this depends on the accounts-housemd package
//     client
//       .url("http://localhost:3000")
//       //.initializeLists()
//       .pause(500)
//   },
//   "background color should be the theme color": function(client){
//     client
//       .pause(500)
//       .verify.cssProperty('body', 'background-image', '-webkit-linear-gradient(top, rgb(85, 85, 85), rgb(170, 170, 170) 100%)')
//   },
//   "sidebar should be visible in landscape and desktop modes" : function (client) {
//     client
//       .resizeWindow(1024, 768)
//       .verify.elementPresent("#sidebar")
//       .verify.elementPresent("#usernameLink")
//       .verify.elementPresent("#mainPanel")
//   },
//   "sidebar should be hidden in phone mode" : function (client) {
//     client
//       .resizeWindow(480, 800).pause(500)
//         .verify.visible("#navbarHeader")
//         .verify.elementPresent("#navbarLayer")
//         // .verify.cssProperty("#navbarLayer", "transform", "matrix(1, 0, 0, 1, 0, 0)")
//         .verify.cssProperty("#navbarLayer", "left", "0px")
//         .saveScreenshot("tests/nightwatch/screenshots/layout/Phone-Portait.png")
//   },
//   "sidebar should be hidden in tablet portrait mode" : function (client) {
//     client
//       .resizeWindow(768, 1024).pause(500)
//         .verify.visible("#navbarHeader")
//         .verify.elementPresent("#navbarLayer")
//         // .verify.cssProperty("#navbarLayer", "transform", "matrix(1, 0, 0, 1, 0, 0)")
//         .verify.cssProperty("#navbarLayer", "left", "0px")
//         .saveScreenshot("tests/nightwatch/screenshots/layout/Tablet-Portait.png")
//   },
//   "sidebar should be visible in landscape mode" : function (client) {
//     client
//       .resizeWindow(1024, 768).pause(500)
//         .verify.visible("#navbarHeader")
//         .verify.elementPresent("#navbarLayer")
//         .verify.cssProperty("#navbarLayer", "left", "270px")
//         // .verify.cssProperty("#navbarLayer", "transform", "matrix(1, 0, 0, 1, 0, 0)")
//         .saveScreenshot("tests/nightwatch/screenshots/layout/Tablet-Landscape.png")
//   },
//   "anonymous user - sidebar toggle opens and closes in phone mode" : function (client) {
//     client
//       .resizeWindow(480, 800).pause(500)
//         .verify.visible("#navbarHeader")
//         .verify.elementPresent("#navbarLayer")
//         // .verify.cssProperty("#navbarLayer", "transform", "matrix(1, 0, 0, 1, 0, 0)")
//         .verify.cssProperty("#navbarLayer", "left", "0px")
//         .saveScreenshot("tests/nightwatch/screenshots/layout/Tablet-Phone-Closed.png")
//         .click("#navbarHeader").pause(500)
//         .verify.cssProperty("#navbarLayer", "left", "0px")
//         .verify.cssProperty("#navbarLayer", "transform", "matrix(1, 0, 0, 1, 270, 0)")
//         .click("#navbarHeader").pause(500)
//         .saveScreenshot("tests/nightwatch/screenshots/layout/Tablet-Phone-Open.png")
//   },
//   "anonymous user - sidebar toggle opens and closes in portrait mode" : function (client) {
//     client
//       .resizeWindow(768, 1024).pause(500)
//         .verify.visible("#navbarHeader")
//         .verify.elementPresent("#navbarLayer")
//         // .verify.cssProperty("#navbarLayer", "transform", "matrix(1, 0, 0, 1, 0, 0)")
//         .saveScreenshot("tests/nightwatch/screenshots/layout/Tablet-Portrait-Pagescreen.png")
//         .verify.cssProperty("#navbarLayer", "left", "0px")
//         .click("#navbarHeader").pause(500)
//         .verify.cssProperty("#navbarLayer", "left", "0px")
//         .verify.cssProperty("#navbarLayer", "transform", "matrix(1, 0, 0, 1, 270, 0)")
//         .saveScreenshot("tests/nightwatch/screenshots/layout/Tablet-Portrait-Fullscreen.png")
//         .click("#navbarHeader").pause(500)
//   },
//   "anonymous user - sidebar toggle switches between pagescreen and fullscreen in landscape mode" : function (client) {
//     client
//       .resizeWindow(1024, 768).pause(500)
//         .verify.visible("#navbarHeader")
//         .verify.elementPresent("#navbarLayer")
//
//         // start out in pagescreen mode
//         .verify.cssProperty("#navbarLayer", "left", "270px")
//         .verify.cssProperty("#navbarLayer", "transform", "none")
//         .saveScreenshot("tests/nightwatch/screenshots/layout/Tablet-Landscape-Pagescreen.png")
//
//         // toggle and go into fullscreen mode
//         .click("#navbarHeader").pause(500)
//         .verify.cssProperty("#navbarLayer", "left", "0px")
//         .verify.cssProperty("#navbarLayer", "transform", "matrix(1, 0, 0, 1, 0, 0)")
//         .saveScreenshot("tests/nightwatch/screenshots/layout/Tablet-Landscape-Fullscreen.png")
//         .pause(1000)
//
//         // back to pagescreen
//         .click("#navbarHeader").pause(500)
//         .verify.cssProperty("#navbarLayer", "left", "270px")
//         .verify.cssProperty("#navbarLayer", "transform", "none")
//   },
//   "cmd+ctrl+n should hide/show navbar": function(client){
//     client
//       .resizeWindow(1024,768).pause(500)
//       // navbars should be visible
//       .verify.elementPresent("#navbarHeader")
//       .verify.cssProperty("#navbarHeader", "height", "50px")
//       .verify.cssProperty("#navbarHeader", "top", "0px")
//       .verify.elementPresent("#navbarFooter")
//       .verify.cssProperty("#navbarFooter", "height", "50px")
//       //.verify.cssProperty("#navbarFooter", "top", "0px")
//       .saveScreenshot("tests/nightwatch/screenshots/layout/Tablet-Landscape-Navbars-Visible.png")
//
//       // we toggle the navbars with hotkeys
//       .keys(client.Keys.CONTROL)
//       .keys(client.Keys.COMMAND)
//       .keys('n')
//       .pause(500)
//       .keys(client.Keys.NULL)
//
//       // navbars should be hidden
//       .verify.elementPresent("#navbarHeader")
//       .verify.cssProperty("#navbarHeader", "height", "0px")
//       .verify.cssProperty("#navbarHeader", "top", "-50px")
//       .verify.elementPresent("#navbarFooter")
//       .verify.cssProperty("#navbarFooter", "height", "0px")
//       .saveScreenshot("tests/nightwatch/screenshots/layout/Tablet-Landscape-Navbars-Hidden.png")
//
//       // we toggle the navbars again
//       .keys(client.Keys.CONTROL)
//       .keys(client.Keys.COMMAND)
//       .keys('n')
//       .pause(500)
//       .keys(client.Keys.NULL)
//
//       // the navbars should now be visible
//       .verify.elementPresent("#navbarHeader")
//       .verify.cssProperty("#navbarHeader", "height", "50px")
//       .verify.cssProperty("#navbarHeader", "top", "0px")
//       .verify.elementPresent("#navbarFooter")
//       .verify.cssProperty("#navbarFooter", "height", "50px")
//       //.verify.cssProperty("#navbarFooter", "top", "0px")
//   },
//     after: function(client){
//     client.end();
//   }
// }
