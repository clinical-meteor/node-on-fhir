import React from 'react';

import { 
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  CardContent,
  CardMedia,
  Container,
  Grid,  
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Image,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { get } from 'lodash';
import { PageCanvas, StyledCard } from 'material-fhir-ui';

import { Icon } from 'react-icons-kit';
import { github } from 'react-icons-kit/fa/github';
import {lightbulbO} from 'react-icons-kit/fa/lightbulbO'


const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
  }
}));

function DynamicSpacer(props){
  return(<div style={{height: props.height}}></div>)
}

function LoginPage(props){
  const classes = useStyles();

  //----------------------------------------------------------------------
  // Page Styling 

  let headerHeight = 64;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 128;
  }

  let pageStyle = {
    paddingLeft: '100px', 
    paddingRight: '100px',
    position: 'absolute',
    top: '0px'
  }

  //----------------------------------------------------------------------
  // Main Render Method  

  let tagLineStyle = {
    fontWeight: 'normal',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: '0px',
    marginBottom: '40px'
  }

  let featureRowStyle = {
    height: '52px'
  }



  return (
    <PageCanvas id='LoginPage' style={pageStyle} headerHeight={headerHeight}>
        <Container maxWidth="lg" style={{paddingBottom: '80px'}}>

            <StyledCard>
              <CardHeader title="StackShare" subheader="For architecture details and discussion, please see StackShare for rationals and why we chose some technologies over others." />
              <CardActionArea onClick={openExternalPage.bind(this, "https://stackshare.io/symptomatic-llc/node-on-fhir")}>
                
              </CardActionArea>
            </StyledCard>

      </Container>
    </PageCanvas>
  );
}

export default LoginPage;