import './ssr-init.js';

import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import Links from '/app/api/links.js';

function insertLink(title, url) {
  Links.insert({ title, url, createdAt: new Date() });
}

Meteor.startup(function() {
  WebApp.addHtmlAttributeHook(function() {
      return {
          "lang": "en"
      }
  })
});


Meteor.startup(() => {
  // Need to add a default language for accessibility purposes
  WebApp.addHtmlAttributeHook(function() {
    return {
        "dir": "rtl"
    }
})

  // If the Links collection is empty, add some data.
  if (Links.find().count() === 0) {
    insertLink(
      'Do the Tutorial',
      'https://www.meteor.com/tutorials/react/creating-an-app'
    );

    insertLink(
      'Follow the Guide',
      'http://guide.meteor.com'
    );

    insertLink(
      'Read the Docs',
      'https://docs.meteor.com'
    );

    insertLink(
      'Discussions',
      'https://forums.meteor.com'
    );
  }
});
