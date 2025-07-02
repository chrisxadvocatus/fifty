import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any>;

const Screen3: React.FC<Props> = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.text}>3</Text>
    <Button title="Go to Screen 1" onPress={() => navigation.navigate('Screen1')} />
    <Button title="Go to Screen 2" onPress={() => navigation.navigate('Screen2')} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 48, fontWeight: 'bold', marginBottom: 20 },
});

export default Screen3; 