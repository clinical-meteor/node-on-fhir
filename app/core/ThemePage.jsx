import React, { memo, useState, useEffect, useCallback } from 'react';

import { Card } from '@material-ui/core';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { withStyles } from '@material-ui/core/styles';

let defaultState = { index: 0 };
Session.setDefault('StyledCardState', defaultState);

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
  }
});


function StyledCard(props){
  console.log('StyledCard.props', props);

  const {children, ...otherProps } = props;

  const appTheme = useTheme();
  console.log('appTheme', appTheme)
  
  return(
    <Card className={ classes.card } {...otherProps}>
      { children }
    </Card>
  );
}

export default withStyles(styles)(StyledCard);