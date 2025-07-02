import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeFoodStorage } from '../services/foodStorage';
import { colors, baseContainer, baseButton, sharedStyles } from '../styles/shared';

interface LoginScreenProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (state: boolean) => void;
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ isLoggedIn, setIsLoggedIn, navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async () => {
    const userStr = await AsyncStorage.getItem('user');
    if (!userStr) {
      setError('No user found. Please sign up.');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.username === username && user.password === password) {
      setError('');
      setIsLoggedIn(true);
      navigation.replace('HomeScreen');
    } else {
      setError('Invalid credentials.');
    }
  };

  const handleSignUp = async () => {
    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      setError('A user already exists. Please sign in.');
      return;
    }
    await AsyncStorage.setItem('user', JSON.stringify({ username, password }));
    setError('');
    setIsLoggedIn(true);
    navigation.replace('HomeScreen');
  };

  const handleLogout = async () => {
    await AsyncStorage.setItem('loggedIn', 'false');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setError('');
    setIsSignUp(false);
  };

  const handleSwitchMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setUsername('');
    setPassword('');
  };

  const handleResetApp = async () => {
    await AsyncStorage.clear();
    await initializeFoodStorage();
    setUsername('');
    setPassword('');
    setError('All app data reset. You can sign up again.');
    setIsSignUp(false);
  };

  if (isLoggedIn) {
    return (
      <View style={[baseContainer, styles.container]}>
        <Text style={sharedStyles.title}>Purrfect Plants</Text>
        <Image source={require('../assets/cat1.png')} style={styles.catImage} />
        <Text style={styles.loggedInText}>You are logged in!</Text>
        <TouchableOpacity style={[baseButton, styles.button]} onPress={handleLogout}>
          <Text style={sharedStyles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[baseContainer, styles.container]}>
      <Text style={sharedStyles.title}>Purrfect Plants</Text>
      <Image source={require('../assets/cat1.png')} style={styles.catImage} />
      {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#aaa" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={[baseButton, styles.button]} onPress={isSignUp ? handleSignUp : handleLogin}>
        <Text style={sharedStyles.buttonText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSwitchMode}>
        <Text style={styles.switchText}>{isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resetButton} onPress={handleResetApp}>
        <Text style={styles.resetButtonText}>Reset App</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  catImage: { width: 180, height: 180, marginBottom: 32, borderRadius: 90, borderWidth: 4, borderColor: colors.border },
  input: { width: 260, height: 48, borderColor: colors.border, borderWidth: 2, borderRadius: 24, paddingHorizontal: 20, marginBottom: 16, backgroundColor: '#fff', fontSize: 18 },
  button: { marginTop: 12, backgroundColor: colors.primary },
  switchText: { color: colors.text, marginTop: 18, fontSize: 16, textDecorationLine: 'underline' },
  loggedInText: { fontSize: 22, color: colors.text, marginBottom: 18, fontWeight: 'bold' },
  resetButton: { marginTop: 30, backgroundColor: colors.warning, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 30 },
  resetButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default LoginScreen; 