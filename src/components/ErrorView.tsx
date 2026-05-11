import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorView = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Error</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'red',
  },
});

export default ErrorView;
