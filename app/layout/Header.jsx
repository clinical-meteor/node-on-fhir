import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


// import Drawer from '@material-ui/core/Drawer';
// import List from '@material-ui/core/List';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import MailIcon from '@material-ui/icons/Mail';

import { Meteor } from 'meteor/meteor';
import { get } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

// not being used?
const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  headerContainer: {  
    height: '64px',
    position: 'relative',
    top: 0,
    left: 0,
    background: theme.palette.appBar.main,
    backgroundColor: theme.palette.appBar.main,
    color: theme.palette.appBar.contrastText,
    width: '100%',
    zIndex: 1000000
  }
});


  // Being used by the main app
  const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    headerContainer: {  
      height: '64px',
      position: 'fixed',
      top: 0,
      left: 0,
      background: theme.palette.appBar.main,
      backgroundColor: theme.palette.appBar.main,
      color: theme.palette.appBar.contrastText,
      width: '100%',
      zIndex: 1000000
    }
  }));


function Header(props) {
  // console.log('Header.props', props);
  if(props.logger){
    props.logger.info('Rendering the application Header.');
    props.logger.verbose('package.care-cards.client.layout.Header');  
  }
  // const classes = useStyles();
  // console.log('Header.classes', classes)

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  function handleDrawerOpen(){
    console.log('handleDrawerOpen')
    setDrawerIsOpen(true);
  };

  function handleDrawerClose(){
    setDrawerIsOpen(false);
  };

  function showAlert(){
    props.history.replace('/')
  }

  return (
    <AppBar id="header" position="fixed" className={ props.classes.headerContainer }>
      <Toolbar disableGutters={!drawerIsOpen} >
          <IconButton
            color="inherit"
            aria-label="Open drawer"
          >
            <MenuIcon />
          </IconButton>
        <Typography variant="h6" color="inherit" onClick={ function(){ goHome(); }} className={  props.classes.title }>
          { get(Meteor, 'settings.public.title', 'Node on FHIR') }
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  logger: PropTypes.object
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