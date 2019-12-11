## Settings File  

The `configs` directory contains a number of .json settings file, which are used with the `meteor run --settings` command or the `METEOR_SETTINGS` environment variable.  Once loaded, they can be accessed from within the application by importing the `Meteor` object and inspecting `Meteor.settings`.  

```js
import { Meteor } from 'meteor/meteor';

Meteor.startup(function(){
  console.log(Meteor.settings);
})
```


## Configurable Settings  

The `Node on FHIR` application supports the following fields and options.  We allow these to be turned on and off so that the base build can be used in a variety of different apps and websites.  It also allows for great A/B testing.  

**public.title**  
Used in multiple places in the application - header, logging, emails, tabs, etc.  

**public.theme**   
A meta-theme that manages colors, styles, and images for a half-dozen theme infrastructures used by different libraries in this stack.  Material UI has changed it's theme architecture over the years, and various data visualizations packages that we've used have their own theming.  This is just a centralized place to put all those different configs.

**public.theme.showVideoBackground**  
Enables video background functionality.  For best results, set your card or paper background to an RGBA color with some amount of alpha channel, or at the very least set the opacity of the card to something less than 1.    

**public.theme.darkroomTextEnabled**  
Deprecated.  Set palette colors instead.

**public.theme.defaultVideo**  
Default video used in background.

**public.theme.backgroundImagePath**  
URL of the image to display in the background.  If an absolute URL is set, make sure that that network connectivity is available and the resource is available.  If a relative URL is set, it will be relative to the /public directory.  

**public.theme.palette**  
Color palette to use throughout the application.

**public.home**  
Mostly deprecated.  

**public.defaults**  
Default behavior for the application.  

**public.defaults.route**  
The default URL that the application will route to when you visit the site, login, etc.  

**public.defaults.disableHeader**  
Disables the header.  Generallyu used with `disableFooter` to achieve a full-page canvas affect.  Useful for full screen video applications or video games.  

**public.defaults.disableFooter**  
Disables the footer.  Most commonly used to create a traditional webpage view.  

**public.defaults.paginationLimit**  
Pagination limit is the maximum number of rows to display in a table.  After that number of rows, you need to press 'next' to get the next page of data.

**public.defaults.subscriptionLimit**  
Subscription limit is websocket pub/sub specific functionality, and limits the number of records that are returned in a publication.  

**public.defaults.sidebar**  
The sidebar is dynamically generated from the settings file and plugins/packages that are loaded into memory at application at runtime.  

**public.defaults.sidebar.menuItems**  
There are a number of default menu items that are available to most any application.  These include the HomePage, AboutPage, PrivacyPage, and such.  These page routes exist regardless of whether you have user interface that can navigate to them.  The settings file allows you to configure the sidebar so you can navigate to the various elements.

**public.defaults.sidebar.menuItems.HomePage**  
Include the HomePage button in the sidebar.  

**public.defaults.sidebar.menuItems.AboutPage**  
Include the AboutPage button in the sidebar.  

**public.defaults.sidebar.menuItems.PrivacyPage**  
Include the PrivacyPage button in the sidebar.  

**public.defaults.sidebar.menuItems.FhirResources**  
Include a button for each of the FHIR resources that is enabled for this application.  All of the FHIR resources will be grouped together in their own menu block.  

**public.defaults.sidebar.menuItems.DynamicModules**  
Dynamic modules are other buttons that exported from packages.  These are workflow specific menu options.  Anytime you want to create a dashboard, report, visualization, or other special user interface, you'll probably want to export a dynamic module.  

**public.defaults.sidebar.hidden**  
The settings file can override the default rendering of sidebar menu items, and hide items based on the page that they route to.  This may sound esoteric, but it works quite well.  

**public.interfaces.default**  
The default interface contains information on connecting to your FHIR server.  You can configure it to point at localhost or use `Meteor.absoluteUrl()` to create a traditional client/server architecture.  If you point to an external FHIR server, you are effectively reconfiguring the app to be be an application server.    

**public.meshNetwork**  
Previous versions had good success with WebRTC and IPFS pilots, and this reference build is intended to support various blockchains as a general purpose Distributed App (DApp) architecture.  

**public.meshNetwork.upstreamSync**  
The URL of the upstream IPFS or BitTorrent server.  
 
**public.meshNetwork.magnets**  
The magnet URLs or IPFS file hashes to sync.  

**public.meshNetwork.autosync**  
Automatically sync the listed magnets or hashes to the local data cursors.  

**public.modules**  
Modules are groups of functionalities, usually organized around FHIR resource definitions or by apps.  

**public.apps**  
The `apps` contains key to activate app functionality in packages.  It's generally user defineable and custom to your app or workflow.  

**public.fhir**  
The `fhir` object contains a key for each of the FHIR resource types.  When enabled, the Node on FHIR framework will activate functionality related to that resource.  These include:

- Creation of a database cursor
- Creation of a client side data cursor
- Registration of page route for that resource type 
- Creation of a page with basic Create/Read/Update/Delete functionality
- Registration of navigation buttons in the sidebar
- Rendering of navigation tiles in the FHIR Resource Index Page
- Creation of a REST endpoint
- Updating the CapabilityStatement

**private**  
Private settings don't get send to the client.  Private is server-only, and shouldn't be confused with server-side, because public settings are also available on the server.  

**private.secret**  
A tenent specific cryptographic hash to seed algorithms and otherwise use as a token or default password.

**private.disableOauth**  
Disables oauth, and sets all endpoints on the server to be publicly available.  

