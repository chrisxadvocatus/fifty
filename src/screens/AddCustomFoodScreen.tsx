import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { categories } from './FoodEntryScreen';

const AddCustomFoodScreen = ({ navigation }: { navigation: any }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [foodName, setFoodName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel = selectedCategory ? categories.find(cat => cat.key === selectedCategory)?.label : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Image source={require('../assets/cat2.png')} style={styles.catImage} />
      <Text style={styles.title}>Add Custom Food</Text>
      <Text style={styles.label}>Category</Text>
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
        <Text style={selectedLabel ? styles.inputText : styles.inputPlaceholder}>
          {selectedLabel ? selectedLabel : 'Select category'}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView style={{ maxHeight: 260 }}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.key}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedCategory(cat.key);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{cat.icon} {cat.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  input: { width: 300, height: 44, borderColor: '#e0c3a3', borderWidth: 2, borderRadius: 22, paddingHorizontal: 18, marginBottom: 18, backgroundColor: '#fff', fontSize: 18, justifyContent: 'center' },
  inputText: { fontSize: 18, color: '#6c4f3d' },
  inputPlaceholder: { fontSize: 18, color: '#aaa' },
  addButton: { backgroundColor: '#f7b2d9', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 40, marginTop: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 320, backgroundColor: '#fff', borderRadius: 16, padding: 20, maxHeight: 340, alignItems: 'stretch' },
  modalItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: 18, color: '#6c4f3d' },
  modalCancel: { color: '#f00', fontSize: 16, textAlign: 'center', marginTop: 16 },
});

export default AddCustomFoodScreen; 