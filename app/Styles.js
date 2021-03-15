import { get } from 'lodash';
import { Meteor } from 'meteor/meteor';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import theme from './Theme';

// ==============================================================================
// Theming

const drawerWidth =  get(Meteor, 'settings.public.defaults.drawerWidth', 280);

let rawStyles = {
    headerNavContainer: {  
      height: '64px',
      position: 'fixed',
      top: "0px",
      left: "0px",
      background: theme.palette.appBar.main,
      backgroundColor: theme.palette.appBar.main,
      color: theme.palette.appBar.contrastText,
      width: '100%',
      zIndex: 1200,
      margin: '0px',
      transition: theme.transitions.create(['width', 'left', 'top'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      filter: "grayscale(" + get(Meteor, 'settings.public.theme.grayscaleFilter', "0%") + ")"
    },
    title: {
      flexGrow: 1,
      color: theme.palette.appBar.contrastText,
      paddingTop: '0px',
      fontWeight: '200',
      fontSize: '2.125rem',
      float: 'left',
      marginTop: Meteor.isCordova ? '5px !important' : '0px',
      whiteSpace: 'nowrap'
    },
    header_label: {
      paddingTop: '10px',
      fontWeight: 'bold',
      fontSize: '1 rem',
      float: 'left',
      paddingRight: '10px',
      paddingLeft: '40px'
    },
    header_text: {
      paddingTop: '10px',
      fontSize: '1 rem',
      float: 'left'
    },
    sidebarMenuButton: {
      float: 'left',
      color: theme.palette.appBar.contrastText,
      background: 'inherit',
      backgroundColor: 'inherit',
      border: '0px none black',
      paddingTop: '10px',
      paddingLeft: '20px',
      paddingRight: '20px',
      cursor: 'pointer'
    },
    footerNavContainer: {  
      height: '64px',
      position: 'fixed',
      bottom: "0px",
      left: "0px",
      background: theme.palette.appBar.main,
      backgroundColor: theme.palette.appBar.main,
      color: theme.palette.appBar.contrastText,
      width: '100%',
      zIndex: 1300,
      borderTop: '1px solid lightgray',
      transition: theme.transitions.create(['width', 'left', 'bottom'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      filter: "grayscale(" + get(Meteor, 'settings.public.theme.grayscaleFilter', "0%") + ")"
    },
    footer: {
      flexGrow: 1,
      backgroundColor: theme.palette.appBar.main,
      color: theme.palette.appBar.contrastText
    },
    footerNavigation: {
      backgroundColor: "inherit", 
      justifyContent: 'left',
      position: 'absolute'
    },
    primaryFlexPanel: {
      display: 'flex',
    },
    canvas: {
      flexGrow: 1,
      position: "absolute",
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      paddingTop: '0px',
      paddingBottom: '0px',
      background: 'inherit',
      //backgroundColor: theme.palette.background.default,
      transition: theme.transitions.create('left', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.leavingScreen,
      }),
      display: 'block'
    },
    canvasOpen: {
      flexGrow: 1,
      position: "fixed",
      left: drawerWidth,
      top: 0,
      width: '100%',
      height: '100%',
      paddingTop: '0px',
      paddingBottom: '0px',
      background: 'inherit',
      //backgroundColor: theme.palette.background.default,
      transition: theme.transitions.create('left', {
        easing: theme.transitions.easing.easeIn,
        duration: theme.transitions.duration.enteringScreen,
      }),
      display: 'block',
      overflowX: 'hidden'
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      position: 'absolute', 
      zIndex: 1100,
      backgroundColor: theme.palette.paper.main,
      transition: theme.transitions.create(['left'], {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.enteringScreen
        }),
      left: '0px'
    },
    drawerContents: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      position: 'absolute', 
      zIndex: 1100,
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create(['left'], {
        easing: theme.transitions.easing.easeIn,
        duration: theme.transitions.duration.enteringScreen
      }),
      backgroundColor: 'inherit',
      position: 'relative',
      // backgroundColor: theme.palette.paper.main,
      // opacity: 1,
      left: '0px'
    },
    drawerClose: {
      transition: theme.transitions.create(['left'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1
      },
      backgroundColor: 'inherit',
      position: 'relative',
      // backgroundColor: theme.palette.paper.main,
      // opacity: (get(Meteor, 'settings.public.defaults.sidebar.minibarVisible') && (window.innerWidth > 1072)) ? 1 : 0,
      // left: (get(Meteor, 'settings.public.defaults.sidebar.minibarVisible') && (window.innerWidth > 1072)) ? '0px' : ('-' + drawerWidth + 'px')
      left: (0 - drawerWidth) + "px"      
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerIcons: {
      fontSize: '200%',
      paddingLeft: '10px',
      paddingRight: '2px'
    },
    divider: {
      height: '2px'
    },
    drawerText: {
      textDecoration: 'none !important'
    },
    hide: {
      display: 'none',
    },
    menuButton: {
      marginRight: 36,
      float: 'left'
    },
    toolbar: {
      display: 'inline-block',
      minHeight: get(Meteor, 'settings.public.defaults.prominantHeader') ? "128px" : "64px",
      float: 'left'
    },
    header_label: {
      paddingTop: '10px',
      fontWeight: 'bold',
      fontSize: '1 rem',
      float: 'left',
      paddingRight: '10px'
    },
    header_text: {
      paddingTop: '10px',
      fontSize: '1 rem',
      float: 'left'
    },
    northeast_title: {
      paddingTop: '10px',
      float: 'right',
      position: 'absolute',
      paddingRight: '20px',
      right: '0px',
      top: '0px',
      fontWeight: 'normal'
    },
    menu_items: {
      position: 'absolute',
      bottom: '10px'
    },
    divider: {
      height: '2px'
    }
  }



if(get(Meteor, 'settings.public.defaults.disableFooter')){
    rawStyles.footerNavContainer.display = 'none'
}
if(get(Meteor, 'settings.public.defaults.disableHeader')){
  rawStyles.headerNavContainer.display = 'none'
}
if(get(Meteor, 'settings.public.defaults.prominantHeader')){
  rawStyles.headerNavContainer.height = '128px';
}


const useStyles = makeStyles(theme => (rawStyles), {index: 1});

export default useStyles;