import React, { useRef } from 'react';
import { Animated, Pressable, Platform } from 'react-native';

export default function AnimatedScale({ children, onPress, style, scaleTo = 0.97 }) {
  const anim = useRef(new Animated.Value(1)).current;

  const animate = (to) => {
    // En web, no usar useNativeDriver para evitar errores
    const useNativeDriver = Platform.OS !== 'web';
    Animated.spring(anim, { 
      toValue: to, 
      useNativeDriver, 
      friction: 6 
    }).start();
  };

  return (
    <Pressable onPressIn={() => animate(scaleTo)} onPressOut={() => animate(1)} onPress={onPress} style={style}>
      <Animated.View style={{ transform: [{ scale: anim }] }}>{children}</Animated.View>
    </Pressable>
  );
}



