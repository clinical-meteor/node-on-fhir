import React from 'react';
import { makeStyles, Container as MuiContainer } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    // paddingTop: theme.spacing(3),
    // paddingBottom: theme.spacing(3),
    // [theme.breakpoints.down('xs')]: {
    //   marginTop: 64,
    // },
    height: '100%'
  }
}));

// interface ContainerProps {
//   children: React.ReactNode;
//   maxWidth?: 'sm' | 'md';
// }

function Container({ children, maxWidth }){
  const classes = useStyles();

  return (
    <MuiContainer maxWidth={maxWidth} >
      {children}
    </MuiContainer>
  );
};

export default Container;