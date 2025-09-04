import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
// import OptionsMenu from '../../components/OptionsMenu';
import BackButton from '../../components/BackButton';
import { useStore } from '../../store/store';
import { spacing, colors, typography, radii } from '../../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function UserRegisterScreen({ route, navigation }) {
  const { state, actions } = useStore();
  const { teacherId } = route.params || {};
  const teacher = state.teachers.find((t) => t.id === teacherId);

  const [nombre, setNombre] = useState(state.userProfile?.nombre || '');
  const [email, setEmail] = useState(state.userProfile?.email || '');
  const [telefono, setTelefono] = useState(state.userProfile?.telefono || '');
  const [direccion, setDireccion] = useState(state.userProfile?.direccion || '');
  const [mensaje, setMensaje] = useState('Hola, me interesa contratarte.');

  const handleAuto = () => {
    setNombre('Carla Fernández');
    setEmail('carla.fernandez@example.com');
    setTelefono('+593 98 765 4321');
    setDireccion('Av. Amazonas 123, Quito, Ecuador');
    setMensaje('Hola, quisiera clases dos veces por semana.');
  };

  const handleSubmit = () => {
    if (!nombre || !email || !telefono || !direccion) {
      Alert.alert('Completa tus datos', 'Nombre, email, teléfono y dirección son obligatorios.');
      return;
    }
    
    // Guardar perfil del usuario
    actions.saveUserProfile({ nombre, email, telefono, direccion });
    
    // Navegar a la pantalla de selección de horarios
    navigation.navigate('UserTeacherDetail', { 
      teacherId,
      fromRegister: true // Flag para indicar que viene del registro
    });
  };

  if (!teacher) {
    return (
      <GradientBackground>
        <View style={{ height: spacing.xl }} />
        <Text style={{ color: overlay.textOnDarkPrimary }}>No se encontró el docente.</Text>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground variant="white" theme="userSearch">
      <BackButton navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeEmoji}>📝</Text>
              <Text style={styles.welcomeText}>Contratar Docente</Text>
            </View>
          </View>
        </View>

        <View style={styles.teacherCard}>
          <View style={styles.teacherHeader}>
            <View style={styles.teacherAvatar}>
              <Text style={styles.teacherAvatarText}>{teacher.nombre.charAt(0)}</Text>
            </View>
            <View style={styles.teacherInfo}>
              <Text style={styles.teacherName}>{teacher.nombre}</Text>
              <Text style={styles.teacherSubject}>{teacher.especialidades.join(', ')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>📋 Información de Contacto</Text>
          
          <AppInput 
            placeholder="Tu nombre completo" 
            value={nombre} 
            onChangeText={setNombre}
            leftIcon="person"
          />
          <View style={{ height: spacing.md }} />
          
          <AppInput 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address"
            leftIcon="email"
          />
          <View style={{ height: spacing.md }} />
          
          <AppInput 
            placeholder="Teléfono" 
            value={telefono} 
            onChangeText={setTelefono} 
            keyboardType="phone-pad"
            leftIcon="phone"
          />
          <View style={{ height: spacing.md }} />
          
          <AppInput 
            placeholder="Dirección" 
            value={direccion} 
            onChangeText={setDireccion}
            leftIcon="location-on"
          />
          <View style={{ height: spacing.md }} />
          
          <AppInput 
            placeholder="Mensaje personalizado" 
            value={mensaje} 
            onChangeText={setMensaje} 
            multiline
            leftIcon="message"
          />
          
          <View style={styles.buttonContainer}>
            <AppButton 
              leftIcon="autorenew" 
              variant="secondary" 
              onPress={handleAuto}
              style={styles.autoButton}
            />
            <AppButton 
              leftIcon="send" 
              variant="success" 
              onPress={handleSubmit}
              style={styles.submitButton}
            />
          </View>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
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
  welcomeEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  welcomeText: {
    ...typography.title,
    color: colors.themes.userSearch.text,
    fontSize: 20,
    fontWeight: '700',
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.themes.userSearch.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.themes.userSearch.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  roleButtonText: {
    color: colors.themes.userSearch.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
    fontSize: 14,
  },
  teacherCard: {
    backgroundColor: colors.themes.userSearch.card,
    padding: spacing.lg,
    borderRadius: radii.xl,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  teacherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.themes.userSearch.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  teacherAvatarText: {
    ...typography.title,
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    ...typography.subtitle,
    color: colors.themes.userSearch.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  teacherSubject: {
    ...typography.bodySmall,
    color: colors.themes.userSearch.textSecondary,
    fontSize: 14,
  },
  formCard: {
    backgroundColor: colors.themes.userSearch.card,
    padding: spacing.lg,
    borderRadius: radii.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  formTitle: {
    ...typography.subtitle,
    color: colors.themes.userSearch.text,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  autoButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});


