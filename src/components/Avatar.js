import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme/theme';

export default function Avatar({ 
  name, 
  size = 'md', 
  color = colors.primary, 
  style,
  image 
}) {
  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return { width: 24, height: 24, fontSize: 10 };
      case 'sm':
        return { width: 32, height: 32, fontSize: 12 };
      case 'lg':
        return { width: 64, height: 64, fontSize: 24 };
      case 'xl':
        return { width: 80, height: 80, fontSize: 32 };
      default:
        return { width: 48, height: 48, fontSize: 18 };
    }
  };

  const sizeStyles = getSizeStyles();
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  return (
    <View style={[
      styles.avatar,
      {
        width: sizeStyles.width,
        height: sizeStyles.height,
        borderRadius: sizeStyles.width / 2,
        backgroundColor: color,
      },
      style
    ]}>
      <Text style={[
        styles.text,
        {
          fontSize: sizeStyles.fontSize,
          color: colors.white,
        }
      ]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
