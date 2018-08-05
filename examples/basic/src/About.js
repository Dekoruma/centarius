import React from 'react';

import centariusStateHoc from '@centarius/state-hoc';

/* eslint-disable */

class About extends React.Component {
  static async getInitialProps({ req, res, match, history, location, ...ctx }) {
    console.log('hello from about');
    return { stuff: 'more stuffs' };
  }

  render() {
    return <div>about : {this.props.stuff}</div>;
  }
}

export default centariusStateHoc({
  LoadingComponent: () => <div>Loading...</div>,
})(About);
