import React, { memo, useState, useEffect, useCallback } from 'react';
import { Button, Grid, CardHeader, CardContent, Container, Snackbar, TextField, Typography, Box } from '@material-ui/core';

import { get } from 'lodash';
import { PageCanvas, StyledCard, DynamicSpacer } from 'fhir-starter';
import { useTracker } from 'meteor/react-meteor-data';

import { ConsentsTable } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import { SnackBarContentError } from '../accounts/SnackBarContentError';
import { accountsClient } from '../accounts/Accounts';

import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';







function MyProfilePage(props) {
  // logger.info('Rendering the MyProfilePage and associated backgrounds.');
  // logger.verbose('client.app.layout.MyProfilePage');

  console.info('Rendering the MyProfilePage and associated backgrounds.');
  console.debug('client.app.layout.MyProfilePage');

  const { children, staticContext, ...otherProps } = props;

  const [error, setError] = useState();

  let currentUser = useTracker(function(){
    return Session.get('currentUser');
  }, [])

  let accountsAccessToken = useTracker(function(){
    return Session.get('accountsAccessToken');
  }, [])


  let headerHeight = 64;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 128;
  }

  function handleDeleteAccount(){
    console.log('Deleting account...');

    if(confirm("Are you sure that you want to delete this account?")){
      Meteor.call('deleteMyAccount', Session.get('accountsAccessToken'), null, null, async function(error, result){
        if(error){
          console.error('error', error)
        }
        if(result === "User health data deleted, and account deactivated."){
          await accountsClient.logout();
          await accountsClient.clearTokens();

          Meteor.call('jsaccounts/validateLogout', Session.get('accountsAccessToken'));

          console.log('accountsClient.getTokens()', await accountsClient.getTokens());

          // close dialog
          Session.set('mainAppDialogOpen', false);

          // clear current user 
          Session.set('currentUser', false);


          // clear session data
          Session.set('sessionId', false);
          Session.set('accountsAccessToken', '')
          Session.set('accountsRefreshToken', '')
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
      })  
    }
  }

  
  return (
    <PageCanvas id='MyProfilePage' headerHeight={headerHeight} style={{paddingBottom: '80px'}}>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        open={!!error}
        onClose={function(){
          setError(undefined)
        }}
      >
        <SnackBarContentError message={error} />
      </Snackbar>
      <Container maxwidth="md" >
        <StyledCard scrollable margin={20} >
          <CardHeader title="My Profile" />
          <CardContent>
            <TextField 
              fullWidth={true}
              type="text"
              label="Name"
              style={{marginBottom: '10px'}}
              value={get(currentUser, 'fullLegalName', '')}
              InputLabelProps={{shrink: true}}
            />
            <TextField 
              fullWidth={true}
              type="text"
              label="User ID"
              style={{marginBottom: '10px'}}
              value={get(currentUser, 'id', '')}
              InputLabelProps={{shrink: true}}
            />
            <TextField 
              fullWidth={true}
              type="text"
              label="Primary Email"
              style={{marginBottom: '10px'}}
              value={get(currentUser, 'emails[0].address', '')}
              InputLabelProps={{shrink: true}}
            />
            <TextField 
              fullWidth={true}
              type="text"
              label="Session Access Token"
              style={{marginBottom: '10px'}}
              value={accountsAccessToken}
              InputLabelProps={{shrink: true}}
            />
          </CardContent>
        </StyledCard>
        <DynamicSpacer />
        <StyledCard scrollable margin={20} >
          <CardHeader title="Roles and Linked Records" />
          <CardContent>
            <TextField 
              fullWidth={true}
              type="text"
              label="Role"
              style={{marginBottom: '10px'}}
              value={get(currentUser, 'roles.0', '')}
              InputLabelProps={{shrink: true}}
            />
            <TextField 
              fullWidth={true}
              type="text"
              label="Patient ID"
              style={{marginBottom: '10px'}}
              value={get(currentUser, 'patientId', '')}
              InputLabelProps={{shrink: true}}
            />
            <TextField 
              fullWidth={true}
              type="text"
              label="Practitioner ID"
              style={{marginBottom: '10px'}}
              value={get(currentUser, 'practitionerId', '')}
              InputLabelProps={{shrink: true}}
            />
          </CardContent>
        </StyledCard>
        <DynamicSpacer />
        <StyledCard scrollable margin={20} >
          <CardHeader title="My Consent Records" />
          <CardContent>
            <ConsentsTable
              consents={[]}
              hideIdentifier={true}
              noDataMessage={false}
              page={0}
              // onSetPage={function(index){
              //   setConsentsIndex(index)
              // }}        
              // page={data.consentsIndex}
              sort="periodStart"
            />
          </CardContent>
        </StyledCard>
        <DynamicSpacer />
        <StyledCard scrollable margin={20} >
          <CardHeader title="Danger Area" />
          <CardContent>
            <Button fullWidth variant="contained" color="primary" onClick={handleDeleteAccount.bind(this)}>Delete Account</Button>
          </CardContent>
        </StyledCard>
        <DynamicSpacer />
      </Container>
    </PageCanvas>
  );
}
export default MyProfilePage;

