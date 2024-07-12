import React, { useState } from 'react';

import { Button, Grid, CardHeader, CardContent, Typography } from '@material-ui/core';
import { StyledCard, PageCanvas } from 'fhir-starter';


import PropTypes from 'prop-types';



export function NoDataWrapper(props){

    let { 
        children,
        dataCount,
        title,
        subheader,
        noDataImagePath,
        buttonLabel,
        marginTop,
        redirectPath,
        ...otherProps 
    } = props;
    
    // Meteor.absoluteUrl() + noDataImage
    
    function handleOpenPage(){
        if(redirectPath){
            props.history.replace(redirectPath);
        } else {
            props.history.replace("/");
        }
    }
    
    let dataManagementElements;
    if(dataCount > 0){
        dataManagementElements = children;
    } else {
    let noDataImageElement;
    if(noDataImagePath){
        noDataImageElement = <img src={noDataImagePath} style={{width: '100%', marginTop: marginTop}} />;
    }
    dataManagementElements = <Grid justify="center" container spacing={8} style={{marginTop: '0px', marginBottom: '80px'}}>            
        <Grid item md={6}>
            <CardHeader title={title} subheader={subheader} />
            { noDataImageElement }
            <CardContent>
            <Button 
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleOpenPage.bind(this)}
            >{buttonLabel}</Button>

            </CardContent>
        </Grid>
      </Grid>
    }

    return(dataManagementElements);
}



NoDataWrapper.propTypes = { 
    dataCount: PropTypes.number,
    title: PropTypes.string,
    subheader: PropTypes.string,
    buttonLabel: PropTypes.string,
    noDataImagePath: PropTypes.string,
    marginTop: PropTypes.string,
    redirectPath: PropTypes.string
};
  
NoDataWrapper.defaultProps = {
    dataCount: 0,
    title: "No Data",
    subheader: "Click the button to begin importing data.",
    buttonLabel: "Import Data",
    noDataImagePath: "NoData.png",
    marginTop: "0px",
    redirectPath: "/import-data"
}
  
  export default NoDataWrapper