import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

export default function AnimatedScale({ children, onPress, style, scaleTo = 0.97 }) {
  const anim = useRef(new Animated.Value(1)).current;

  const animate = (to) => {
    Animated.spring(anim, { toValue: to, useNativeDriver: true, friction: 6 }).start();
  };

  return (
    <Pressable onPressIn={() => animate(scaleTo)} onPressOut={() => animate(1)} onPress={onPress} style={style}>
      <Animated.View style={{ transform: [{ scale: anim }] }}>{children}</Animated.View>
    </Pressable>
  );
}



