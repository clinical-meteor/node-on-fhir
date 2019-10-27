import React, { Component } from 'react';

import { ResponsivePie } from '@nivo/pie';

import { ThemeProvider, makeStyles } from '@material-ui/styles';

import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.background,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
}));

let pieData = [
  {
    "id": "Emergency",
    "label": "Emergency",
    "value": 158,
    "color": "hsl(314, 70%, 50%)"
  },
  {
    "id": "Ambulatory",
    "label": "Ambulatory",
    "value": 122,
    "color": "hsl(97, 70%, 50%)"
  }, 
  {
    "id": "Inpatient",
    "label": "Inpatient", 
    "value": 495,
    "color": "hsl(321, 70%, 50%)"
  },
  {
    "id": "Observation",
    "label": "Observation",
    "value": 434,
    "color": "hsl(281, 70%, 50%)"
  },
  {
    "id": "Outpatient",
    "label": "Outpatient",
    "value": 483,
    "color": "hsl(19, 70%, 50%)"
  }
];

export class ClassComponent extends React.Component {
  state = {
    counter: 0,
  }

  increment() {
    this.setState({
      counter: this.state.counter + 1
    });
  }

  render() {

    console.log('ClassComponent.this.props', this.props);
    
    const classes = useStyles();

    return (
      <div style={{width: '600px', display: 'inline-block', verticalAlign: 'top'}}>
        <h4>App Class Component</h4>
        <p>The following graph was loaded from a class component in the main app.</p>
        <div style={{ height: '600px', height: '400px' }}>
          <ResponsivePie
            data={pieData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: 'greens' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
            radialLabelsSkipAngle={10}
            radialLabelsTextXOffset={6}
            radialLabelsTextColor="#333333"
            radialLabelsLinkOffset={0}
            radialLabelsLinkDiagonalLength={16}
            radialLabelsLinkHorizontalLength={24}
            radialLabelsLinkStrokeWidth={1}
            radialLabelsLinkColor={{ from: 'color' }}
            slicesLabelsSkipAngle={10}
            slicesLabelsTextColor="#333333"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            fill={[
                {
                    match: {
                        id: 'ruby'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'c'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'go'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'python'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'scala'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'lisp'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'elixir'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'javascript'
                    },
                    id: 'lines'
                }
            ]}
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    translateY: 56,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
            ]}
          />

          <Button variant="contained" className={classes.root} onClick={() => this.increment()} >
            Click Me
          </Button>

          <p>You've pressed the button {this.state.counter} times.</p>
        </div>
      </div>
    );
  }
}
export default ClassComponent;