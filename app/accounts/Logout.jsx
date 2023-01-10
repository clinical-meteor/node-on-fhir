// https://www.accountsjs.com/docs/strategies/password/  
// https://www.accountsjs.com/docs/strategies/password-client/  
// https://www.accountsjs.com/docs/handling-errors/  
// https://www.accountsjs.com/docs/strategies/password/  
// https://github.com/accounts-js/accounts/blob/master/packages/rest-express/src/express-middleware.ts  
// https://github.com/accounts-js/accounts/blob/master/packages/rest-express/src/endpoints/password/register.ts  


import React, { useState } from 'react';
import { RouteComponentProps, Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Typography,
  makeStyles,
  Card,
  CardContent,
  Divider,
  Link,
  TextField,
  Grid,
  Snackbar,
} from '@material-ui/core';

import { useFormik, FormikErrors } from 'formik';
import { SnackBarContentError } from './SnackBarContentError';
import { useAuth } from './AuthContext';
import { UnauthenticatedContainer } from './UnauthenticatedContainer';
import { accountsClient } from './Accounts';

import { get, has } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

// import { AccountsClient } from '@accounts/client';
// import { RestClient } from '@accounts/rest-client';
// let apiHostFromSettings = get(Meteor, 'settings.public.interfaces.accountsServer.host') + ":" + get(Meteor, 'settings.public.interfaces.accountsServer.port');


// const accountsRest = new RestClient({
//   apiHost: apiHostFromSettings,
//   rootPath: '/accounts'
// });

// const accountsClient = new AccountsClient({}, accountsRest);


