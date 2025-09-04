import React from 'react';
import { View, Platform } from 'react-native';

// Importar LinearGradient solo en plataformas nativas
let LinearGradient;
if (Platform.OS !== 'web') {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
}

export default function WebCompatibleLinearGradient({ children, colors, start, end, style, ...props }) {
  // En web, usar un View con gradiente CSS
  if (Platform.OS === 'web') {
    const getGradientDirection = () => {
      if (!start || !end) return 'to bottom';
      
      const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
      return `${angle + 90}deg`;
    };

    return (
      <View 
        style={[
          {
            background: `linear-gradient(${getGradientDirection()}, ${colors.join(', ')})`,
          },
          style
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }

  // En móvil, usar LinearGradient nativo
  if (LinearGradient) {
    return (
      <LinearGradient 
        colors={colors} 
        start={start} 
        end={end} 
        style={style} 
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }

  // Fallback si LinearGradient no está disponible
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
}
