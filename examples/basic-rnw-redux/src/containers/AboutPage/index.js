import React, { Component } from 'react';
import { View, Text } from 'react-native';

class Home extends Component {
  static async getInitialProps({ req, res, match, history, location, ...ctx }) {
    return { about: 'Hello' };
  }

  render() {
    return (
      <View>
        <Text style={{ fontWeight: 'bold' }}>{this.props.about}</Text>
      </View>
    );
  }
}

export default Home;
