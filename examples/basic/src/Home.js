import React, { Component } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

import centariusStateHoc from '@centarius/state-hoc';
import logo from './react.svg';

/* eslint-disable */

class Home extends Component {
  static async getInitialProps({ req, res, match, history, location, ...ctx }) {
    return { stuff: 'whatevs' };
  }

  render() {
    return (
      <div className="Home">
        <div className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h2>Welcome to Centarius</h2>
        </div>
        <p className="Home-intro">
          To get started, edit
          <code>src/Home.js</code> or <code>src/About.js</code> and save to
          reload.
        </p>
        <Link to="/about">About -></Link>

        <p>Props Passed : {this.props.stuff}</p>
      </div>
    );
  }
}

export default centariusStateHoc({
  LoadingComponent: () => <div>Loading...</div>,
})(Home);
