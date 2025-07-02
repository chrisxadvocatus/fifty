import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, baseContainer, baseButton, sharedStyles } from '../styles/shared';
import { getTodaysFoodEntryCount } from '../services/foodStorage';

interface HomeScreenProps {
  setIsLoggedIn: (state: boolean) => void;
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setIsLoggedIn, navigation }) => {
  const [todayCount, setTodayCount] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchCount = async () => {
      const count = await getTodaysFoodEntryCount();
      setTodayCount(count);
    };
    fetchCount();
    const focusListener = navigation.addListener('focus', fetchCount);
    return () => focusListener && focusListener();
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.setItem('loggedIn', 'false');
    setIsLoggedIn(false);
    navigation.replace('LoginScreen');
  };

  return (
    <View style={[baseContainer, styles.container]}>
      <Image source={require('../assets/cat2.png')} style={styles.catImage} />
      <Text style={styles.greeting}>Hello, User! 🐾</Text>
      <View style={styles.progressBox}>
        <Text style={sharedStyles.boxTitle}>Plant Progress</Text>
        <Text style={styles.progressText}>Today: {todayCount}/10 plants</Text>
        <TouchableOpacity style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>Daily ▼</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.progressBox}>
        <Text style={sharedStyles.boxTitle}>Refined Carbs</Text>
        <Text style={styles.progressText}>Streak: 3 days clean</Text>
        <TouchableOpacity style={styles.addCarbButton}>
          <Text style={styles.addCarbButtonText}>I had carbs today</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[baseButton, styles.foodEntryButton]} onPress={() => navigation.navigate('FoodEntryScreen')}>
        <Text style={sharedStyles.buttonText}>Add Today's Plants 🍃</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[baseButton, styles.logoutButton]} onPress={handleLogout}>
        <Text style={sharedStyles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 40 },
  catImage: { width: 120, height: 120, marginBottom: 16, borderRadius: 60, borderWidth: 3, borderColor: colors.border },
  greeting: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 24, fontFamily: 'Avenir-Heavy' },
  progressBox: { width: 320, backgroundColor: colors.box, borderRadius: 24, padding: 20, marginBottom: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, borderWidth: 2, borderColor: colors.border },
  progressText: { fontSize: 18, color: colors.text, marginBottom: 10 },
  toggleButton: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 6, paddingHorizontal: 18 },
  toggleButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  addCarbButton: { backgroundColor: colors.highlight, borderRadius: 16, paddingVertical: 6, paddingHorizontal: 18, marginTop: 8 },
  addCarbButtonText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  logoutButton: { backgroundColor: colors.warning, marginTop: 20 },
  foodEntryButton: { backgroundColor: colors.accent, marginBottom: 10 },
});

export default HomeScreen; 