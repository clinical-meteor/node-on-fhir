# goinvo:synthea-analysis

This package is for analyzing Synthea datasets using the hGraph visualization.  

#### Generating a synthetic dataset

```bash
# download synthea
git clone https://github.com/synthetichealth/synthea
cd synthea

# build the utility
./gradlew build check test

# generate a thousand test patients
./run_synthea -s 12345 -m covid19 -p 1000 Illinois "Chicago"  
```


#### Clone the Example Plugin      

```bash
#install meteor
curl https://install.meteor.com/ | sh

# clone the node-on-fhir boilerplate  
git clone https://github.com/symptomatic/node-on-fhir  

# navigate to the packages directory, and clone the synthea-analysis package into it
cd node-on-fhir  
cd packages  
git clone https://github.com/symptomatic/synthea-analysis

# return to the project root 
cd ..
```

#### Run Meteor on FHIR with your plugin  

```bash
# install dependencies and libraries
meteor npm install

# run with a custom settings file, using the extra package  
run --settings packages/synthea-analysis/configs/settings.synthea.json --extra-packages goinvo:synthea-analysis

# run with a custom settings file, using the extra package  
INITIALIZE_SYNTHEA_DATA=true meteor run --settings packages/synthea-analysis/configs/settings.synthea.json --extra-packages goinvo:synthea-analysis
```



#### Compile to desktop app

To compile to a desktop app, you will need to begin by editing the `package.json` file, and removing nightwatch, chromedriver, and selenium.  They will interfere with the electron build pipeline.

```json
{
  "devDependencies": {
    "electron": "6.1.7",
    "electron-builder": "21.2.0",
    "meteor-desktop": "2.2.5"
  },
  "unusedDevLibs": {
    "babel-eslint": "10.1.0",
    "chai": "4.2.0",
    "chai-nightwatch": "0.4.0",
    "chromedriver": "86.0.0",
    "eslint": "4.19.1",
    "eslint-import-resolver-meteor": "0.4.0",
    "eslint-plugin-import": "2.21.2",
    "eslint-plugin-jsx-a11y": "6.3.1",
    "eslint-plugin-meteor": "7.0.0",
    "eslint-plugin-react": "7.20.0",
    "eslint-plugin-react-hooks": "4.0.4",
    "nightwatch": "1.5.0",
    "selenium-webdriver": "3.6.0"
  }
}
```

Then run the following commands from the terminal:

```bash
# make sure the electron build pipeline is installed
meteor add omega:meteor-desktop-watcher@=2.2.5
meteor add omega:meteor-desktop-bundler@=2.2.5

# make sure the electron build pipeline is installed
meteor npm install --save-dev meteor-desktop

# add licensed packages
meteor run --settings packages/synthea-analysis/configs/settings.synthea.json --extra-packages goinvo:synthea-analysis --mobile-server=127.0.0.1:3000

# initialize the .desktop directory
npm run desktop -- init

# move the default config into place
cp packages/patientinsight:cardiac-scorecard/.desktop/settings.json .desktop/settings.json

# build the executable
npm run desktop -- build
npm run desktop -- build-installer

# make sure the electron build pipeline is installed
meteor remove omega:meteor-desktop-watcher@=2.2.5
meteor remove omega:meteor-desktop-bundler@=2.2.5

```

When finished, and checking the branch back into GitHub, be sure to remove the electron packages, and re-enable nightwatch and selenium.  

```json
{
  "devDependencies": {
    "babel-eslint": "10.1.0",
    "chai": "4.2.0",
    "chai-nightwatch": "0.4.0",
    "chromedriver": "86.0.0",
    "eslint": "4.19.1",
    "eslint-import-resolver-meteor": "0.4.0",
    "eslint-plugin-import": "2.21.2",
    "eslint-plugin-jsx-a11y": "6.3.1",
    "eslint-plugin-meteor": "7.0.0",
    "eslint-plugin-react": "7.20.0",
    "eslint-plugin-react-hooks": "4.0.4",
    "nightwatch": "1.5.0",
    "selenium-webdriver": "3.6.0"
  },
  "unusedDevLibs": {
    "electron": "6.1.7",
    "electron-builder": "21.2.0",
    "meteor-desktop": "2.2.5"
  }
}
```


#### Settings File
You will want to add the following keys to your `Meteor.settings` file or `METEOR_SETTINGS` environment variable.  
```
"public"{
    "synthea": {
      "autoInitialize": true,
      "numPatientsToInitialize": 20,
      "showScanDirectoryButton": false
    }
}
```  

