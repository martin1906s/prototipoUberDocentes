import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';

export default function DropdownList({ 
  options, 
  value, 
  onChange, 
  placeholder = "Seleccionar...",
  style 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option === value) || placeholder;

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.selectorText} numberOfLines={1}>
          {selectedOption}
        </Text>
        <MaterialIcons 
          name="keyboard-arrow-down" 
          size={20} 
          color={colors.themes.userSearch.text} 
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar opción</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <MaterialIcons name="close" size={24} color={colors.themes.userSearch.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item === value && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[
                    styles.optionText,
                    item === value && styles.selectedOptionText
                  ]}>
                    {item}
                  </Text>
                  {item === value && (
                    <MaterialIcons name="check" size={20} color={colors.themes.userSearch.primary} />
                  )}
                </TouchableOpacity>
              )}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(8, 145, 178, 0.2)',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  selectorText: {
    ...typography.body,
    color: colors.themes.userSearch.primary,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    width: '100%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 2,
    borderColor: 'rgba(8, 145, 178, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(8, 145, 178, 0.15)',
    backgroundColor: 'rgba(8, 145, 178, 0.05)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  modalTitle: {
    ...typography.subtitle,
    color: colors.themes.userSearch.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(8, 145, 178, 0.08)',
    marginHorizontal: spacing.sm,
    marginVertical: spacing.xs,
    borderRadius: 6,
  },
  selectedOption: {
    backgroundColor: 'rgba(8, 145, 178, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(8, 145, 178, 0.3)',
  },
  optionText: {
    ...typography.body,
    color: colors.themes.userSearch.text,
    fontSize: 13,
    flex: 1,
  },
  selectedOptionText: {
    color: colors.themes.userSearch.primary,
    fontWeight: '600',
  },
});
