/**
 * FiftyApp - React Native App
 * A simple welcome screen
 *
 * @format
 */

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Screen1" component={Screen1} options={{ title: 'Screen 1' }} />
        <Stack.Screen name="Screen2" component={Screen2} options={{ title: 'Screen 2' }} />
        <Stack.Screen name="Screen3" component={Screen3} options={{ title: 'Screen 3' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
