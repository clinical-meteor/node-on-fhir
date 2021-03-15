import { createMuiTheme } from '@material-ui/core/styles';
import { get, has } from 'lodash';

  // Global Theming 
  // This is necessary for the Material UI component render layer
export const defaultAppPalette = {
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

  canvasColor: "rgba(255, 255, 255, 1) !important",
  canvasTextColor: "rgba(0, 0, 0, 1) !important",

  bodyBackground: "#000000",

  nivoTheme: "greens"
}

// convert our const into a variable
let themedAppPalette = defaultAppPalette;

// and then assign a globally defined theme from a settings file, if available
if(get(Meteor, 'settings.public.theme.palette')){
  themedAppPalette = Object.assign(defaultAppPalette, get(Meteor, 'settings.public.theme.palette'));
}


// then feed the themed palette into the muiTheme generator.
export const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: themedAppPalette.primaryColor,
        contrastText: themedAppPalette.primaryText
      },
      secondary: {
        main: themedAppPalette.secondaryColor,
        contrastText: themedAppPalette.errorText
      },
      appBar: {
        main: themedAppPalette.appBarColor,
        contrastText: themedAppPalette.appBarTextColor
      },
      cards: {
        main: themedAppPalette.cardColor,
        contrastText: themedAppPalette.cardTextColor
      },
      paper: {
        main: themedAppPalette.paperColor,
        contrastText: themedAppPalette.paperTextColor
      },
      error: {
        main: themedAppPalette.errorColor,
        contrastText: themedAppPalette.secondaryText
      },
      background: {
        default: get(themedAppPalette, "bodyBackground", "#000000") 
      },
      contrastThreshold: 3,
      tonalOffset: 0.2
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
            body: {
                backgroundColor: "black",
                background: "black"
            }
        }
      }
    }
  });

  // et viola!
  export default theme;