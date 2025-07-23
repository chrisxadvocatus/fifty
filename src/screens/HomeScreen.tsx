import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, baseContainer, baseButton, sharedStyles } from '../styles/shared';
import { getTodaysFoodEntryCount, getLast7DaysFoodEntryCount, getLast7DaysFoods, getCarbStreak, resetCarbStreak } from '../services/foodStorage';

interface HomeScreenProps {
  setIsLoggedIn: (state: boolean) => void;
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setIsLoggedIn, navigation }) => {
  const [todayCount, setTodayCount] = React.useState<number>(0);
  const [last7DaysCount, setLast7DaysCount] = React.useState<number>(0);
  const [progressMode, setProgressMode] = React.useState<'daily' | 'weekly'>('daily');
  const [last7DaysFoods, setLast7DaysFoods] = React.useState<string[]>([]);
  const [carbStreak, setCarbStreak] = React.useState<number>(0); // NEW

  React.useEffect(() => {
    const fetchCounts = async () => {
      const count = await getTodaysFoodEntryCount();
      setTodayCount(count);
      const weekCount = await getLast7DaysFoodEntryCount();
      setLast7DaysCount(weekCount);
      const foods = await getLast7DaysFoods();
      setLast7DaysFoods(foods);
      const streak = await getCarbStreak();
      setCarbStreak(streak);
    };
    fetchCounts();
    const focusListener = navigation.addListener('focus', fetchCounts);
    return () => focusListener && focusListener();
  }, [navigation]);

  const handleToggleProgressMode = () => {
    setProgressMode((prev) => (prev === 'daily' ? 'weekly' : 'daily'));
  };

  const handleLogout = async () => {
    await AsyncStorage.setItem('loggedIn', 'false');
    setIsLoggedIn(false);
    navigation.replace('LoginScreen');
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingVertical: 32,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
    >
      <View style={[baseContainer, styles.container]}>
        <Image source={require('../assets/cat2.png')} style={styles.catImage} />
        <Text style={styles.greeting}>Hello, User! 🐾</Text>
        <View style={styles.progressBox}>
          <Text style={sharedStyles.boxTitle}>Plant Progress</Text>
          {progressMode === 'daily' ? (
            <Text style={styles.progressText}>Today: {todayCount}/10 plants</Text>
          ) : (
            <Text style={styles.progressText}>Last 7 days: {last7DaysCount}/50 plants</Text>
          )}
          <TouchableOpacity style={styles.toggleButton} onPress={handleToggleProgressMode}>
            <Text style={styles.toggleButtonText}>
              {progressMode === 'daily' ? 'Daily ▼' : 'Last 7 days ▼'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBox}>
          <Text style={sharedStyles.boxTitle}>Refined Carbs</Text>
          <Text style={styles.progressText}>Streak: {carbStreak} days clean</Text>
          <TouchableOpacity style={styles.addCarbButton} onPress={async () => { await resetCarbStreak(); setCarbStreak(0); }}>
            <Text style={styles.addCarbButtonText}>I had carbs today</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[baseButton, styles.foodEntryButton]} onPress={() => navigation.navigate('FoodEntryScreen')}>
          <Text style={sharedStyles.buttonText}>Add Today's Plants 🍃</Text>
        </TouchableOpacity>

        {/* Spacer to match space between progress boxes */}
        <View style={{ height: 20 }} />

        {/* Last 7 Days Foods List */}
        <View style={styles.progressBox}>
          <Text style={sharedStyles.boxTitle}>Foods in the Last 7 Days</Text>
          {last7DaysFoods.length === 0 ? (
            <Text style={{ color: '#888', marginTop: 8 }}>No foods added in the last 7 days.</Text>
          ) : (
            <View style={styles.foodsList}>
              {last7DaysFoods.map(food => (
                <View key={food} style={styles.foodItem}>
                  <Text style={styles.foodText}>{food}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <TouchableOpacity style={[baseButton, styles.logoutButton]} onPress={handleLogout}>
          <Text style={sharedStyles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  foodsList: { width: '100%', marginTop: 8 },
  foodItem: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 14, marginBottom: 6, alignItems: 'center' },
  foodText: { fontSize: 16, color: '#237a44', fontWeight: 'bold' },
});

export default HomeScreen; 