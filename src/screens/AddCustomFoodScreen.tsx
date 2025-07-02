import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
// If not installed, run: npm install @react-native-picker/picker
import { Picker } from '@react-native-picker/picker';
import { categories } from './FoodEntryScreen';

const AddCustomFoodScreen = ({ navigation }: { navigation: any }) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].label);
  const [foodName, setFoodName] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Image source={require('../assets/cat2.png')} style={styles.catImage} />
      <Text style={styles.title}>Add Custom Food</Text>
      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={(itemValue: string) => setSelectedCategory(itemValue)}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat.label} label={cat.label} value={cat.label} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Food Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter food name"
        placeholderTextColor="#aaa"
        value={foodName}
        onChangeText={setFoodName}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.goBack()}>
        <Text style={styles.addButtonText}>Add Food</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#f7f6f2', paddingTop: 30 },
  backButton: { alignSelf: 'flex-start', marginLeft: 20, marginBottom: 10, backgroundColor: '#b2e7b7', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 18 },
  backButtonText: { color: '#2e7d32', fontSize: 16, fontWeight: 'bold' },
  catImage: { width: 100, height: 100, marginBottom: 10, borderRadius: 50, borderWidth: 3, borderColor: '#e0c3a3' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#6c4f3d', marginBottom: 18, fontFamily: 'Avenir-Heavy' },
  label: { fontSize: 16, color: '#6c4f3d', marginTop: 18, marginBottom: 6, alignSelf: 'flex-start', marginLeft: 40 },
  pickerWrapper: { width: 300, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e0c3a3', marginBottom: 10 },
  picker: { width: 300, height: 44 },
  input: { width: 300, height: 44, borderColor: '#e0c3a3', borderWidth: 2, borderRadius: 22, paddingHorizontal: 18, marginBottom: 18, backgroundColor: '#fff', fontSize: 18 },
  addButton: { backgroundColor: '#f7b2d9', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 40, marginTop: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default AddCustomFoodScreen; 