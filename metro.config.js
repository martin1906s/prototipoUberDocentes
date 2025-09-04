const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuración para web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configuración para resolver módulos nativos en web
config.resolver.alias = {
  ...config.resolver.alias,
  // Alias para módulos que no están disponibles en web
  'react-native-screens': 'react-native-screens/lib/commonjs',
};

// Configuración para transformar archivos
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;
