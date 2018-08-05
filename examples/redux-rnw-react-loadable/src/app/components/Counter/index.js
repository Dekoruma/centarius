import React from 'react';
import { compose, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import CSSModules from 'react-css-modules';

import style from './index.module.css';

export const enhance = compose(
  CSSModules(style),
  setPropTypes({
    increment: PropTypes.func.isRequired,
    incrementIfOdd: PropTypes.func.isRequired,
    incrementAsync: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired,
    counter: PropTypes.number.isRequired,
    hello: PropTypes.string,
  })
);

export default enhance(
  ({
    increment,
    incrementIfOdd,
    incrementAsync,
    decrement,
    counter,
    hello,
  }) => (
    <View>
      <Text>hello {hello}</Text>
      <View>
        <Text>Clicked: {counter} times</Text>
      </View>
      <View>
        <Text styleName="increment" onPress={increment}>
          +
        </Text>
        <TouchableOpacity onPress={decrement}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text onPress={incrementIfOdd}>Increment if odd</Text>
        <Text onPress={() => incrementAsync()}>Increment async</Text>
      </View>
    </View>
  )
);
