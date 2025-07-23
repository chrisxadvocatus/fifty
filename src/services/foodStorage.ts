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
const LAST_CARB_DATE_KEY = 'lastCarbDate'; // NEW

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
export { FOOD_MAP_KEY, REVERSE_MAP_KEY, FOOD_ENTRIES_KEY, LAST_CARB_DATE_KEY };

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

// Delete a food entry for today
export const deleteFoodEntryForToday = async (food: string) => {
  const today = new Date().toISOString().slice(0, 10);
  const entriesStr = await AsyncStorage.getItem(FOOD_ENTRIES_KEY);
  let entries = entriesStr ? JSON.parse(entriesStr) : {};
  if (entries[today]) {
    entries[today] = entries[today].filter((item: string) => item !== food);
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

// Get the count of unique food entries for the last 7 days
export const getLast7DaysFoodEntryCount = async (): Promise<number> => {
  const entriesStr = await AsyncStorage.getItem(FOOD_ENTRIES_KEY);
  if (!entriesStr) return 0;
  const entries = JSON.parse(entriesStr);
  const today = new Date();
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    last7Days.push(d.toISOString().slice(0, 10));
  }
  const foodsSet = new Set();
  for (const day of last7Days) {
    if (entries[day]) {
      for (const food of entries[day]) {
        foodsSet.add(food);
      }
    }
  }
  return foodsSet.size;
};

// Get the unique list of food entries for the last 7 days
export const getLast7DaysFoods = async (): Promise<string[]> => {
  const entriesStr = await AsyncStorage.getItem(FOOD_ENTRIES_KEY);
  if (!entriesStr) return [];
  const entries = JSON.parse(entriesStr);
  const today = new Date();
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    last7Days.push(d.toISOString().slice(0, 10));
  }
  const foodsSet = new Set();
  for (const day of last7Days) {
    if (entries[day]) {
      for (const food of entries[day]) {
        foodsSet.add(food);
      }
    }
  }
  return Array.from(foodsSet) as string[];
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

// --- Carb Streak Logic ---

// Get the number of days since last carb (streak)
export const getCarbStreak = async (): Promise<number> => {
  const lastCarbDateStr = await AsyncStorage.getItem(LAST_CARB_DATE_KEY);
  if (!lastCarbDateStr) return 0;
  const lastCarbDate = new Date(lastCarbDateStr);
  const today = new Date();
  // Zero out time for both dates
  lastCarbDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  const diff = today.getTime() - lastCarbDate.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days;
};

// Reset the carb streak (set lastCarbDate to today)
export const resetCarbStreak = async () => {
  const today = new Date();
  today.setHours(0,0,0,0);
  await AsyncStorage.setItem(LAST_CARB_DATE_KEY, today.toISOString());
}; 