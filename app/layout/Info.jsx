import React, { Component } from 'react';

class Info extends Component {
  render() {
    const links = this.props.links.map(
      link => this.makeLink(link)
    );

    return (
      <div>
        <h4>Learn Meteor!</h4>
        <ul>{ links }</ul>
      </div>
    );
  }

  makeLink(link) {
    return (
      <li key={link._id}>
        <a href={link.url} target="_blank">{link.title}</a>
      </li>
    );
  }
}

