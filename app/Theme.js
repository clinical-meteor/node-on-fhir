import { createMuiTheme } from '@material-ui/core/styles';
import { get, has } from 'lodash';

  // Global Theming 
  // This is necessary for the Material UI component render layer
  let defaultAppTheme = {
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
    defaultAppTheme = Object.assign(defaultAppTheme, get(Meteor, 'settings.public.theme.palette'));
  }

  
  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: defaultAppTheme.primaryColor,
        contrastText: defaultAppTheme.primaryText
      },
      secondary: {
        main: defaultAppTheme.secondaryColor,
        contrastText: defaultAppTheme.errorText
      },
      appBar: {
        main: defaultAppTheme.appBarColor,
        contrastText: defaultAppTheme.appBarTextColor
      },
      cards: {
        main: defaultAppTheme.cardColor,
        contrastText: defaultAppTheme.cardTextColor
      },
      paper: {
        main: defaultAppTheme.paperColor,
        contrastText: defaultAppTheme.paperTextColor
      },
      error: {
        main: defaultAppTheme.errorColor,
        contrastText: defaultAppTheme.secondaryText
      },
      background: {
        default: defaultAppTheme.backgroundCanvas
      },
      contrastThreshold: 3,
      tonalOffset: 0.2
    }
  });

  export default theme;