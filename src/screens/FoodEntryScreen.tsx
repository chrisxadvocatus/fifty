import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchFoods } from '../services/foodSearch';
import { REVERSE_MAP_KEY, addFoodEntryForToday, computeFavorite, deleteFoodEntryForToday } from '../services/foodStorage';


export const categories = [
  { key: 'greens', label: 'Greens', icon: '🥬' },
  { key: 'otherVeggies', label: 'Other Veggies', icon: '🥕' },
  { key: 'legumes', label: 'Legumes', icon: '🫘' },
  { key: 'nuts', label: 'Nuts', icon: '🥜' },
  { key: 'fruits', label: 'Fruits', icon: '🍎' },
  { key: 'grains', label: 'Grains', icon: '🌾' },
];

const FoodEntryScreen = ({ navigation }: { navigation: any }) => {
  const [searchText, setSearchText] = useState('');
  const [allFoods, setAllFoods] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0].label);
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>([]);
  const [todaysFoods, setTodaysFoods] = useState<string[]>([]);

  useEffect(() => {
    const loadFoods = async () => {
      const reverseMapStr = await AsyncStorage.getItem(REVERSE_MAP_KEY);
      if (reverseMapStr) {
        const reverseMap = JSON.parse(reverseMapStr);
        setAllFoods(Object.keys(reverseMap));
      }
      // Load today's foods
      const today = new Date().toISOString().slice(0, 10);
      const entriesStr = await AsyncStorage.getItem('foodEntries');
      if (entriesStr) {
        const entries = JSON.parse(entriesStr);
        setTodaysFoods(entries[today] || []);
      } else {
        setTodaysFoods([]);
      }
    };
    loadFoods();
  }, []);

  useEffect(() => {
    setResults(searchFoods(searchText, allFoods));
  }, [searchText, allFoods]);

  useEffect(() => {
    const fetchFavorite = async () => {
      // Map UI label to key in foodMap
      let key = selectedCategory.charAt(0).toLowerCase() + selectedCategory.slice(1).replace(/ /g, '');
      if (key === 'otherVeggies') key = 'otherVeggies';
      if (key === 'greens') key = 'greens';
      if (key === 'legumes') key = 'legumes';
      if (key === 'nuts') key = 'nuts';
      if (key === 'fruits') key = 'fruits';
      if (key === 'grains') key = 'grains';
      const favs = await computeFavorite(key);
      setFavoriteFoods(favs);
    };
    fetchFavorite();
  }, [selectedCategory]);

  const refreshTodaysFoods = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const entriesStr = await AsyncStorage.getItem('foodEntries');
    if (entriesStr) {
      const entries = JSON.parse(entriesStr);
      setTodaysFoods(entries[today] || []);
    } else {
      setTodaysFoods([]);
    }
  };

  const handleSelectFood = async (food: string) => {
    if (todaysFoods.includes(food)) {
      setFeedback('item added already');
      setTimeout(() => setFeedback(''), 1200);
      return;
    }
    await addFoodEntryForToday(food);
    setFeedback(`${food} added for today!`);
    setSearchText('');
    setTimeout(() => setFeedback(''), 1200);
    refreshTodaysFoods();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
      <Image source={require('../assets/cat3.png')} style={styles.catImage} />
      <Text style={styles.title}>Add Your Plants</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search food..."
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={setSearchText}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {results.length > 0 && (
        <View style={styles.dropdown}>
          {results.map(food => (
            <TouchableOpacity key={food} style={styles.dropdownItem} onPress={() => handleSelectFood(food)}>
              <Text style={styles.dropdownText}>{food}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {feedback ? <Text style={{ color: '#2e7d32', marginBottom: 8 }}>{feedback}</Text> : null}
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat.label} style={[styles.categoryTile, selectedCategory === cat.label && { borderColor: '#2e7d32', borderWidth: 3 }]} onPress={() => setSelectedCategory(cat.label)}>
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent / Favorite Foods</Text>
        <View style={styles.recentRow}>
          {favoriteFoods.map(food => (
            <TouchableOpacity
              key={food}
              style={[styles.recentTile, todaysFoods.includes(food) && { opacity: 0.5 }]}
              onPress={() => handleSelectFood(food)}
              disabled={todaysFoods.includes(food)}
            >
              <Text style={styles.recentText}>{food}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddCustomFoodScreen')}>
        <Text style={styles.addButtonText}>+ Add Custom Food</Text>
      </TouchableOpacity>

      {/* Spacer for more space between Add Custom Food and Today's Foods */}
      <View style={{ height: 28 }} />

      {/* Today's Foods Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Foods</Text>
        {todaysFoods.length === 0 ? (
          <Text style={{ color: '#888', marginTop: 8 }}>No foods added today.</Text>
        ) : (
          todaysFoods.map(food => (
            <View key={food} style={styles.todaysFoodRow}>
              <Text style={styles.todaysFoodText}>{food}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={async () => {
                  await deleteFoodEntryForToday(food);
                  refreshTodaysFoods();
                }}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: '#f7f6f2', paddingTop: 30, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', marginLeft: 20, marginBottom: 10, backgroundColor: '#b2e7b7', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 18 },
  backButtonText: { color: '#2e7d32', fontSize: 16, fontWeight: 'bold' },
  catImage: { width: 100, height: 100, marginBottom: 10, borderRadius: 50, borderWidth: 3, borderColor: '#e0c3a3' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#6c4f3d', marginBottom: 18, fontFamily: 'Avenir-Heavy' },
  searchBar: { width: 300, height: 44, borderColor: '#e0c3a3', borderWidth: 2, borderRadius: 22, paddingHorizontal: 18, marginBottom: 8, backgroundColor: '#fff', fontSize: 18 },
  dropdown: { width: 300, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#e0c3a3', maxHeight: 180 },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownText: { fontSize: 16, color: '#6c4f3d' },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 18 },
  categoryTile: { width: 90, height: 90, backgroundColor: '#fff', borderRadius: 18, alignItems: 'center', justifyContent: 'center', margin: 6, borderWidth: 2, borderColor: '#f7b2d9', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  categoryIcon: { fontSize: 32, marginBottom: 4 },
  categoryLabel: { fontSize: 14, color: '#a67c52', fontWeight: 'bold', textAlign: 'center' },
  section: { width: 320, marginBottom: 18 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#6c4f3d', marginBottom: 8, fontFamily: 'Avenir-Heavy' },
  recentRow: { flexDirection: 'row', justifyContent: 'space-between' },
  recentTile: { backgroundColor: '#ffe066', borderRadius: 14, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8 },
  recentText: { fontSize: 16, color: '#6c4f3d', fontWeight: 'bold' },
  addButton: { backgroundColor: '#f7b2d9', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 40, marginTop: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  todaysFoodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 18, marginBottom: 8, borderWidth: 1, borderColor: '#e0c3a3' },
  todaysFoodText: { fontSize: 16, color: '#6c4f3d', fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#f44336', borderRadius: 10, paddingVertical: 4, paddingHorizontal: 14, marginLeft: 12 },
  deleteButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

export default FoodEntryScreen; 