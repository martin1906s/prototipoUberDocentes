import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Platform } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';

import { getColors, colors, radii, spacing, typography, elevation } from '../../theme/theme';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/store';
import { useTheme } from '../../context/ThemeContext';
import WebCompatibleLinearGradient from '../../components/WebCompatibleLinearGradient';

const { width } = Dimensions.get('window');

export default function RoleSelectScreen({ navigation }) {
  const { state, actions } = useStore();
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [selectedRole, setSelectedRole] = useState(null);
  const [scaleAnimations] = useState({
    usuario: new Animated.Value(1),
    docente: new Animated.Value(1),
    admin: new Animated.Value(1),
  });

  const handleSelect = (role) => {
    // Animación de selección
    setSelectedRole(role);
    Animated.sequence([
      Animated.timing(scaleAnimations[role], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(scaleAnimations[role], {
        toValue: 1,
        duration: 100,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    // Navegación con delay para mostrar la animación
    setTimeout(() => {
      actions.setRole(role);
      if (role === 'usuario') {
        navigation.replace('UserTabs');
      } else if (role === 'docente') {
        // Si no hay datos del docente, redirigir al registro
        if (!state.teacherProfile) {
          navigation.replace('TeacherSetup');
        } else {
          navigation.replace('TeacherTabs');
        }
      } else if (role === 'admin') {
        navigation.replace('AdminTabs');
      }
    }, 200);
  };

  const RoleCard = ({ role, title, icon, color, gradient, onPress }) => (
    <Animated.View style={[
      styles.roleCardContainer,
      { transform: [{ scale: scaleAnimations[role] }] }
    ]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <WebCompatibleLinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.roleCard,
            selectedRole === role && styles.roleCardSelected
          ]}
        >
          <View style={styles.roleCardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={28} color="white" />
            </View>
            <Text style={styles.roleTitle}>{title}</Text>
            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </View>
          </View>
        </WebCompatibleLinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <GradientBackground variant="white" theme="roleSelect">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Ionicons name="school" size={36} color={colors.themes.roleSelect.primary} />
            </View>
            <View style={styles.logoAccent}>
              <Ionicons name="sparkles" size={16} color="white" />
            </View>
          </View>
          <Text style={styles.appTitle}>Contrata Docentes</Text>
          <Text style={styles.appSubtitle}>
            Conecta con los mejores profesionales de la educación
          </Text>
          <View style={styles.headerDivider} />
        </View>

        <View style={styles.rolesContainer}>
          <Text style={styles.sectionTitle}>Selecciona tu rol</Text>
          
          <RoleCard
            role="usuario"
            title="Usuario"
            icon="search"
            color={colors.themes.roleSelect.primary}
            gradient={['#0891B2', '#06B6D4']}
            onPress={() => handleSelect('usuario')}
          />
          
          <RoleCard
            role="docente"
            title="Docente"
            icon="person"
            color={colors.themes.roleSelect.secondary}
            gradient={['#7C3AED', '#8B5CF6']}
            onPress={() => handleSelect('docente')}
          />
          
          <RoleCard
            role="admin"
            title="Administrador"
            icon="settings"
            color={colors.themes.roleSelect.accent}
            gradient={['#DB2777', '#EC4899']}
            onPress={() => handleSelect('admin')}
          />
        </View>


      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.md,
  },
  logoAccent: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: colors.themes.roleSelect.accent,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.sm,
  },
  appTitle: {
    ...typography.title,
    color: colors.themes.roleSelect.primary,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    ...typography.body,
    color: colors.themes.roleSelect.textSecondary,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    maxWidth: width * 0.85,
    marginBottom: spacing.md,
  },
  headerDivider: {
    width: 50,
    height: 3,
    backgroundColor: colors.themes.roleSelect.primary,
    borderRadius: 2,
    opacity: 0.3,
  },
  rolesContainer: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.themes.roleSelect.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  roleCardContainer: {
    marginBottom: spacing.lg,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...elevation.md,
  },
  roleCard: {
    padding: spacing.lg,
    minHeight: 80,
    position: 'relative',
  },
  roleCardSelected: {
    transform: [{ scale: 1.02 }],
  },
  roleCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  roleTitle: {
    ...typography.subtitle,
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

});