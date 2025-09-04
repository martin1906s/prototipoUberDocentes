import { Platform } from 'react-native';

// Detectar si estamos en Telegram WebView
export const isTelegramWebView = () => {
  if (Platform.OS !== 'web') return false;
  
  // Detectar Telegram WebView
  const userAgent = navigator.userAgent || '';
  return userAgent.includes('Telegram') || 
         userAgent.includes('TelegramBot') ||
         window.TelegramWebApp !== undefined;
};

// Detectar si estamos en cualquier WebView
export const isWebView = () => {
  if (Platform.OS !== 'web') return false;
  
  const userAgent = navigator.userAgent || '';
  return userAgent.includes('WebView') || 
         userAgent.includes('wv') ||
         isTelegramWebView();
};

// Detectar si estamos en un entorno restringido
export const isRestrictedEnvironment = () => {
  return Platform.OS === 'web' && (isWebView() || isTelegramWebView());
};

// Obtener el tipo de plataforma
export const getPlatformType = () => {
  if (Platform.OS === 'web') {
    if (isTelegramWebView()) return 'telegram';
    if (isWebView()) return 'webview';
    return 'web';
  }
  return Platform.OS;
};
