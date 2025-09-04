import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getColors, spacing, radii, elevation, gradients } from '../theme/theme';
import AnimatedScale from './AnimatedScale';
import WebCompatibleLinearGradient from './WebCompatibleLinearGradient';

export default function BackButton({ 
  navigation, 
  onPress, 
  style, 
  iconColor, 
  backgroundColor,
  variant = 'glass',
  size = 'md',
  icon = 'arrow-back'
}) {
  const { isDarkMode } = useTheme();
  const themeColors = getColors(isDarkMode);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const dimensionBySize = { sm: 36, md: 44, lg: 52 };
  const iconSizeBySize = { sm: 18, md: 22, lg: 24 };
  const dimension = dimensionBySize[size] || 44;
  const iconSize = iconSizeBySize[size] || 22;

  const isGlass = variant === 'glass';
  const isOutline = variant === 'outline';
  const isSolid = variant === 'solid';
  const isPrimary = variant === 'primary';

  const resolvedBg = (() => {
    if (backgroundColor) return backgroundColor;
    if (isGlass) return themeColors.glass;
    if (isOutline) return 'transparent';
    if (isPrimary) return themeColors.primary;
    return themeColors.cardBg;
  })();

  const resolvedBorder = (() => {
    if (isOutline) return themeColors.glassBorder;
    if (isPrimary || isSolid) return 'transparent';
    return themeColors.glassBorder;
  })();

  const resolvedIcon = iconColor || (isPrimary ? themeColors.white : themeColors.neutral800);

  const buttonBase = {
    width: dimension,
    height: dimension,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: isOutline ? 1 : 1,
    borderColor: resolvedBorder,
    backgroundColor: resolvedBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
    backdropFilter: isGlass && Platform.OS === 'web' ? 'blur(8px)' : undefined,
  };

  return (
    <View style={[styles.container, style]}>
      <AnimatedScale onPress={handlePress} style={styles.hitSlopFix}>
        <WebCompatibleLinearGradient
          colors={isPrimary ? gradients.primary : ['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: isPrimary ? 2 : 0,
            borderRadius: radii.pill,
          }}
        >
          <View
            style={buttonBase}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <MaterialIcons 
              name={icon}
              size={iconSize}
              color={resolvedIcon}
            />
          </View>
        </WebCompatibleLinearGradient>
      </AnimatedScale>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    zIndex: 1000,
  },
  hitSlopFix: {
  },
});
