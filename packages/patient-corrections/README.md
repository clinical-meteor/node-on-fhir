# symptomatic:patient-corrections

This package is for the HL7 Patient Empowerment group, and implements the Patient Corrections server.



#### Clone the Example Plugin      

```bash
#install meteor
curl https://install.meteor.com/ | sh

# clone the node-on-fhir boilerplate  
git clone https://github.com/symptomatic/node-on-fhir  

# navigate to the packages directory, and clone the patient-corrections package into it
cd node-on-fhir  
cd packages  
git clone https://github.com/symptomatic/patient-corrections  

# return to the project root 
cd ..
```

#### Run Meteor on FHIR with your plugin  

```bash
# install dependencies and libraries
meteor npm install

# run with a custom settings file, using the extra package  
run --settings packages/patient-corrections/configs/settings.patient.corrections.json --extra-packages symptomatic:patient-corrections

# run with a custom settings file, using the extra package  
meteor run --settings packages/patient-corrections/configs/settings.patient.corrections.json --extra-packages goinvo:synthea-analysis,symptomatic:vault-server,symptomatic:patient-corrections

```



 