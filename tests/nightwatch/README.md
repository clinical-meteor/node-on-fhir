# meteor-on-fhir-validation
Nightwatch Validation Tests for Meteor on FHIR


```
cd meteor-on-fhir/webapp/tests
git clone https://github.com/awatson1978/meteor-on-fhir-validation nightwatch
```


#### C. Testing    
You may need to install [Java SDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) to run the latest version of Selenium.

```sh
cd meteor-on-fhir/webapp

## install test tools
git clone https://github.com/awatson1978/meteor-on-fhir-validation tests/nightwatch

## install test tools
meteor npm install

## run validation tests (using nightwatch)
meteor npm run-script nightwatch

## running verfication test coverage (using mocha)
COVERAGE_APP_FOLDER=/Users/abigailwatson/Code/GlassUI/fire-demo/ meteor npm run-script coverage
# http://localhost:3000/coverage
``` 