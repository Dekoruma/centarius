import React from 'react';
import { Link } from 'react-router-dom';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class Home extends React.Component {
  static async getInitialProps({ req, res, match, history, location, ...ctx }) {
    return { stuff: 'more stuffs' };
  }

  render() {
    return (
      <div>
        <View style={styles.box}>
          <Text style={styles.text}>
            To get started, edit src/App.js or src/Home.js and save to reload.
          </Text>
        </View>

        <View>
          <TouchableOpacity onPress={() => alert('wew')}>
            <Text>Press me</Text>
          </TouchableOpacity>
          <Link to="/about">About</Link>
        </View>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  box: { padding: 10, backgroundColor: '#ff0' },
  text: { fontWeight: 'bold' },
});

export default Home;
