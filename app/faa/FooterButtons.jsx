import React, { useState, useEffect, useCallback } from 'react';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
import { Random } from 'meteor/random';

import { Button } from '@material-ui/core';

import { get } from 'lodash';
import JSON5 from 'json5';

import { useTracker } from 'meteor/react-meteor-data';
//========================================================================================================

import {
  fade,
  ThemeProvider,
  MuiThemeProvider,
  withStyles,
  makeStyles,
  createMuiTheme,
  useTheme
} from '@material-ui/core/styles';

  // Global Theming 
  // This is necessary for the Material UI component render layer
  let theme = {
    appBarColor: "#f5f5f5 !important",
    appBarTextColor: "rgba(0, 0, 0, 1) !important",
  }

  // if we have a globally defined theme from a settings file
  if(get(Meteor, 'settings.public.theme.palette')){
    theme = Object.assign(theme, get(Meteor, 'settings.public.theme.palette'));
  }

  const muiTheme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      appBar: {
        main: theme.appBarColor,
        contrastText: theme.appBarTextColor
      },
      contrastThreshold: 3,
      tonalOffset: 0.2
    }
  });


  const buttonStyles = makeStyles(theme => ({
    west_button: {
      cursor: 'pointer',
      justifyContent: 'left',
      color: theme.palette.appBar.contrastText,
      marginLeft: '20px',
      marginTop: '15px'
    },
    east_button: {
      cursor: 'pointer',
      justifyContent: 'left',
      color: theme.palette.appBar.contrastText,
      right: '20px',
      marginTop: '15px',
      position: 'absolute'
    },
    east_button_200: {
      cursor: 'pointer',
      justifyContent: 'left',
      color: theme.palette.appBar.contrastText,
      right: '200px',
      marginTop: '15px',
      position: 'absolute'
    }

  }));


Session.setDefault('SurveyPage.expandedPanels', false)  
Session.setDefault('SurveyPage.showExplanation', false)  



//============================================================================================================================
// CMS Buttons

export function CmsButtons(props){
  const buttonClasses = buttonStyles();

  let draftQuestionnaireResponse;
  draftQuestionnaireResponse = useTracker(function(){
    return Session.get('draftQuestionnaireResponse')
  }, []);

  function toggleFormExpansion(){
    console.log('toggleFormExpansion');

    Session.toggle('SurveyPage.expandedPanels')    
  }
  function toggleExplain(){
    Session.toggle('SurveyPage.showExplanation')    

  }

  function postQuestionnaireResponse(){
    let responseTemplate = {
      "resourceType": "QuestionnaireResponse",
      "id": Random.id(),
      "identifier": {
        "system": "https://www.symptomatic.io/fhir/Questionnaire/",
        "value": Session.get('selectedQuestionnaireId')
      },
      "questionnaire": "Questionnaire/" + Session.get('selectedQuestionnaireId'),
      "status": "completed",
      "subject": {
        "display": "Anonymous User",
        "reference": "Patient/Anonymous"
      },
      "authored": new Date(),
      "author": {
        "display": "Anonymous User",
        "reference": "Patient/Anonymous"
      },
      "source": {
        "display": get(Meteor, 'settings.public.title'),
        "reference": Meteor.absoluteUrl()
      },
      "item": [] 
    }

    let questionnaireResponseUrl = "";
    if(get(Meteor, 'settings.public.interfaces.relay.channel.endpoint')){
      questionnaireResponseUrl = get(Meteor, 'settings.public.interfaces.relay.channel.endpoint');
    } else {
      questionnaireResponseUrl = Meteor.absoluteUrl() +  'baseR4/QuestionnaireResponse/' + responseTemplate.id;
    }

    console.log('draftQuestionnaireResponse', draftQuestionnaireResponse)

    if(Array.isArray(draftQuestionnaireResponse.item)){
      responseTemplate.item = draftQuestionnaireResponse.item;
    }

    console.log('responseTemplate', responseTemplate);

    HTTP.put(questionnaireResponseUrl, {
      data: responseTemplate
    }, function(error, result){
      if (error) {
        console.log("POST /QuestionnaireResponse", error);
      }
      if (result) {
        console.log("POST /QuestionnaireResponse", result);
      }
    });

  }
  return (
    <div>
      <Button className={buttonClasses.east_button} onClick={ toggleFormExpansion.bind(this) } >
        Expand / Collapse
      </Button>
    </div>
  );
}


//============================================================================================================================
// FAA Buttons

export function FaaButtons(props){
  const buttonClasses = buttonStyles();

  let draftQuestionnaireResponse;
  draftQuestionnaireResponse = useTracker(function(){
    return Session.get('draftQuestionnaireResponse')
  }, []);

  function toggleFormExpansion(){
    console.log('toggleFormExpansion');

    Session.toggle('SurveyPage.expandedPanels')    
  }
  function toggleExplain(){
    Session.toggle('SurveyPage.showExplanation')    

  }

  function postQuestionnaireResponse(){
    let responseTemplate = {
      "resourceType": "QuestionnaireResponse",
      "id": Random.id(),
      "identifier": {
        "system": "https://www.symptomatic.io/fhir/Questionnaire/",
        "value": Session.get('selectedQuestionnaireId')
      },
      "questionnaire": "Questionnaire/" + Session.get('selectedQuestionnaireId'),
      "status": "completed",
      "subject": {
        "display": "Anonymous User",
        "reference": "Patient/Anonymous"
      },
      "authored": new Date(),
      "author": {
        "display": "Anonymous User",
        "reference": "Patient/Anonymous"
      },
      "source": {
        "display": get(Meteor, 'settings.public.title'),
        "reference": Meteor.absoluteUrl()
      },
      "item": [] 
    }

    let questionnaireResponseUrl = "";
    if(get(Meteor, 'settings.public.interfaces.relay.channel.endpoint')){
      questionnaireResponseUrl = get(Meteor, 'settings.public.interfaces.relay.channel.endpoint');
    } else {
      questionnaireResponseUrl = Meteor.absoluteUrl() +  'baseR4/QuestionnaireResponse/' + responseTemplate.id;
    }

    console.log('draftQuestionnaireResponse', draftQuestionnaireResponse)

    if(Array.isArray(draftQuestionnaireResponse.item)){
      responseTemplate.item = draftQuestionnaireResponse.item;
    }

    console.log('responseTemplate', responseTemplate);

    HTTP.put(questionnaireResponseUrl, {
      data: responseTemplate
    }, function(error, result){
      if (error) {
        console.log("POST /QuestionnaireResponse", error);
      }
      if (result) {
        console.log("POST /QuestionnaireResponse", result);
      }
    });

  }
  return (
    <div>
      <Button className={buttonClasses.east_button} onClick={ toggleFormExpansion.bind(this) } >
        Expand / Collapse
      </Button>
      <Button className={buttonClasses.east_button_200} onClick={ toggleExplain.bind(this) } >
        Explain
      </Button>
    </div>
  );
}
