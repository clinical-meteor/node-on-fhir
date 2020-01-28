import React from 'react';

import { Card } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    textAlign: 'left',
    color: theme.palette.paper.contrastText,
    backgroundColor: theme.palette.paper.main
  }
});

function StyledCard(props){
  const {children, ...otherProps } = props;

  const appTheme = useTheme();

  return(
    <Card className={ props.classes.root } {...otherProps}>
      { children }
    </Card>
  );
}

export default withStyles(styles)(StyledCard);