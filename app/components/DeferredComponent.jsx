import React from 'react';

class DeferredComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {Component: null, loading: true};
  }

  componentDidMount() {
    this.loadComponent();
  }

  loadComponent() {
    this.props.importFunction().then((Component) => {
      this.setState({loading: false, Component: Component.default});
    });
  }

  render() {
    const props = this.props;
    const {loading, Component} = this.state;
    if (loading) {
      return this.props.loadingComponent || null
    }
    return (<Component {...props} />);
  }
}


export default DeferredComponent;