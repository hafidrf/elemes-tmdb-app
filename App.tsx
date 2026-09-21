/**
 * App root: Redux store → safe-area provider → navigation.
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/app/navigation/RootNavigator';
import { store } from './src/app/store/store';
import { colors } from './src/shared/theme/colors';

const App = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <RootNavigator />
    </SafeAreaProvider>
  </Provider>
);

export default App;

