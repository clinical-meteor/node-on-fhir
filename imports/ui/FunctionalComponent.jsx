import React, { Component, useState, useEffect } from 'react';
import { ResponsiveParallelCoordinates } from '@nivo/parallel-coordinates';
import { ThemeProvider, makeStyles } from '@material-ui/styles';

import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  button: {
    background: theme.background,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: theme.buttonText,
    height: 48,
    padding: '0 30px',
  }
}));

let variables = [{
      key: 'A',
      type: 'linear',
      min: 'auto',
      max: 'auto',
      ticksPosition: 'before',
      legend: 'A',
      legendPosition: 'start',
      legendOffset: 20
  },
  {
      key: 'B',
      type: 'linear',
      min: 0,
      max: 'auto',
      ticksPosition: 'before',
      legend: 'B',
      legendPosition: 'start',
      legendOffset: 20
  },
  {
    key: 'E',
    type: 'linear',
    min: 0,
    max: 'auto',
    ticksPosition: 'before',
    legend: 'E',
    legendPosition: 'start',
    legendOffset: 20
},
{
    key: 'C',
    type: 'linear',
    min: 0,
    max: 'auto',
    ticksPosition: 'before',
    legend: 'C',
    legendPosition: 'start',
    legendOffset: 20
},
{
    key: 'D',
    type: 'linear',
    min: 0,
    max: 'auto',
    ticksPosition: 'before',
    legend: 'D',
    legendPosition: 'start',
    legendOffset: 20
}]

let parallelData = [
  {
    "A": 30,
    "B": 2,
    "C": 1,
    "D": 29,
    "E": 47
  },
  {
    "A": 40,
    "B": 4,
    "C": 1,
    "D": 3,
    "E": 64
  },
  {
    "A": -10,
    "B": 3,
    "C": 1,
    "D": 35,
    "E": 37
  },
  {
    "A": 1,
    "B": 1,
    "C": 1,
    "D": 17,
    "E": 44
  },
  {
    "A": 10,
    "B": 1,
    "C": 1,
    "D": 18,
    "E": 54
  },
  {
    "A": 20,
    "B": 5,
    "C": 1,
    "D": 54,
    "E": 30
  },
  {
    "A": -8,
    "B": 4,
    "C": 1,
    "D": 40,
    "E": 09
  },
  {
    "A": 10,
    "B": 2,
    "C": 1,
    "D": 28,
    "E": 48
  },
  {
    "A": 1,
    "B": 1,
    "C": 1,
    "D": 16,
    "E": 18
  },
  {
    "A": 18,
    "B": 7,
    "C": 1,
    "D": 76,
    "E": 34
  },
  {
    "A": 25,
    "B": 1,
    "C": 1,
    "D": 12,
    "E": 41
  },
  {
    "A": 20,
    "B": 3,
    "C": 1,
    "D": 33,
    "E": 09
  },
  {
    "A": 4,
    "B": 1,
    "C": 1,
    "D": 11,
    "E": 24
  },
  {
    "A": 25,
    "B": 2,
    "C": 1,
    "D": 29,
    "E": 71
  },
  {
    "A": -6,
    "B": 9,
    "C": 1,
    "D": 97,
    "E": 32
  },
  {
    "A": 4,
    "B": 3,
    "C": 1,
    "D": 32,
    "E": 29
  },
  {
    "A": 12,
    "B": 2,
    "C": 1,
    "D": 22,
    "E": 64
  },
  {
    "A": 35,
    "B": 7,
    "C": 1,
    "D": 71,
    "E": 29
  },
  {
    "A": -10,
    "B": 2,
    "C": 1,
    "D": 24,
    "E": 58
  },
  {
    "A": 16,
    "B": 1,
    "C": 1,
    "D": 11,
    "E": 24
  },
  {
    "A": 31,
    "B": 1,
    "C": 1,
    "D": 15,
    "E": 36
  },
  {
    "A": -7,
    "B": 1,
    "C": 1,
    "D": 14,
    "E": 26
  },
  {
    "A": -4,
    "B": 2,
    "C": 1,
    "D": 22,
    "E": 52
  },
  {
    "A": 6,
    "B": 3,
    "C": 1,
    "D": 31,
    "E": 65
  },
  {
    "A": 38,
    "B": 2,
    "C": 1,
    "D": 22,
    "E": 47
  },
  {
    "A": 15,
    "B": 1,
    "C": 1,
    "D": 14,
    "E": 34
  },
  {
    "A": 32,
    "B": 2,
    "C": 1,
    "D": 20,
    "E": 04
  },
  {
    "A": -6,
    "B": 6,
    "C": 1,
    "D": 61,
    "E": 42
  },
  {
    "A": 16,
    "B": 1,
    "C": 1,
    "D": 12,
    "E": 10
  },
  {
    "A": 36,
    "B": 3,
    "C": 1,
    "D": 31,
    "E": 54
  },
  {
    "A": 13,
    "B": 1,
    "C": 1,
    "D": 12,
    "E": 26
  },
  {
    "A": 30,
    "B": 1,
    "C": 1,
    "D": 12,
    "E": 73
  }
];

function FunctionalComponent(props) {
  // console.log('FunctionalComponent.props', props);

  const [count, setCount] = useState(0);

  const classes = useStyles();

  function handleIncrement(){
    setCount(currentCount => currentCount + 1);    
  }

  useEffect(() => setCount(currentCount => currentCount + 1), []);

  return (
    <div style={{width: '600px', display: 'inline-block', verticalAlign: 'top'}}>
        <h4>App Functional Component</h4>
        <p>The following graph was loaded from a functional component in the main app.</p>
        <div style={{width: '600px', height: '400px'}}>
          <ResponsiveParallelCoordinates
            data={parallelData}
            curve="cardinal"
            colors={{ scheme: 'greens' }}
            variables={variables}
            margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
            animate={true}
            motionStiffness={90}
            motionDamping={12}
          />
        </div>


        <Button variant="contained" className={classes.button} onClick={() => handleIncrement()} >
          Click Me
        </Button>
        <h2>{count}</h2>
    </div>
  );
}
export default FunctionalComponent;