const useStyles = makeStyles(theme => ({
  cardContent: {
    padding: theme.spacing(3),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));

const SignUpLink = React.forwardRef((props, ref) => (
  <RouterLink to="/signup" {...props} ref={ref} />
));
const ResetPasswordLink = React.forwardRef((props, ref) => (
  <RouterLink to="/reset-password" {...props} ref={ref} />
));

// interface LogoutValues {
//   email: string;
//   password: string;
//   code: string;
// }




const Logout = function({ history }){
  const classes = useStyles();
  const { loginWithService, logout } = useAuth();


  //-----------------------------------------------------------
  // State Management

  const [error, setError] = useState();
  

  //-----------------------------------------------------------
  // Trackers 

  let currentUser = useTracker(function(){
    return Session.get('currentUser');
  }, [])

  //-----------------------------------------------------------
  // Helper Functions

  function openRegisterAccountDialog(){
    Session.set('mainAppDialogTitle', 'Register New Account');
    Session.set('mainAppDialogComponent', 'SignUpDialog');
    Session.set('mainAppDialogMaxWidth', "sm");
  }

  async function logoutUser(){
    console.log('Logging out user session: ' + Session.get('sessionAccessToken'))
    
    
    accountsClient.logout();

    Meteor.call('jsaccounts/validateLogout', Session.get('sessionAccessToken'));

    console.log('accountsClient.getTokens()', await accountsClient.getTokens());
    
    // close dialog
    Session.set('mainAppDialogOpen', false);

    // clear current user 
    Session.set('currentUser', false);


    // clear session data
    Session.set('sessionId', false);
    Session.set('accountsAccessToken', null)
    Session.set('accountsRefreshToken', null)
    Session.set('sessionRefreshToken', false);    

    // clear selections which may contain user data
    Session.set('selectedAffiliations', []);
    Session.set('selectedAllergyIntolerance', false);
    Session.set('selectedAllergyIntoleranceId', "");
    Session.set('selectedAuditEventId', false);
    Session.set('selectedBundleId', "");
    Session.set('selectedCarePlan', false);
    Session.set('selectedCarePlanId', "");
    Session.set('selectedCarePlans', []);
    Session.set('selectedCareTeam', false);
    Session.set('selectedCareTeamId', "");
    Session.set('selectedCodeSystem', false);
    Session.set('selectedCodeSystemId', "");
    Session.set('selectedCodeSystems', []);
    Session.set('selectedCommunication', false);
    Session.set('selectedCommunicationId', "");
    Session.set('selectedCommunicationRequest', false);
    Session.set('selectedCommunicationRequests', []);
    Session.set('selectedCommunications', false);
    Session.set('selectedComposition', false);
    Session.set('selectedCompositionId', "");
    Session.set('selectedCondition', false);
    Session.set('selectedConditionId', "");
    Session.set('selectedConsent', false);
    Session.set('selectedConsentId', "");
    Session.set('selectedDevice', false);
    Session.set('selectedDeviceId', "");
    Session.set('selectedDefinitions', []);
    Session.set('selectedDiagnosticReport', false);
    Session.set('selectedDiagnosticReportId', "");
    Session.set('selectedDocumentReference', false);
    Session.set('selectedDocumentReferenceId', "");
    Session.set('selectedDocumentSource', false);
    Session.set('selectedEncounter', false);
    Session.set('selectedEncounterId', "");
    Session.set('selectedEndpoint', false);
    Session.set('selectedEndpointId', "");
    Session.set('selectedEndpoints', []);
    Session.set('selectedExplanationOfBenefit', false);
    Session.set('selectedExplanationOfBenefitId', "");
    Session.set('selectedGoal', false);
    Session.set('selectedGoalId', "");
    Session.set('selectedHealthcareService', false);
    Session.set('selectedHealthcareServiceId', "");
    Session.set('selectedInsurancePlan', false);
    Session.set('selectedInsurancePlanId', "");
    Session.set('selectedInsurancePlans', []);
    Session.set('selectedList', false);
    Session.set('selectedListId', "");
    Session.set('selectedLocation', false);
    Session.set('selectedLocationId', "");
    Session.set('selectedLocations', []);
    Session.set('selectedMeasure', false);
    Session.set('selectedMeasureId', "");
    Session.set('selectedMeasureReport', false);
    Session.set('selectedMeasureReportId', "");
    Session.set('selectedMeasureReports', []);
    Session.set('selectedMedication', false);
    Session.set('selectedMedicationId', "");
    Session.set('selectedMedicationOrder', false);
    Session.set('selectedMedicationOrderId', "");
    Session.set('selectedMedicationStatement', false);
    Session.set('selectedMedicationStatementId', "");
    Session.set('selectedMedications', []);
    Session.set('selectedMessageHeader', false);
    Session.set('selectedMessageHeaderId', "");
    Session.set('selectedNetwork', false);
    Session.set('selectedNetworkId', "");
    Session.set('selectedNetworks', []);
    Session.set('selectedObservation', false);
    Session.set('selectedObservationCode', false);
    Session.set('selectedObservationId', "");
    Session.set('selectedObservationType', false);
    Session.set('selectedOrganization', false);
    Session.set('selectedOrganizationAffiliation', false);
    Session.set('selectedOrganizationAffiliationId', "");
    Session.set('selectedOrganizationId', "");
    Session.set('selectedOrganizations', []);
    Session.set('selectedParameters', false);
    Session.set('selectedPatient', false);
    Session.set('selectedPatientId', "");
    Session.set('selectedPerson', false);
    Session.set('selectedPersonId', "");
    Session.set('selectedPersons', []);
    Session.set('selectedPractitionerId', "");
    Session.set('selectedPractitionerRole', false);
    Session.set('selectedPractitionerRoleId', "");
    Session.set('selectedPractitioners', []);
    Session.set('selectedProcedure', false);
    Session.set('selectedProcedureId', "");
    Session.set('selectedProvenanceId', "");
    Session.set('selectedProvenances', []);
    Session.set('selectedQuestionnaire', false);
    Session.set('selectedQuestionnaireId', "");
    Session.set('selectedQuestionnaireResponse', false);
    Session.set('selectedQuestionnaireResponseId', "");
    Session.set('selectedResponse', false);
    Session.set('selectedRestriction', false);
    Session.set('selectedRestrictionId', "");
    Session.set('selectedRestrictions', []);
    Session.set('selectedResults', false);
    Session.set('selectedRiskAssessment', false);
    Session.set('selectedRiskAssessmentId', "");
    Session.set('selectedRoles', false);
    Session.set('selectedSearchParameter', false);
    Session.set('selectedSearchParameterId', "");
    Session.set('selectedServiceRequestId', "");
    Session.set('selectedServices', []);
    Session.set('selectedStructureDefinition', false);
    Session.set('selectedStructureDefinitionId', "");
    Session.set('selectedSubscription', false);
    Session.set('selectedSubscriptionId', "");
    Session.set('selectedSubscriptions', []);
    Session.set('selectedTask', false);
    Session.set('selectedTaskId', "");
    Session.set('selectedTasks', []);
    Session.set('selectedTeams', []);
    Session.set('selectedValueSet', false);
    Session.set('selectedValueSetId', "");
    Session.set('selectedValueSets', []);
    Session.set('selectedVerificationResult', false);
    Session.set('selectedVerificationResultId', "");

    // clear form data
    Session.set('CareTeam.Current', "{\"resourceType\":\"CareTeam\"}")
    Session.set('CodeSystem.Current', "{\"resourceType\":\"CodeSystem\"}")
    Session.set('Communication.Current', "{\"resourceType\":\"Communication\"}")
    Session.set('CommunicationRequest.Current', "{\"resourceType\":\"CommunicationRequest\"}")
    Session.set('Endpoint.Current', "{\"resourceType\":\"Endpoint\"}")
    Session.set('HealthcareService.Current', "{\"resourceType\":\"HealthcareService\"}")
    Session.set('InsurancePlan.Current', "{\"resourceType\":\"InsurancePlan\"}")
    Session.set('Location.Current', "{\"resourceType\":\"Location\"}")
    Session.set('Network.Current', "{\"resourceType\":\"Network\"}")
    Session.set('Organization.Current', "{\"resourceType\":\"Organization\"}")
    Session.set('OrganizationAffiliation.Current', "{\"resourceType\":\"OrganizationAffiliation\"}")
    Session.set('Practitioner.Current', "{\"resourceType\":\"Practitioner\"}")
    Session.set('PractitionerRole.Current', "{\"resourceType\":\"PractitionerRole\"}")
    Session.set('Provenance.Current', "{\"resourceType\":\"Provenance\"}")
    Session.set('RelatedPerson.Current', "{\"resourceType\":\"RelatedPerson\"}")
    Session.set('Restriction.Current', "{\"resourceType\":\"Restriction\"}")
    Session.set('SearchParameter.Current', "{\"resourceType\":\"SearchParameter\"}")
    Session.set('StructureDefinition.Current', "{\"resourceType\":\"StructureDefinition\"}")
    Session.set('Subscription.Current', "{\"resourceType\":\"Subscription\"}")
    Session.set('Task.Current', "{\"resourceType\":\"Task\"}")
    Session.set('ValueSet.Current', "{\"resourceType\":\"ValueSet\"}")
    Session.set('VerificationResult.Current', "{\"resourceType\":\"VerificationResult\"}")

    // trigger refresh on UI elements
    Session.set('lastUpdated', new Date());
    
  }


  let username = get(currentUser, 'givenName') + ' ' + get(currentUser, 'familyName');

  if(has(currentUser, 'username')){
    username = get(currentUser, 'username');
  } 
  
  if(has(currentUser, 'fullLegalName')){
    username = get(currentUser, 'fullLegalName');
  } 
  

  return (
    <UnauthenticatedContainer>


      <Grid container spacing={3} style={{marginTop: '0px', paddingTop: '0px'}}>
        <Grid item md={12}>
          <h1 className="barcode" style={{marginBottom: '20px', marginTop: '0px', fontWeight: 200}}>{ get(Session.get('currentUser'), '_id')}</h1>

          <TextField
            label="User Name"
            // variant="outlined"
            fullWidth={true}
            type="username"
            id="username"
            defaultValue={ username }
            // disabled
            style={{marginBottom: '20px'}}
          />
          <TextField
            label="Email"
            // variant="outlined"
            fullWidth={true}
            type="email"
            id="email"
            defaultValue={ get(Session.get('currentUser'), 'emails[0].address') }
            // disabled
            style={{marginBottom: '20px'}}
          />

        </Grid>
        <Grid item md={12}>
          <Button
            variant="contained"
            color="primary"                  
            fullWidth={true}                  
            onClick={logoutUser}
          >
            End User Session
          </Button>
        </Grid>
      </Grid>

    </UnauthenticatedContainer>
  );
};

export default Logout;