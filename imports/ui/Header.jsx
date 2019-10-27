import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { Link } from "react-router-dom";

import { ThemeProvider, makeStyles, useTheme } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  headerContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 10000
  },
  header: {
    flexGrow: 1
  },
  title: {
    cursor: 'pointer'
  }
}));


function Header(props) {
  const classes = useStyles();

  function showAlert(){
    props.history.replace('/')
  }

  return (
    <div id='headerContainer' className={classes.headerContainer}>
      <AppBar id="header" position="static" color="default" className={classes.header} >
        <Toolbar>
          <Typography variant="h6" color="inherit" onClick={ function(){ showAlert(); }} className={classes.title}>
            Node on FHIR Analytics
          </Typography>

          <div style={{marginLeft: '80px', zIndex: 1000}}>
            <Link to='/pie-graph' style={{marginRight: '40px'}}>Pie</Link>
            <Link to='/sunburst-graph' style={{marginRight: '40px'}}>Sunburst</Link>
            <Link to='/parallel-coordinates-graph' style={{marginRight: '40px'}}>Parallel Coordinates</Link>
            <Link to='/bar-graph' style={{marginRight: '40px'}}>Bar Coordinates</Link>
            <Link to='/sankey-graph' style={{marginRight: '40px'}}>Sankey Coordinates</Link>
            <Link to='/network-graph' style={{marginRight: '40px'}}>Network</Link>
          </div>

        </Toolbar>
      </AppBar>
    </div>

  );
}


export default Header;