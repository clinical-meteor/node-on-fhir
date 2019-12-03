
## Installation  

```bash
# install the meteor compiler; this will take care of node, nvm, npm, yarn, etc.
# it will also set up debugging tools, a compiler build tool, etc
curl https://install.meteor.com/ | sh

# download the node-on-fhir application
git clone https://github.com/symptomatic/node-on-fhir  
cd node-on-fhir

# install dependencies
meteor yarn install

# run the application in local development mode
# this will automatically launch a mongo instance
# you will want to create your own settings file 
# and a plugin if you have assets you want to keep private
meteor run --settings configs/settings.nodeonfhir.json  --extra-packages symptomatic:example-plugin
```

## Testing  
```bash
# run the app
meteor --settings configs/settings.nodeonfhir.localhost.json 

# in a second terminal, run static code analysis tools
meteor npm run-script lint

# in a second terminal, run the test runner
meteor npm run-script nightwatch -- --tag circle 
```



## Production Build    
```bash
# build and minifiy the application
meteor add symptomatic:example-plugin
meteor build --directory ../output

# run the node application  
# warning!  we don't have a mongo instance yet
# you will need to specify a MONGO_URL

cd ../output
more README

cd programs/server 
npm install
export MONGO_URL='mongodb://user:password@host:port/databasename'
export ROOT_URL='http://example.com'
export METEOR_SETTINGS=`(cat configs/settings.nodeonfhir.json)`
node main.js

# or if you're looking for a one-liner
MONGO_URL='mongodb://user:password@host:port/databasename' PORT=4200 ROOT_URL=http://localhost METEOR_SETTINGS=`(cat ../../node-on-fhir/configs/settings.nodeonfhir.json)` node main.js
```