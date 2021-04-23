

## Quickstart

```bash
# install the meteor compiler; this will take care of node, nvm, npm, yarn, etc.
# it will also set up debugging tools, a compiler build tool, etc
curl https://install.meteor.com/ | sh

# download the node-on-fhir application
git clone https://github.com/symptomatic/node-on-fhir  
cd node-on-fhir

# install dependencies
meteor npm install

# alternative, use yarn if you'd like a more modern package manager
meteor yarn install

# run the application in local development mode
# this will automatically launch a mongo instance
meteor run --settings configs/settings.nodeonfhir.json  

# stop the application with Ctrl-C

# download custom packages
cd packages
git clone https://github.com/symptomatic/covid19-on-fhir
cd ..

# alternatively, run the config from a plugin
meteor run --settings packages/covid19-on-fhir/configs/settings.covid19.json  --extra-packages symptomatic:covid19-on-fhir

# when you're ready to deploy, you'll need to add the package to the app (meteor deploy won't accept --extra-packages)
meteor add symptomatic:covid19-on-fhir
```

## Deployment

```bash
# when you're ready to deploy, you'll need to add the package to the app (meteor deploy won't accept --extra-packages)
meteor add symptomatic:covid19-on-fhir

# test the code minification doesnt break anything
meteor run --settings packages/covid19-on-fhir/configs/settings.covid19.json --production

# build the application
meteor build --directory ../output

# run the node application  
# warning!  we don't have a mongo instance yet
# while `meteor run` will autolaunch a local copy of Mongo,
# the compiled node bundle will not.  
# you will need to specify a MONGO_URL

cd ../output
more README

cd programs/server 
npm install
export MONGO_URL='mongodb://user:password@host:port/databasename'
export ROOT_URL='http://example.com'

# finally, run the node server itself
export METEOR_SETTINGS=`(cat configs/settings.nodeonfhir.json)`
node main.js

# or if you're looking for a one-liner
MONGO_URL='mongodb://user:password@host:port/databasename' PORT=4200 ROOT_URL=http://localhost METEOR_SETTINGS=`(cat ../../node-on-fhir/configs/settings.nodeonfhir.json)` node main.js
```

## Testing  
```bash
# run the app
meteor --settings configs/settings.nodeonfhir.localhost.json 

# in a second terminal, run static code analysis tools
meteor npm run-script lint

# in a second terminal, run the verification tests
TEST_BROWSER_DRIVER=chrome meteor test --driver-package meteortesting:mocha --port 3002 --once --full-app

# in a second terminal, run the vaildation tests
meteor npm run-script nightwatch -- --tag circle 
```

