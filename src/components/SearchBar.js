import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radii, overlay } from '../theme/theme';

export default function SearchBar({ placeholder, onSearch, onFilterPress }) {
  const [query, setQuery] = useState('');

  const handleSearch = (text) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={overlay.textOnDarkSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={overlay.textOnDarkSecondary}
          value={query}
          onChangeText={handleSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
            <MaterialIcons name="clear" size={18} color={overlay.textOnDarkSecondary} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
        <MaterialIcons name="tune" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: overlay.surfaceDark,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: overlay.glassBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: overlay.textOnDarkPrimary,
    fontSize: 16,
    paddingVertical: spacing.xs,
  },
  clearButton: {
    padding: spacing.xs,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: overlay.surfaceDark,
    borderWidth: 1.5,
    borderColor: overlay.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});