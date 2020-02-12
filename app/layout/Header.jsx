import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { Meteor } from 'meteor/meteor';
import { get } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';




const drawerWidth =  get(Meteor, 'settings.public.defaults.drawerWidth', 280);

// not being used?
const styles = theme => ({
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    minHeight: 128,
    alignItems: 'flex-start'
  },
  title: {
    flexGrow: 1
  }
});



function Header(props) {
  if(props.logger){
    props.logger.info('Rendering the application Header.');
    props.logger.verbose('package.care-cards.client.layout.Header');  
  }

  console.log("Header.props", props)

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  function clickOnMenuButton(){
    console.log('clickOnMenuButton')

    props.handleDrawerOpen.call(this);
  };

  function handleDrawerClose(){
    setDrawerIsOpen(false);
  };

  function showAlert(){
    props.history.replace('/')
  }

  let styles = {
    headerContainer: {  
      height: '64px',
      position: 'fixed',
      top: 0,
      left: 0,
      background: props.theme.palette.appBar.main,
      backgroundColor: props.theme.palette.appBar.main,
      color: props.theme.palette.appBar.contrastText,
      width: '100%',
      zIndex: 1000000,
      transition: props.theme.transitions.create(['width', 'left'], {
        easing: props.theme.transitions.easing.sharp,
        duration: props.theme.transitions.duration.leavingScreen
      })
    },
    title: {
      flexGrow: 1,
      background: props.theme.palette.appBar.main,
      backgroundColor: props.theme.palette.appBar.main,
      color: props.theme.palette.appBar.contrastText
    }
  }

  if(Meteor.isClient && props.drawerIsOpen){
    styles.headerContainer.width = window.innerWidth - drawerWidth;
    styles.headerContainer.left = drawerWidth;
  }

  if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
    styles.headerContainer.height = '128px';
  }



  return (
    <AppBar id="header" position="fixed" style={styles.headerContainer}>
      <Toolbar disableGutters={!drawerIsOpen} >
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={ clickOnMenuButton }
          >
            <MenuIcon />
          </IconButton>
        <Typography variant="h6" color="inherit" onClick={ function(){ goHome(); }} style={  styles.title }>
          { get(Meteor, 'settings.public.title', 'Node on FHIR') }
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  logger: PropTypes.object,
  drawerIsOpen: PropTypes.bool,
  handleDrawerOpen: PropTypes.func
}
Header.defaultProps = {
  logger: {
    debug: function(){},
    info: function(){},
    warn: function(){},
    trace: function(){},
    data: function(){},
    verbose: function(){},
    error: function(){}
  }
}

// export default Header;
export default withStyles(styles, { withTheme: true })(Header);