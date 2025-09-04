import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import WebCompatibleLinearGradient from '../../components/WebCompatibleLinearGradient';
import WebCompatibleBlurView from '../../components/WebCompatibleBlurView';
import GradientBackground from '../../components/GradientBackground';
import AppCard from '../../components/AppCard';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import Avatar from '../../components/Avatar';


import OptionsMenu from '../../components/OptionsMenu';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/store';
import { spacing, colors, typography, radii, elevation } from '../../theme/theme';

export default function UserProfileScreen({ navigation }) {
  const { state, actions } = useStore();
  const [nombre, setNombre] = useState(state.userProfile?.nombre || '');
  const [email, setEmail] = useState(state.userProfile?.email || '');
  const [telefono, setTelefono] = useState(state.userProfile?.telefono || '');
  const [direccion, setDireccion] = useState(state.userProfile?.direccion || '');
  const [isEditing, setIsEditing] = useState(false);

  // Actualizar estados cuando cambie el userProfile en el store
  React.useEffect(() => {
    if (state.userProfile) {
      setNombre(state.userProfile.nombre || '');
      setEmail(state.userProfile.email || '');
      setTelefono(state.userProfile.telefono || '');
      setDireccion(state.userProfile.direccion || '');
    }
  }, [state.userProfile]);

  const handleSave = () => {
    actions.saveUserProfile({ nombre, email, telefono, direccion });
    setIsEditing(false);
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIconBox}>
        <MaterialIcons name={icon} size={18} color={colors.themes.userProfile.primary} />
      </View>
      <View style={styles.infoTextBox}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );

  return (
    <GradientBackground variant="white" theme="userProfile">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header con gradiente */}
        <WebCompatibleLinearGradient
          colors={[colors.themes.userProfile.primary, colors.themes.userProfile.secondary]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Mi Perfil</Text>
              </View>
              <OptionsMenu navigation={navigation} theme="userProfile" />
            </View>
          </View>
        </WebCompatibleLinearGradient>

        {/* Avatar moderno */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <WebCompatibleLinearGradient
              colors={[colors.themes.userProfile.primary, colors.themes.userProfile.accent]}
              style={styles.avatarGradient}
            >
              <Avatar 
                name={nombre || 'Usuario'} 
                size="xl" 
                color="transparent"
                style={styles.avatar}
              />
            </WebCompatibleLinearGradient>
            <View style={styles.avatarBadge}>
              <Ionicons name="check" size={16} color={colors.white} />
            </View>
          </View>
          <Text style={styles.profileTitle}>{nombre || 'Usuario'}</Text>
          <Text style={styles.profileSubtitle}>Cuenta personal</Text>
        </View>

        {/* Información personal */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Información personal</Text>
            {!isEditing && (
              <AppButton
                title="Editar"
                variant="outline"
                size="sm"
                leftIcon="edit"
                onPress={() => setIsEditing(true)}
              />
            )}
          </View>

          <View style={styles.glassCard}>
            <WebCompatibleBlurView intensity={20} tint="light" style={styles.blurContainer}>
              {!isEditing ? (
                <View style={styles.infoRows}>
                  <InfoRow icon="person" label="Nombre" value={nombre} />
                  <InfoRow icon="email" label="Email" value={email} />
                  <InfoRow icon="phone" label="Teléfono" value={telefono} />
                  <InfoRow icon="location-on" label="Dirección" value={direccion} />
                </View>
              ) : (
                <View style={styles.editModeContainer}>
                  <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Nombre completo</Text>
                      <AppInput 
                        placeholder="Ingresa tu nombre completo" 
                        value={nombre} 
                        onChangeText={setNombre}
                        leftIcon="person"
                        editable={isEditing}
                        style={styles.editInput}
                      />
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Email</Text>
                      <AppInput 
                        placeholder="tu@email.com" 
                        value={email} 
                        onChangeText={setEmail} 
                        keyboardType="email-address"
                        leftIcon="email"
                        editable={isEditing}
                        style={styles.editInput}
                      />
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Teléfono</Text>
                      <AppInput 
                        placeholder="+1 234 567 8900" 
                        value={telefono} 
                        onChangeText={setTelefono} 
                        keyboardType="phone-pad"
                        leftIcon="phone"
                        editable={isEditing}
                        style={styles.editInput}
                      />
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Dirección</Text>
                      <AppInput 
                        placeholder="Ciudad, País" 
                        value={direccion} 
                        onChangeText={setDireccion}
                        leftIcon="location-on"
                        editable={isEditing}
                        style={styles.editInput}
                      />
                    </View>
                  </View>
                  
                  <View style={styles.editActionsBottom}>
                    <AppButton
                      title="Cancelar"
                      variant="outline"
                      size="md"
                      leftIcon="close"
                      onPress={() => setIsEditing(false)}
                      style={styles.cancelButton}
                    />
                    <AppButton 
                      title="Guardar cambios"
                      leftIcon="save" 
                      onPress={handleSave}
                      variant="success"
                      size="md"
                      style={styles.saveButton}
                    />
                  </View>
                </View>
              )}
            </WebCompatibleBlurView>
          </View>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    ...typography.title,
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    ...elevation.sm,
  },
  profileTitle: {
    ...typography.title,
    color: colors.themes.userProfile.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  profileSubtitle: {
    ...typography.bodySmall,
    color: colors.themes.userProfile.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  infoSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.themes.userProfile.text,
    fontWeight: '700',
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  glassCard: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...elevation.md,
  },
  blurContainer: {
    padding: spacing.xl,
  },
  infoRows: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.themes.userProfile.card,
    borderWidth: 1,
    borderColor: colors.themes.userProfile.textSecondary + '22',
    padding: spacing.md,
    borderRadius: radii.lg,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.themes.userProfile.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  infoTextBox: {
    flex: 1,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.themes.userProfile.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    ...typography.body,
    color: colors.themes.userProfile.text,
    fontWeight: '600',
  },
  formSection: {
    gap: spacing.lg,
  },
  editModeContainer: {
    gap: spacing.xl,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  inputLabel: {
    ...typography.label,
    color: colors.themes.userProfile.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  editInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.themes.userProfile.textSecondary + '30',
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.themes.userProfile.text,
  },
  editActionsBottom: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.themes.userProfile.textSecondary + '20',
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});
