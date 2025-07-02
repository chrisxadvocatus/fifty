import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial food category map
export const initialFoodMap = {
  greens: {
    spinach: {},
    broccoli: {},
  },
  otherVeggies: {
    yellowPeppers: {},
    redPeppers: {},
  },
  legumes: {
    chickpeas: {},
  },
  nuts: {
    macadamiaNuts: {},
    almonds: {},
    chiaSeeds: {},
  },
  fruits: {
    avocado: {},
    apple: {},
    pineapple: {},
    strawberry: {},
  },
  grains: {
    pintoBeans: {},
  },
  others: {
    greenTea: {},
  },
};

// Reverse lookup map
export const initialReverseMap = {
  spinach: 'greens',
  broccoli: 'greens',
  yellowPeppers: 'otherVeggies',
  redPeppers: 'otherVeggies',
  chickpeas: 'legumes',
  macadamiaNuts: 'nuts',
  almonds: 'nuts',
  chiaSeeds: 'nuts',
  avocado: 'fruits',
  apple: 'fruits',
  pineapple: 'fruits',
  strawberry: 'fruits',
  pintoBeans: 'grains',
  greenTea: 'others',
};

// Empty daily entries map
export const initialFoodEntries = {};

// Keys for AsyncStorage
const FOOD_MAP_KEY = 'foodMap';
const REVERSE_MAP_KEY = 'foodReverseMap';
const FOOD_ENTRIES_KEY = 'foodEntries';

// Initialize storage with initial data if not present
export const initializeFoodStorage = async () => {
  const foodMap = await AsyncStorage.getItem(FOOD_MAP_KEY);
  if (!foodMap) {
    await AsyncStorage.setItem(FOOD_MAP_KEY, JSON.stringify(initialFoodMap));
  }
  const reverseMap = await AsyncStorage.getItem(REVERSE_MAP_KEY);
  if (!reverseMap) {
    await AsyncStorage.setItem(REVERSE_MAP_KEY, JSON.stringify(initialReverseMap));
  }
  const foodEntries = await AsyncStorage.getItem(FOOD_ENTRIES_KEY);
  if (!foodEntries) {
    await AsyncStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(initialFoodEntries));
  }
};

// Export keys for use in other services/screens
export { FOOD_MAP_KEY, REVERSE_MAP_KEY, FOOD_ENTRIES_KEY };

// Add a food entry for today
export const addFoodEntryForToday = async (food: string) => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const entriesStr = await AsyncStorage.getItem(FOOD_ENTRIES_KEY);
  let entries = entriesStr ? JSON.parse(entriesStr) : {};
  if (!entries[today]) {
    entries[today] = [];
  }
  if (!entries[today].includes(food)) {
    entries[today].push(food);
    await AsyncStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(entries));
  }
};

// Get the count of today's food entries
export const getTodaysFoodEntryCount = async (): Promise<number> => {
  const today = new Date().toISOString().slice(0, 10);
  const entriesStr = await AsyncStorage.getItem(FOOD_ENTRIES_KEY);
  if (!entriesStr) return 0;
  const entries = JSON.parse(entriesStr);
  return entries[today]?.length || 0;
};

// Compute favorite foods for a category (for now, random up to 3 from the category)
export const computeFavorite = async (category: string): Promise<string[]> => {
  // In the future, this can use real usage data
  const foodMapStr = await AsyncStorage.getItem(FOOD_MAP_KEY);
  const foodMap = foodMapStr ? JSON.parse(foodMapStr) : initialFoodMap;
  const foods = Object.keys(foodMap[category] || {});
  if (foods.length <= 3) return foods;
  // Shuffle and pick 3
  for (let i = foods.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [foods[i], foods[j]] = [foods[j], foods[i]];
  }
  return foods.slice(0, 3);
}; 