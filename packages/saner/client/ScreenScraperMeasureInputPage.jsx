import { 
    Container,
    Divider,
    Card,
    CardHeader,
    CardContent,
    Button,
    Typography,
    Box,
    Grid
  } from '@material-ui/core';
  import styled from 'styled-components';
  
  import { Meteor } from 'meteor/meteor';
  import { Session } from 'meteor/session';
  
  import React  from 'react';
  import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
  import ReactMixin  from 'react-mixin';
  


  import MeasureReportDetail from './MeasureReportDetail';
  import PatientCard from './PatientCard';
  import ObservationDetail from './ObservationDetail';
  import { MeasureReportsTable, ObservationsTable, LayoutHelpers, DynamicSpacer } from 'meteor/clinical:hl7-fhir-data-infrastructure';
  
  import { StyledCard, PageCanvas } from 'material-fhir-ui';
  
  import { get, cloneDeep } from 'lodash';
  
  import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
  
  //=============================================================================================================================================
  // Analytics

  import ReactGA from 'react-ga';
  ReactGA.initialize(get(Meteor, 'settings.public.google.analytics.trackingCode'), {debug: get(Meteor, 'settings.public.google.analytics.debug', false)});
  ReactGA.pageview(window.location.pathname + window.location.search);
ReactGA.set({ page: window.location.pathname });

  //=============================================================================================================================================
  // Session Variables
  
  Session.setDefault('measureReportPageTabIndex', 0);
  Session.setDefault('measureReportSearchFilter', '');
  Session.setDefault('selectedMeasureReport', false);
  Session.setDefault('selectedMeasureReportId', '');
  Session.setDefault('fhirVersion', 'v1.0.2');
  Session.setDefault('measureReportsArray', []);
  
  Session.setDefault('ScreenScraperMeasureInputPage.onePageLayout', false)
  
  
  //=============================================================================================================================================
  // Global Theming  
  
    // This is necessary for the Material UI component render layer
    let theme = {
      primaryColor: "rgb(108, 183, 110)",
      primaryText: "rgba(255, 255, 255, 1) !important",
  
      secondaryColor: "rgb(108, 183, 110)",
      secondaryText: "rgba(255, 255, 255, 1) !important",
  
      cardColor: "rgba(255, 255, 255, 1) !important",
      cardTextColor: "rgba(0, 0, 0, 1) !important",
  
      errorColor: "rgb(128,20,60) !important",
      errorText: "#ffffff !important",
  
      appBarColor: "#f5f5f5 !important",
      appBarTextColor: "rgba(0, 0, 0, 1) !important",
  
      paperColor: "#f5f5f5 !important",
      paperTextColor: "rgba(0, 0, 0, 1) !important",
  
      backgroundCanvas: "rgba(255, 255, 255, 1) !important",
      background: "linear-gradient(45deg, rgb(108, 183, 110) 30%, rgb(150, 202, 144) 90%)",
  
      nivoTheme: "greens"
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
        primary: {
          main: theme.primaryColor,
          contrastText: theme.primaryText
        },
        secondary: {
          main: theme.secondaryColor,
          contrastText: theme.errorText
        },
        appBar: {
          main: theme.appBarColor,
          contrastText: theme.appBarTextColor
        },
        cards: {
          main: theme.cardColor,
          contrastText: theme.cardTextColor
        },
        paper: {
          main: theme.paperColor,
          contrastText: theme.paperTextColor
        },
        error: {
          main: theme.errorColor,
          contrastText: theme.secondaryText
        },
        background: {
          default: theme.backgroundCanvas
        },
        contrastThreshold: 3,
        tonalOffset: 0.2
      }
    });
  
  
  Session.setDefault('iFrameLocation', get(Meteor, 'settings.public.saner.iFrameLocation', 'https://www.ncbi.nlm.nih.gov'))
  export function ScreenScraperMeasureInputPage(props){
    
    let data = {
      selectedMeasureReportId: '',
      selectedMeasureReport: null,
      measureReports: [],
      onePageLayout: true,
      browserWindowLocation: 'https://www.ncbi.nlm.nih.gov'
    };  
    data.onePageLayout = useTracker(function(){
      return Session.get('ScreenScraperMeasureInputPage.onePageLayout');
    }, [])
    data.selectedMeasureReportId = useTracker(function(){
      return Session.get('selectedMeasureReportId');
    }, [])
    data.browserWindowLocation = useTracker(function(){
        return Session.get('iFrameLocation');
      }, [])
    data.selectedMeasureReport = useTracker(function(){
      return MeasureReports.findOne(Session.get('selectedMeasureReportId'));
    }, [])
    data.measureReports = useTracker(function(){
      return MeasureReports.find().fetch();
    }, [])



    let style = {
        content: {
            minHeight: '728px',
            width: '100%',
            height: window.innerHeight - 200 + 'px'
        }
    }
    style.content.height = useTracker(function(){
        return Session.get('appHeight') - 200 + 'px';
      }, [])
  
  
    function onDeleteMeasureReport(context){
      MeasureReports._collection.remove({_id: get(context, 'state.measureReportId')}, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log('MeasureReports.insert[error]', error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          Session.set('selectedMeasureReportId', '');
          HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MeasureReports", recordId: context.state.measureReportId});
          Bert.alert('MeasureReport removed!', 'success');
        }
      });
      
    }
    function onUpsertMeasureReport(context){
      //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
      console.log('Saving a new MeasureReport...', context.state)
  
      if(get(context, 'state.measureReport')){
        let self = context;
        let fhirMeasureReportData = Object.assign({}, get(context, 'state.measureReport'));
      
        let measureReportValidator = MeasureReportSchema.newContext();
        measureReportValidator.validate(fhirMeasureReportData)
    
        if(process.env.NODE_ENV === "development"){
          console.log('IsValid: ', measureReportValidator.isValid())
          console.log('ValidationErrors: ', measureReportValidator.validationErrors());
        }
    
        console.log('Checking context.state again...', context.state)
        if (get(context, 'state.measureReportId')) {
          if(process.env.NODE_ENV === "development") {
            console.log("Updating measureReport...");
          }
  
          delete fhirMeasureReportData._id;
    
          // not sure why we're having to respecify this; fix for a bug elsewhere
          fhirMeasureReportData.resourceType = 'MeasureReport';
    
          MeasureReports._collection.update({_id: get(context, 'state.measureReportId')}, {$set: fhirMeasureReportData }, function(error, result){
            if (error) {
              if(process.env.NODE_ENV === "test") console.log("MeasureReports.insert[error]", error);
              Bert.alert(error.reason, 'danger');
            }
            if (result) {
              HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MeasureReports", recordId: context.state.measureReportId});
              Session.set('measureReportPageTabIndex', 1);
              Bert.alert('MeasureReport added!', 'success');
            }
          });
        } else {
          // if(process.env.NODE_ENV === "test") 
          console.log("Creating a new measureReport...", fhirMeasureReportData);
    
          fhirMeasureReportData.effectiveDateTime = new Date();
          MeasureReports._collection.insert(fhirMeasureReportData, function(error, result) {
            if (error) {
              if(process.env.NODE_ENV === "test")  console.log('MeasureReports.insert[error]', error);
              Bert.alert(error.reason, 'danger');
            }
            if (result) {
              HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MeasureReports", recordId: context.state.measureReportId});
              Session.set('selectedMeasureReportId', '');
              Bert.alert('MeasureReport added!', 'success');
            }
          });
        }
      } 
    }
    function onInsert(measureReportId){
      Session.set('selectedMeasureReportId', '');
      Session.set('measureReportPageTabIndex', 1);
      HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MeasureReports", recordId: measureReportId});
    }
    function onCancel(){
      Session.set('measureReportPageTabIndex', 1);
    } 
    function handleRowClick(measureReportId){
      console.log('ScreenScraperMeasureInputPage.handleRowClick', measureReportId)
      let measureReport = MeasureReports.findOne({_id: measureReportId});
  
      Session.set('selectedMeasureReportId', get(measureReport, '_id'));
      Session.set('selectedMeasureReport', measureReport);
  
      Session.set('currentSelectionId', 'MeasureReport/' + get(measureReport, '_id'));
      Session.set('currentSelection', measureReport);
    }

    function handleSaveButton() {
      console.log("Attempting to write records to database....");


      // let self = this;
      // if(this.props.onUpsert){
      //   this.props.onUpsert(self);
      // }
    }
  
    console.log('data.browserWindowLocation', data.browserWindowLocation)
  
    let headerHeight = LayoutHelpers.calcHeaderHeight();
    let formFactor = LayoutHelpers.determineFormFactor();
    let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
    let cardWidth = window.innerWidth - paddingWidth;
  
    let layoutContents;
    if(data.onePageLayout){
      layoutContents = <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'} >
        <CardHeader title={data.measureReports.length + " Measure Reports"} />
        <CardContent>
          <MeasureReportsTable 
            hideIdentifier={true} 
            hideCheckboxes={true} 
            hideSubjects={false}
            noDataMessagePadding={100}
            actionButtonLabel="Send"
            measureReports={ data.measureReports }
            count={ data.measureReports.length }
            selectedMeasureReportId={ data.selectedMeasureReportId }
            hideMeasureUrl={false}
            paginationLimit={10}
            hideSubjects={true}
            hideClassCode={false}
            hideReasonCode={false}
            hideReason={false}
            hideHistory={false}
            onRowClick={ handleRowClick.bind(this) }
            rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
            tableRowSize="medium"
          />
          </CardContent>
        </StyledCard>
    } else {
      if(Meteor.isCordova){
        layoutContents = <Grid container spacing={3}>
          <Grid item lg={12}>
            <CardHeader title="Scraped Patient" />
            <PatientCard 
              style={{marginTop: '20px'}}
            />
            <DynamicSpacer />

            <CardHeader title="Scraped Lab Observation" />
            <StyledCard scrollable={true} margin={20} width={cardWidth + 'px'}>
              
              <CardContent>
                <CardContent>
                  <ObservationDetail />
                </CardContent>
              </CardContent>
            </StyledCard>
            <DynamicSpacer />
            <Button id="addTestToReportBtn" className="addTestToReport" variant="contained" color="primary" onClick={handleSaveButton.bind(this)} fullWidth >Save Result</Button>
          </Grid>
        </Grid>
      } else {
        layoutContents = <Grid container spacing={3}>
          <Grid item lg={3}>
            <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'} >
              <CardHeader title={data.measureReports.length + " Measure Reports in History Log"} />
              <CardContent>
                <MeasureReportsTable 
                  hideIdentifier={true} 
                  hideCheckboxes={true} 
                  hideSubjects={false}
                  noDataMessagePadding={100}
                  actionButtonLabel="Send"
                  measureReports={ data.measureReports }
                  count={ data.measureReports.length }
                  selectedMeasureReportId={ data.selectedMeasureReportId }
                  paginationLimit={10}
                  hideType={true}
                  hideMeasureUrl={true}
                  hideSubjects={true}
                  hideClassCode={false}
                  hideReasonCode={false}
                  hideReason={false}
                  hideHistory={false}
                  hideBarcode={true}
                  hideNumerator={true}
                  hideDenominator={true}
                  hideMeasureScore={true}
                  hidePeriodEnd={true}
                  onRowClick={ handleRowClick.bind(this) }
                  rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
                  tableRowSize="medium"
                  />
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item lg={3}>
            <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
              <CardHeader title="Screen Scraper" />
    
              <CardContent>
                <CardContent>
                    <object id="iframe" type="text/html" data={data.browserWindowLocation} style={style.content}>
                        <p>unable to load </p>
                    </object>                            
                </CardContent>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item lg={3}>
            <CardHeader title="Scraped Patient" />
            <PatientCard 
              style={{marginTop: '20px'}}
            />
            <DynamicSpacer />
    
            <CardHeader title="Scraped Lab Observation" />
            <StyledCard scrollable={true} margin={20} width={cardWidth + 'px'} >
              
              <CardContent>
                <CardContent>
                  <ObservationDetail />
                </CardContent>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item lg={3}>
            <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'} >
              <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedMeasureReportId }</h1>
              <CardHeader title="Generated Measure Report" />
              <CardContent>
                <MeasureReportDetail 
                  id='measureReportDetails' 
                  displayDatePicker={true} 
                  displayBarcodes={false}
                  measureReport={ data.selectedMeasureReport }
                  measureReportId={ data.selectedMeasureReportId } 
                  showMeasureReportInputs={true}
                  showHints={false}
                  showPopulationCode={true}
                />                    
                <DynamicSpacer />
                <ObservationsTable />
                
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      }
    }
  
    return (        
      <PageCanvas id="ScreenScraperMeasureInputPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
        <MuiThemeProvider theme={muiTheme} >
          { layoutContents }
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
  
  
  
  
  export default ScreenScraperMeasureInputPage;