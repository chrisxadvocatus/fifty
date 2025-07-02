/**
 * FiftyApp - React Native App
 * A simple welcome screen
 *
 * @format
 */

import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import FoodEntryScreen from './src/screens/FoodEntryScreen';
import AddCustomFoodScreen from './src/screens/AddCustomFoodScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check login state on mount
  useEffect(() => {
    const checkLogin = async () => {
      const flag = await AsyncStorage.getItem('loggedIn');
      setIsLoggedIn(flag === 'true');
    };
    checkLogin();
  }, []);

  // Handler to update login state
  const handleLoginState = useCallback(async (state: boolean) => {
    await AsyncStorage.setItem('loggedIn', state ? 'true' : 'false');
    setIsLoggedIn(state);
  }, []);

  if (isLoggedIn === null) return null; // or a splash/loading screen

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'HomeScreen' : 'LoginScreen'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen">
          {props => <LoginScreen {...props} isLoggedIn={!!isLoggedIn} setIsLoggedIn={handleLoginState} />}
        </Stack.Screen>
        <Stack.Screen name="HomeScreen">
          {props => <HomeScreen {...props} setIsLoggedIn={handleLoginState} />}
        </Stack.Screen>
        <Stack.Screen name="FoodEntryScreen" component={FoodEntryScreen} />
        <Stack.Screen name="AddCustomFoodScreen" component={AddCustomFoodScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
