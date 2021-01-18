import React, { memo, useState, useEffect, useCallback } from 'react';

import { 
  Card, 
  CardActions, 
  CardText,
  CardTitle,
  CardHeader,
  CardContent,
  Tab,
  Tabs,
  FlatButton,
  FontIcon,
  RaisedButton,
  TextField,
  Grid, 
  Divider, 
  Paper
} from '@material-ui/core';
import { get, has } from 'lodash';

import { StyledCard } from 'fhir-starter';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { withStyles } from '@material-ui/styles';

let defaultState = { index: 0 };
Session.setDefault('themePageState', defaultState);

import { ThemeProvider, makeStyles, useTheme } from '@material-ui/styles';


const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    display: 'flex',
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  card: {
    padding: theme.spacing(2),
    textAlign: 'left',
    backgroundColor: theme.palette.cards.main,
    color: theme.palette.cards.contrastText
  },
  control: {
    padding: theme.spacing(2)
  },
  page: {
    left: '0px', 
    marginLeft: '100px', 
    marginRight: '100px', 
    width: window.innerWidth - 200, 
    height: window.innerHeight
  },
  header: {
    width: '100%'
  },
  textField: {
    marginBottom: '10px',
    width: '100%'
  }
});


export class ThemePageOld extends React.Component {
  constructor(props) {
    super(props);
  }
  getMeteorData() {
    // this should all be handled by props
    // or a mixin!
    let data = {
      style: {
        opacity: Session.get('globalOpacity')
      },
      state: defaultState,
      colors: {
        colorA: '',
        colorB: '',
        colorC: '',
        colorD: '',
        colorE: '',
        colorF: ''
      }
    };

    if (Session.get('themePageState')) {
      data.state = Session.get('themePageState');
    }

    return data;
  }
  resetTheme(){
    console.log('reset theme...')
    var resetString = '';
    if(has(Meteor.settings, 'public.theme.backgroundImagePath')){
      resetString = get(Meteor.settings, 'public.theme.backgroundImagePath'); 
    }
    Meteor.users.update({_id: get(Meteor.currentUser(), '_id')}, {$set: {
      'profile.theme.backgroundImagePath': resetString
    }});
  }
  render(){
    var backgroundThumbnail = {
      width: '100%',
      display: 'inline-block',
      marginRight: '0px',
      marginBottom: '0px',
      height: '115px',
      objectFit: 'cover'      
    };

    // deep clone
    var redTile = JSON.parse(JSON.stringify(backgroundThumbnail));
    redTile.background = '#A64C4C';

    var blueTile = JSON.parse(JSON.stringify(backgroundThumbnail));
    blueTile.background = '#89cff0';

    var grayTile = JSON.parse(JSON.stringify(backgroundThumbnail));
    grayTile.background = '#999999';

    var greenTile = JSON.parse(JSON.stringify(backgroundThumbnail));
    greenTile.background = '#AEC9A8';

    var purpleTile = JSON.parse(JSON.stringify(backgroundThumbnail));
    purpleTile.background = 'lavender';

    var orangeTile = JSON.parse(JSON.stringify(backgroundThumbnail));
    orangeTile.background = 'peachpuff';

    var goldenrodTile = JSON.parse(JSON.stringify(backgroundThumbnail));
    goldenrodTile.background = 'goldenrod';


    var blackTile = JSON.parse(JSON.stringify(backgroundThumbnail));
    blackTile.background = '#000000';

    var charcoalTile = JSON.parse(JSON.stringify(backgroundThumbnail));
    charcoalTile.background = '#222222';

    var grayTile = JSON.parse(JSON.stringify(backgroundThumbnail));
    grayTile.background = '#999999';

    var smokeTile = JSON.parse(JSON.stringify(backgroundThumbnail));
    smokeTile.background = '#dddddd';


    var eggshellTile = JSON.parse(JSON.stringify(backgroundThumbnail));
    eggshellTile.background = '#eeeeee';



    var whiteTile = JSON.parse(JSON.stringify(backgroundThumbnail));
    whiteTile.background = '#FFFFFF';


    // Pick up any dynamic routes that are specified in packages, and include them
    var themingAssets = [];
    Object.keys(Package).forEach(function(packageName){
      if(Package[packageName].ThemingAssets){
        // we try to build up a route from what's specified in the package
        
        Package[packageName].ThemingAssets.forEach(function(asset){
          
          themingAssets.push(asset);      
        });    
      }
    });

    var controlPaneStyle = {}
    if(['iPhone'].includes(window.navigator.platform)){
      controlPaneStyle.display = 'none';
    }     

    return(
      <div id='aboutPage'>
        <div>
          <Grid container spacing={3} >
            <Grid item md={3} style={controlPaneStyle}>
              {/* <Card>
                <CardTitle
                  title='Theme'
                  subtitle='Pick a background and color!'
                />                
                <CardText>
                  <TextField
                    ref='colorA'
                    name='colorA'
                    type='text'
                    floatingLabelText='Color A'
                    floatingLabelFixed={true}
                    value={this.data.colors.colorA}
                    disabled={true}
                    /><br/>
                  <TextField
                    ref='colorB'
                    name='colorB'
                    type='text'
                    floatingLabelText='Color B'
                    floatingLabelFixed={true}
                    value={this.data.colors.colorB}
                    disabled={true}
                    /><br/>
                  <TextField
                    ref='colorC'
                    name='colorC'
                    type='text'
                    floatingLabelText='Color C'
                    floatingLabelFixed={true}
                    value={this.data.colors.colorC}
                    disabled={true}
                    /><br/>
                  <TextField
                    ref='colorD'
                    name='colorD'
                    type='text'
                    floatingLabelText='Color D'
                    floatingLabelFixed={true}
                    value={this.data.colors.colorD}
                    disabled={true}
                    /><br/>
                  <TextField
                    ref='colorE'
                    name='colorE'
                    type='text'
                    floatingLabelText='Color E'
                    floatingLabelFixed={true}
                    value={this.data.colors.colorE}
                    disabled={true}
                    /><br/>
                  <TextField
                    ref='colorF'
                    name='colorF'
                    type='text'
                    floatingLabelText='Color F'
                    floatingLabelFixed={true}
                    value={this.data.colors.colorF}
                    disabled={true}
                    /><br/>

                </CardText>
              </Card> */}
              <Divider />

              <StyledCard>
                <CardTitle
                  title='Opacity'
                />                
                {/* <OpacitySlider /> */}
              </StyledCard>
              <Divider />
                {/* <RaisedButton
                  id='darkroomButton'
                  primary={false}
                  fullWidth
                  icon={<FontIcon className="muidocs-icon-image-exposure" />}
                  onClick={this.clickOnDarkroomButton}
                  disabled={true}
                  style={{backgroundColor: '#dddddd'}}>
                    Darkroom 
                </RaisedButton> */}
              <Divider />
              {/* <RaisedButton 
                id='resetTheme'                     
                disabled={true}
                primary={false} 
                onClick={this.resetTheme} 
                fullWidth> Reset Theme </RaisedButton> */}
              <Divider />
              <Divider />

            </Grid>
            <Grid item md={9} >
              {/* <Card>
                <CardTitle
                  title='Theme'
                  subtitle='Pick a background and color!'
                />
                  <CardText>

                    </CardText>
              </Card> */}
              <Grid id='backgroundImageGallary' container >

                { themingAssets.map(asset => <Grid item md={2} key={asset.name}>
                    <StyledCard style={{marginBottom: '20px'}} >
                      <img name={asset.name} src={asset.src} style={backgroundThumbnail} responsive onClick={this.onImageClick.bind(this, asset.src)} />
                      {/* <Image responsive style={purpleTile} onClick={this.onColorClick} /> */}
                    </StyledCard>
                  </Grid>)}

              </Grid>
              <Divider />

              <Grid container>
                <Grid item md={2}>
                  <StyledCard>
                    <Image responsive style={purpleTile} onClick={this.onColorClick} />
                  </StyledCard>
                </Grid>
                <Grid item md={2}>
                  <StyledCard>
                    <Image responsive style={orangeTile} onClick={this.onColorClick} />
                  </StyledCard>
                </Grid>
                <Grid item md={2}>
                  <StyledCard>
                    <Image responsive style={redTile} onClick={this.onColorClick} />
                  </StyledCard>
                </Grid>
                <Grid item md={2}>
                  <StyledCard>
                    <Image responsive style={greenTile} onClick={this.onColorClick} />
                  </StyledCard>
                </Grid>
                <Grid item md={2}>
                  <StyledCard>
                    <Image responsive style={blueTile} onClick={this.onColorClick} />
                  </StyledCard>
                </Grid>
                <Grid item md={2}>
                  <StyledCard>
                    <Image responsive style={goldenrodTile} onClick={this.onColorClick} />
                  </StyledCard>
                </Grid>
              </Grid>
              <Divider />



              <Grid container>
                <Grid item md={2}>
                  <StyledCard>
                    <Image responsive style={whiteTile} onClick={this.onColorClick} />
                  </StyledCard>
                </Grid>
                <Grid item md={2}>
                  <StyledCard>
                    <Image responsive style={eggshellTile} onClick={this.onColorClick} />                    
                  </StyledCard>
                </Grid>
                <Grid item md={2}>
                  <StyledCard>
                    <Image responsive style={smokeTile} onClick={this.onColorClick} />                    
                  </StyledCard>
                </Grid>
                <Grid item md={2}>
                  <StyledCard>
                    <Image responsive style={grayTile} onClick={this.onColorClick} />                    
                  </StyledCard>
                </Grid>
                <Grid item md={2}>
                  <StyledCard>
                    <Image responsive style={charcoalTile} onClick={this.onColorClick} />                    
                  </StyledCard>
                </Grid>
                <Grid item md={2}>
                  <StyledCard>
                    <Image responsive style={blackTile} onClick={this.onColorClick} />                    
                  </StyledCard>
                </Grid>
              </Grid>


            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
  handleTabChange(index) {
    var state = Session.get('themePageState');
    state.index = index;
    Session.set('themePageState', state);
  }

  handleActive() {
    //console.log('Special one activated');
  }

  onColorClick(event){
    Session.set('backgroundImagePath', false);
    Session.set('backgroundColor', event.currentTarget.style['background-color']);

    // setUserTheme.call({
    //   _id:  get(Meteor.currentUser(), '_id'),
    //   backgroundColor: event.currentTarget.style['background-color']
    // }, (error) => {
    //   if (error) {
    //     Bert.alert(error.reason, 'danger');
    //   } else {
    //     Bert.alert('Background color updated!', 'success');
    //   }
    // });
  }

  onImageClick(path, event){
    console.log('onImageClick', path, event)
    if(!path){
      path = 'backgrounds/medical/' + event.currentTarget['src'].split('/')[5];
    }

    Session.set('backgroundColor', false);
    Session.set('backgroundImagePath', path);

    // setUserTheme.call({
    //   _id:  get(Meteor.currentUser(), '_id'),
    //   backgroundImagePath: path
    // }, (error) => {
    //   if (error) {
    //     Bert.alert(error.reason, 'danger');
    //   } else {
    //     Bert.alert('Background image updated!', 'success');
    //   }
    // });
  }

  onVideoClick(){
    //console.log("onVideoClick");

    Session.set('backgroundImagePath', false);
    Session.set('backgroundColor', false);
    Session.set('lastVideoRun', new Date());

    // // we're calling setUserTheme without any parameters, which will reset the theme
    // // and use the default video background
    // setUserTheme.call({
    //   _id:  get(Meteor.currentUser(), '_id')
    // }, (error) => {
    //   if (error) {
    //     Bert.alert(error.reason, 'danger');
    //   } else {
    //     Bert.alert('Background image updated!', 'success');
    //   }
    // });
  }

  clickOnDarkroomButton(){
    Session.toggle('darkroomEnabled');
  }
}






function ThemePage(props){
  console.log('ThemePage.props', props);

  // const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  // function handleDrawerOpen(){
  //   console.log('handleDrawerOpen')
  //   setDrawerIsOpen(true);
  // };

  const appTheme = useTheme();
  console.log('appTheme', appTheme)
  
  return(
    <div id='themePage' className={props.classes.page} >
      <Grid container direction="row" justify="space-evenly" alignItems="stretch" className={ props.classes.root}  spacing={24} >
          <Grid key='left' item md={3} >
            <Card className={ props.classes.card}>
              <CardHeader
                title="Palette Colors"
                subheader="Pick a background and color!"
                className={ props.classes.textField }
              />
              <CardContent>
                <TextField                  
                  name='primaryColor'
                  type='text'
                  label='Primary Color 1'
                  value={appTheme.primaryColor}
                  className={ props.classes.textField }
                  /><br/>
                <TextField                  
                  name='primaryText'
                  type='text'
                  label='Button Text'
                  value={appTheme.primaryText}
                  className={ props.classes.textField }
                  /><br/>
                <TextField                  
                  name='cardColor'
                  type='text'
                  label='Card Paper Color'
                  value={appTheme.cardColor}
                  className={ props.classes.textField }
                  /><br/>
                <TextField                  
                  name='cardText'
                  type='text'
                  label='Card Text Color'
                  value={appTheme.cardTextColor}
                  className={ props.classes.textField }
                  /><br/>
                <TextField                  
                  name='appBarColor'
                  type='text'
                  label='App Bar Color'
                  value={appTheme.appBarColor}
                  className={ props.classes.textField }
                  /><br/>
                <TextField                  
                  name='appBarTextColor'
                  type='text'
                  label='App Bar Text Color'
                  value={appTheme.appBarTextColor}
                  className={ props.classes.textField }
                  /><br/>
                <TextField                  
                  name='cardColor'
                  type='text'
                  label='Card Color'
                  value={appTheme.cardColor}
                  className={ props.classes.textField }
                  /><br/>
                <TextField                  
                  name='cardTextColor'
                  type='text'
                  label='Card TextColor'
                  value={appTheme.cardTextColor}
                  className={ props.classes.textField }
                  /><br/>
                <TextField                  
                  name='paperColor'
                  type='text'
                  label='Paper Color'
                  value={appTheme.paperColor}
                  className={ props.classes.textField }
                  /><br/>
                <TextField                  
                  name='paperTextColor'
                  type='text'
                  label='Paper TextColor'
                  value={appTheme.paperTextColor}
                  className={ props.classes.textField }
                  /><br/>
                <TextField                  
                  name='backgroundCanvas'
                  type='text'
                  label='Background Canvas'
                  value={appTheme.backgroundCanvas}
                  className={ props.classes.textField }
                  /><br/>
                <TextField                  
                  name='nivoTheme'
                  type='text'
                  label='Nivo Theme'
                  value={appTheme.nivoTheme}
                  className={ props.classes.textField }
                  /><br/>
              </CardContent>
            </Card>
          </Grid>
          <Grid key='middle' item md={9} >
            <Paper className={ props.classes.paper} />
          </Grid>
      </Grid>
    </div>
  );
}

export default withStyles(styles)(ThemePage);