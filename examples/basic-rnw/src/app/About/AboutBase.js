import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'react-router-dom';

import centariusStateHoc from '@centarius/state-hoc';

class About extends React.Component {
  static async getInitialProps(ctx) {
    return { about: 'more stuffs' };
  }

  render() {
    return (
      <View style={styles.box}>
        <Text>about : {this.props.about}</Text>
        <Link to="/">HOME im coming</Link>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    padding: 8,
    backgroundColor: '#00f',
  },
  box: {
    paddingBottom: 50,
  },
});

export default centariusStateHoc({
  ErrorComponent: () => <div>error</div>,
})(About);
