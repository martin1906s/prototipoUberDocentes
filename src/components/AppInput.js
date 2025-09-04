import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, radii, spacing, overlay, typography, elevation } from '../theme/theme';

export default function AppInput({ 
  leftIcon, 
  rightIcon,
  label,
  error,
  variant = 'glass',
  size = 'md',
  style, 
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(props.secureTextEntry);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
          fontSize: 14,
        };
      case 'lg':
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          fontSize: 18,
        };
      default:
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          fontSize: 16,
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'solid':
        return {
          backgroundColor: colors.white,
          borderColor: isFocused ? colors.primary : colors.neutral200,
          borderWidth: 2,
        };
      case 'glass':
      default:
        return {
          backgroundColor: overlay.surfaceDark,
          borderColor: isFocused ? overlay.glassHighlight : overlay.glassBorder,
          borderWidth: 1,
          ...elevation.xs,
        };
    }
  };

  const getTextColor = () => {
    return variant === 'glass' ? overlay.textOnDarkPrimary : colors.neutral900;
  };

  const getPlaceholderColor = () => {
    return variant === 'glass' ? overlay.textOnDarkSecondary : colors.neutral500;
  };

  const handleToggleSecure = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={style}>
      {label && (
        <Text style={{
          ...typography.bodySmall,
          color: variant === 'glass' ? overlay.textOnDarkPrimary : colors.neutral700,
          marginBottom: spacing.xs,
          fontWeight: '600',
        }}>
          {label}
        </Text>
      )}
      
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: radii.pill,
          ...getSizeStyles(),
          ...getVariantStyles(),
        }}
      >
        {leftIcon && (
          <MaterialIcons 
            name={leftIcon} 
            size={20} 
            color={isFocused ? colors.primary : (variant === 'glass' ? overlay.textOnDarkPrimary : colors.neutral500)} 
            style={{ marginRight: spacing.sm }} 
          />
        )}
        
        <TextInput
          placeholderTextColor={getPlaceholderColor()}
          style={{
            flex: 1,
            color: getTextColor(),
            fontSize: getSizeStyles().fontSize,
            ...typography.body,
            textAlignVertical: props.multiline ? 'top' : 'center',
            minHeight: props.multiline ? 80 : undefined,
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          {...props}
        />
        
        {props.secureTextEntry && (
          <TouchableOpacity onPress={handleToggleSecure} style={{ marginLeft: spacing.sm }}>
            <MaterialIcons 
              name={isSecure ? 'visibility' : 'visibility-off'} 
              size={20} 
              color={variant === 'glass' ? overlay.textOnDarkPrimary : colors.neutral500} 
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !props.secureTextEntry && (
          <MaterialIcons 
            name={rightIcon} 
            size={20} 
            color={variant === 'glass' ? overlay.textOnDarkPrimary : colors.neutral500} 
            style={{ marginLeft: spacing.sm }} 
          />
        )}
      </View>
      
      {error && (
        <Text style={{
          ...typography.caption,
          color: colors.danger,
          marginTop: spacing.xs,
          marginLeft: spacing.sm,
        }}>
          {error}
        </Text>
      )}
    </View>
  );
}


