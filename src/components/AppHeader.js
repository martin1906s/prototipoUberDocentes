import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, radii, overlay } from '../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function AppHeader({ title, subtitle, onChangeRolePress }) {
  return (
    <View style={{ paddingVertical: spacing.xl }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={[typography.display, { color: overlay.textOnDarkPrimary }]}>{title}</Text>
          {subtitle ? (
            <Text style={[typography.subtitle, { color: overlay.textOnDarkSecondary }]}>{subtitle}</Text>
          ) : null}
        </View>
        {onChangeRolePress ? (
          <TouchableOpacity onPress={onChangeRolePress} style={{ paddingHorizontal: 8, paddingVertical: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: overlay.surfaceDark, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.pill, borderWidth: 1, borderColor: overlay.glassBorder }}>
              <MaterialIcons name="switch-account" size={20} color={overlay.textOnDarkPrimary} />
              <Text style={{ color: overlay.textOnDarkPrimary, fontWeight: '700' }}>Cambiar rol</Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}


