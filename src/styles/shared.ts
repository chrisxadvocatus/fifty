import { StyleSheet } from 'react-native';

export const colors = {
  background: '#f7f6f2',
  primary: '#f7b2d9',
  accent: '#b2e7b7',
  border: '#e0c3a3',
  text: '#6c4f3d',
  box: '#fff',
  warning: '#e57373',
  highlight: '#ffe066',
  buttonText: '#fff',
  buttonGreen: '#2e7d32',
  buttonPink: '#f7b2d9',
};

export const fonts = {
  main: 'Avenir-Heavy', // Replace with manga font if available
};

export const baseContainer = {
  flex: 1,
  alignItems: 'center' as const,
  backgroundColor: colors.background,
};

export const baseButton = {
  borderRadius: 20,
  paddingVertical: 14,
  paddingHorizontal: 40,
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

export const sharedStyles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 24,
    color: colors.text,
    fontFamily: fonts.main,
  },
  boxTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#a67c52',
    marginBottom: 8,
    fontFamily: fonts.main,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  error: {
    color: colors.warning,
    marginBottom: 10,
    fontSize: 16,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000', // Always black
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
}); 