import React from 'react';
import { View } from 'react-native';
import WebCompatibleLinearGradient from './WebCompatibleLinearGradient';

export default function BarChart({ values = [40, 60, 30, 80, 50], height = 120 }) {
  const max = Math.max(...values, 1);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, gap: 8 }}>
      {values.map((v, i) => (
        <WebCompatibleLinearGradient
          key={i}
          colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.4)"]}
          style={{ width: 18, height: (v / max) * height, borderRadius: 10 }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      ))}
    </View>
  );
}


