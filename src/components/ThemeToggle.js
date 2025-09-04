import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../theme/theme';
import { spacing, radii, elevation } from '../theme/theme';

export default function ThemeToggle({ style, showText = false }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const colors = getColors(isDarkMode);

  return (
    <TouchableOpacity 
      style={[
        styles.toggleButton,
        { 
          backgroundColor: colors.themes.roleSelect.card,
          borderColor: colors.themes.roleSelect.primary,
        },
        style
      ]}
      onPress={toggleTheme}
    >
      <MaterialIcons 
        name={isDarkMode ? "light-mode" : "dark-mode"} 
        size={20} 
        color={colors.themes.roleSelect.primary} 
      />
      {showText && (
        <Text style={[styles.toggleText, { color: colors.themes.roleSelect.primary }]}>
          {isDarkMode ? 'Claro' : 'Oscuro'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    // Web-compatible shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  toggleText: {
    marginLeft: spacing.xs,
    fontSize: 12,
    fontWeight: '600',
  },
});
