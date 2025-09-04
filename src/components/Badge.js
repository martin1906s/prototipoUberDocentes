import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../theme/theme';

export default function Badge({ 
  text, 
  variant = 'default', 
  size = 'md',
  style 
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: colors.success,
          color: colors.white,
        };
      case 'warning':
        return {
          backgroundColor: colors.warning,
          color: colors.white,
        };
      case 'danger':
        return {
          backgroundColor: colors.danger,
          color: colors.white,
        };
      case 'info':
        return {
          backgroundColor: colors.info,
          color: colors.white,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
          borderWidth: 1,
          borderColor: colors.primary,
        };
      default:
        return {
          backgroundColor: colors.neutral200,
          color: colors.neutral700,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: spacing.xs,
          paddingVertical: 2,
          fontSize: 10,
        };
      case 'lg':
        return {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          fontSize: 14,
        };
      default:
        return {
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          fontSize: 12,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor: variantStyles.backgroundColor,
        borderColor: variantStyles.borderColor,
        borderWidth: variantStyles.borderWidth || 0,
        paddingHorizontal: sizeStyles.paddingHorizontal,
        paddingVertical: sizeStyles.paddingVertical,
        borderRadius: radii.pill,
      },
      style
    ]}>
      <Text style={[
        styles.text,
        {
          color: variantStyles.color,
          fontSize: sizeStyles.fontSize,
          fontWeight: '600',
        }
      ]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
