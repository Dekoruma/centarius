import React from 'react';
import { Link } from 'react-router-dom';
import { StyleSheet, Text, View } from 'react-native';

import { LongText } from 'components';

import './index.scss';

const Home = () => (
  <View style={styles.box}>
    <Text style={styles.text}>Hello, world!</Text>
    <Link className="link" to="/counter">
      Counter
    </Link>
    <Link to="/modal/basic">Modal Basic</Link>
    <Link to="/modal/enhanced">Modal Enhanced</Link>
    <LongText />
  </View>
);

const styles = StyleSheet.create({
  box: { padding: 10 },
  text: { fontWeight: 'bold' },
});

export default Home;
