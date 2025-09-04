import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Animated, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import WebCompatibleLinearGradient from '../../components/WebCompatibleLinearGradient';

import { MaterialIcons } from '@expo/vector-icons';
import { ChipGroup } from '../../components/Chips';
import StepIndicator from '../../components/StepIndicator';
import { useStore } from '../../store/store';
import { spacing, radii, colors, typography, elevation, animations } from '../../theme/theme';

const { width } = Dimensions.get('window');

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

export default function TeacherSetupScreen({ navigation }) {
  const { state, actions } = useStore();
  const [nombre, setNombre] = useState(state.teacherProfile?.nombre || '');
  const [email, setEmail] = useState(state.teacherProfile?.email || '');
  const [telefono, setTelefono] = useState(state.teacherProfile?.telefono || '');
  const [especialidades, setEspecialidades] = useState(state.teacherProfile?.especialidades || []);
  const [especialidadInput, setEspecialidadInput] = useState('');
  const [experiencia, setExperiencia] = useState(state.teacherProfile?.experiencia || '0-2 años');
  const [descripcion, setDescripcion] = useState(state.teacherProfile?.descripcion || '');
  const [ubicacion, setUbicacion] = useState(state.teacherProfile?.ubicacion || '');
  const [tipoInstitucion, setTipoInstitucion] = useState(state.teacherProfile?.tipoInstitucion || '');
  // REMOVED: nivelEstudiantil state
  const [precioHora, setPrecioHora] = useState(state.teacherProfile?.precioHora || '');
  const [disponibilidad, setDisponibilidad] = useState(state.teacherProfile?.disponibilidad || '');
  const [selectedDay, setSelectedDay] = useState(0);
  const [schedule, setSchedule] = useState(state.teacherSchedule || {
    Lunes: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Martes: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Miércoles: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Jueves: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Viernes: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    Sábado: ['09:00', '10:00', '11:00'],
    Domingo: []
  });
  
  // Estados para animaciones y validación
  const [errors, setErrors] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scrollViewRef = useRef(null);

  // Efectos para animaciones
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animations.normal,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animations.normal,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, []);



  // Validación en tiempo real
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          newErrors.email = 'Formato de email inválido';
        } else {
          delete newErrors.email;
        }
        break;
      case 'telefono':
        if (value && value.length < 10) {
          newErrors.telefono = 'Teléfono debe tener al menos 10 dígitos';
        } else {
          delete newErrors.telefono;
        }
        break;
      case 'nombre':
        if (value && value.length < 2) {
          newErrors.nombre = 'Nombre debe tener al menos 2 caracteres';
        } else {
          delete newErrors.nombre;
        }
        break;
      case 'precioHora':
        if (value && (isNaN(value) || parseFloat(value) < 0)) {
          newErrors.precioHora = 'Precio debe ser un número válido';
        } else {
          delete newErrors.precioHora;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleGuardar = () => {
    console.log('handleGuardar called'); // Debug log
    try {
      const newErrors = {};
      
      if (!nombre) newErrors.nombre = 'Nombre es obligatorio';
      if (!email) newErrors.email = 'Email es obligatorio';
      if (!telefono) newErrors.telefono = 'Teléfono es obligatorio';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        console.log('Validation errors:', newErrors); // Debug log
        Alert.alert('Campos obligatorios', 'Completa todos los campos requeridos.');
        return;
      }
      
      const perfil = {
        nombre,
        email,
        telefono,
        especialidades,
        experiencia,
        descripcion,
        ubicacion,
        tipoInstitucion,
        // REMOVED: nivelEstudiantil
        precioHora,
        disponibilidad,
      };
      
      console.log('Saving profile:', perfil); // Debug log
      actions.saveTeacherProfile(perfil);
      actions.updateTeacherSchedule(schedule);
      
      // Crear un docente temporal para el proceso de pago
      const tempTeacher = {
        id: `temp_${Date.now()}`,
        ...perfil,
        isPaid: false,
      };
      actions.setCurrentTeacher(tempTeacher);
      
      console.log('Profile saved, navigating to PaymentGateway'); // Debug log
      
      // Navegación directa sin Alert para evitar problemas en producción
      navigation.navigate('PaymentGateway');
      
    } catch (error) {
      console.error('Error saving profile:', error); // Debug log
      Alert.alert('Error', 'Hubo un problema al guardar el perfil. Inténtalo de nuevo.');
    }
  };

  const toggleTimeSlot = (day, time) => {
    const daySchedule = schedule[day] || [];
    const isSelected = daySchedule.includes(time);
    
    setSchedule(prev => ({
      ...prev,
      [day]: isSelected 
        ? daySchedule.filter(t => t !== time)
        : [...daySchedule, time].sort()
    }));
  };

  const clearDay = (day) => {
    setSchedule(prev => ({ ...prev, [day]: [] }));
  };

  const getDayStats = (day) => {
    const slots = schedule[day] || [];
    return {
      total: slots.length,
      hours: slots.length,
      percentage: Math.round((slots.length / TIME_SLOTS.length) * 100)
    };
  };

  const handleAutocompletar = () => {
    setNombre('Juan Torres');
    setEmail('juan.torres@example.com');
    setTelefono('+593 99 988 8777');
    setEspecialidades(['Matemática', 'Física']);
    setExperiencia('3-5 años');
    setDescripcion('Docente con amplia experiencia en matemáticas y física. Especializado en preparación para exámenes universitarios y apoyo escolar.');
    setUbicacion('Quito, Ecuador');
    setTipoInstitucion('colegio');
    // REMOVED: nivelEstudiantil
    setPrecioHora('25');
    setDisponibilidad('Mañana y tarde');
    setEspecialidadInput('');
  };

  return (
    <GradientBackground variant="white" theme="teacherSetup">
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.container} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Hermoso y Moderno */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <WebCompatibleLinearGradient
              colors={['#FF4757', '#FF6B6B', '#FF9800']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.titleSection}>
                <View style={styles.titleContainer}>
                  <View style={styles.logoContainer}>
                    <View style={styles.logoBackground}>
                      <Text style={styles.logoEmoji}>👨‍🏫</Text>
                    </View>
                    <View style={styles.logoAccent}>
                      <MaterialIcons name="star" size={16} color="white" />
                    </View>
                  </View>
                  <View style={styles.titleTextContainer}>
                    <Text style={styles.title}>Perfil Docente</Text>
                    <Text style={styles.subtitle}>
                      Completa tu información para comenzar a enseñar
                    </Text>
                  </View>
                </View>
                <AppButton
                  iconOnly
                  leftIcon="swap-horiz"
                  onPress={() => navigation.reset({ index: 0, routes: [{ name: 'RoleSelect' }] })}
                  variant="ghost"
                  size="md"
                  style={styles.roleButton}
                />
              </View>
            </WebCompatibleLinearGradient>
          </Animated.View>

          {/* Información Personal */}
          <View style={styles.formSection}>
            <WebCompatibleLinearGradient
              colors={['#2ED573', '#4ECDC4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>👤 Información Personal</Text>
            </WebCompatibleLinearGradient>
            
            <AppInput 
              label="Nombre completo"
              placeholder="Tu nombre completo"
              value={nombre} 
              onChangeText={(text) => {
                setNombre(text);
                validateField('nombre', text);
              }}
              leftIcon="person"
              error={errors.nombre}
              style={styles.input}
            />
            
            <AppInput 
              label="Email"
              placeholder="tu@email.com"
              value={email} 
              onChangeText={(text) => {
                setEmail(text);
                validateField('email', text);
              }}
              keyboardType="email-address"
              leftIcon="email"
              error={errors.email}
              style={styles.input}
            />
            
            <AppInput 
              label="Teléfono"
              placeholder="+593 99 999 9999"
              value={telefono} 
              onChangeText={(text) => {
                setTelefono(text);
                validateField('telefono', text);
              }}
              keyboardType="phone-pad"
              leftIcon="phone"
              error={errors.telefono}
              style={styles.input}
            />
            
            <AppInput 
              label="Ubicación"
              placeholder="Ciudad, País"
              value={ubicacion} 
              onChangeText={setUbicacion}
              leftIcon="location-on"
              style={styles.input}
            />
            
            <Text style={styles.fieldLabel}>Nivel de Enseñanza</Text>
            <ChipGroup
              options={["Escuela", "Colegio", "Universidad"]}
              value={tipoInstitucion}
              onChange={setTipoInstitucion}
              style={styles.chips}
            />

            {/* REMOVED: Niveles que enseñas */}
            {/*
            <Text style={styles.fieldLabel}>Niveles que enseñas</Text>
            <ChipGroup
              options={["Primaria", "Secundaria", "Bachillerato", "Universidad", "Postgrado", "Adultos"]}
              value={nivelEstudiantil}
              onChange={setNivelEstudiantil}
              style={styles.chips}
              multiple={true}
            />
            */}
          </View>

          {/* Especialidades */}
          <View style={styles.formSection}>
            <WebCompatibleLinearGradient
              colors={['#FF9800', '#FFA726']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>📚 Especialidades</Text>
            </WebCompatibleLinearGradient>
            
            <View style={styles.addSpecialtyContainer}>
              <AppInput
                placeholder="Agregar especialidad..."
                value={especialidadInput}
                onChangeText={setEspecialidadInput}
                leftIcon="add"
                style={styles.specialtyInput}
                onSubmitEditing={() => {
                  const val = (especialidadInput || '').trim();
                  if (!val) return;
                  const exists = especialidades.some((e) => e.toLowerCase() === val.toLowerCase());
                  if (exists) {
                    setEspecialidadInput('');
                    return;
                  }
                  setEspecialidades([...especialidades, val]);
                  setEspecialidadInput('');
                }}
              />
              <AppButton
                iconOnly
                leftIcon="add"
                onPress={() => {
                  const val = (especialidadInput || '').trim();
                  if (!val) return;
                  const exists = especialidades.some((e) => e.toLowerCase() === val.toLowerCase());
                  if (exists) {
                    setEspecialidadInput('');
                    return;
                  }
                  setEspecialidades([...especialidades, val]);
                  setEspecialidadInput('');
                }}
                variant="primary"
                size="sm"
                style={styles.addButton}
              />
            </View>
            
            <View style={styles.specialtiesList}>
              {especialidades.map((esp, index) => (
                <View key={`specialty-${esp}-${index}`} style={styles.specialtyItem}>
                  <Text style={styles.specialtyText}>{esp}</Text>
                  <TouchableOpacity 
                    onPress={() => setEspecialidades(especialidades.filter((e) => e !== esp))}
                    style={styles.removeButton}
                  >
                    <MaterialIcons name="close" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Experiencia */}
          <View style={styles.formSection}>
            <WebCompatibleLinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>💼 Experiencia</Text>
            </WebCompatibleLinearGradient>
            
            <Text style={styles.fieldLabel}>Años de experiencia</Text>
            <ChipGroup
              options={["0-2 años", "3-5 años", "6-9 años", "10+ años"]}
              value={experiencia}
              onChange={setExperiencia}
              style={styles.chips}
            />
          </View>

          {/* Horarios de Trabajo */}
          <View style={styles.formSection}>
            <WebCompatibleLinearGradient
              colors={['#00D2FF', '#3A7BD5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>📅 Horarios de Trabajo</Text>
            </WebCompatibleLinearGradient>
            
            {/* Resumen semanal */}
            <View style={styles.scheduleSummary}>
              <Text style={styles.scheduleSummaryTitle}>Resumen Semanal</Text>
              <View style={styles.scheduleSummaryGrid}>
                {DAYS.map((day, index) => {
                  const stats = getDayStats(day);
                  return (
                    <View key={day} style={styles.scheduleSummaryItem}>
                      <Text style={styles.scheduleSummaryDay}>{day.slice(0, 3)}</Text>
                      <Text style={styles.scheduleSummaryHours}>{stats.hours}h</Text>
                      <View style={styles.scheduleSummaryBar}>
                        <View 
                          style={[
                            styles.scheduleSummaryBarFill, 
                            { width: `${stats.percentage}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Selector de días */}
            <View style={styles.daySelector}>
              <Text style={styles.daySelectorTitle}>Seleccionar Día</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
                {DAYS.map((day, index) => {
                  const stats = getDayStats(day);
                  const isSelected = selectedDay === index;
                  return (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayButton,
                        isSelected && styles.dayButtonSelected
                      ]}
                      onPress={() => setSelectedDay(index)}
                    >
                      <Text style={[
                        styles.dayButtonText,
                        isSelected && styles.dayButtonTextSelected
                      ]}>
                        {day.slice(0, 3)}
                      </Text>
                      <Text style={[
                        styles.dayButtonHours,
                        isSelected && styles.dayButtonHoursSelected
                      ]}>
                        {stats.hours}h
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Horarios del día seleccionado */}
            <View style={styles.timeSlotsSection}>
              <View style={styles.timeSlotsHeader}>
                <Text style={styles.timeSlotsTitle}>
                  Horarios - {DAYS[selectedDay]}
                </Text>
                <TouchableOpacity 
                  onPress={() => clearDay(DAYS[selectedDay])}
                  style={styles.clearDayButton}
                >
                  <MaterialIcons name="clear" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <View style={styles.timeSlotsGrid}>
                {TIME_SLOTS.map((time) => {
                  const isSelected = (schedule[DAYS[selectedDay]] || []).includes(time);
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        isSelected && styles.timeSlotSelected
                      ]}
                      onPress={() => toggleTimeSlot(DAYS[selectedDay], time)}
                    >
                      <Text style={[
                        styles.timeSlotText,
                        isSelected && styles.timeSlotTextSelected
                      ]}>
                        {time}
                      </Text>
                      {isSelected && (
                        <MaterialIcons name="check" size={16} color="white" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.formSection}>
            <WebCompatibleLinearGradient
              colors={['#FF416C', '#FF4B6B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>📝 Descripción</Text>
            </WebCompatibleLinearGradient>
            
            <AppInput 
              label="Cuéntanos sobre tu experiencia"
              placeholder="Describe tu experiencia y metodología de enseñanza..."
              value={descripcion} 
              onChangeText={setDescripcion}
              multiline
              numberOfLines={4}
              leftIcon="description"
              style={styles.input}
            />
          </View>

          {/* Precio */}
          <View style={styles.formSection}>
            <WebCompatibleLinearGradient
              colors={['#059669', '#10B981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>💰 Tarifa</Text>
            </WebCompatibleLinearGradient>
            
            <AppInput 
              label="Precio por hora (USD)"
              placeholder="25"
              value={precioHora} 
              onChangeText={(text) => {
                setPrecioHora(text);
                validateField('precioHora', text);
              }}
              keyboardType="numeric"
              leftIcon="attach-money"
              style={styles.input}
              error={errors.precioHora}
            />
            
            <Text style={styles.priceHint}>
              Precio sugerido: $15-50 USD/hora
            </Text>
          </View>

          {/* Botones */}
          <View style={styles.buttonsContainer}>
            <AppButton
              title="Ver Demo"
              leftIcon="visibility"
              onPress={handleAutocompletar}
              variant="warning"
              size="lg"
              style={styles.demoButton}
            />
            
            <AppButton
              title="Guardar Perfil"
              leftIcon="save"
              onPress={handleGuardar}
              variant="success"
              size="lg"
              disabled={Object.keys(errors).length > 0}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...elevation.lg,
  },
  headerGradient: {
    padding: spacing.xl,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginRight: spacing.lg,
  },
  logoBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.md,
  },
  logoEmoji: {
    fontSize: 28,
  },
  logoAccent: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.sm,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    ...typography.title,
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  roleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    minHeight: 48,
    ...elevation.sm,
  },

  // Estilos del nuevo diseño
  formSection: {
    marginBottom: spacing.xl,
    backgroundColor: colors.themes.teacherSetup.card,
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...elevation.lg,
  },
  sectionHeader: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: spacing.md,
    marginHorizontal: spacing.lg,
  },
  fieldLabel: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.text,
    fontWeight: '600',
    fontSize: 13,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  chips: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  priceHint: {
    ...typography.caption,
    color: colors.themes.teacherSetup.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
    fontStyle: 'italic',
    marginHorizontal: spacing.lg,
  },

  // Especialidades
  addSpecialtyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginBottom: spacing.md,
    marginHorizontal: spacing.lg,
  },
  specialtyInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: colors.themes.teacherSetup.primary,
    padding: spacing.md,
    borderRadius: radii.lg,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.md,
  },
  specialtiesList: {
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  specialtyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.themes.teacherSetup.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.themes.teacherSetup.border,
    ...elevation.sm,
  },
  specialtyText: {
    color: colors.themes.teacherSetup.text,
    fontWeight: '500',
    fontSize: 13,
  },
  removeButton: {
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    minHeight: 32,
  },

  // Botones
  buttonsContainer: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  demoButton: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...elevation.lg,
  },
  demoButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  demoButtonText: {
    ...typography.button,
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...elevation.lg,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  saveButtonText: {
    ...typography.button,
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Estilos para horarios
  scheduleSummary: {
    marginBottom: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  scheduleSummaryTitle: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.text,
    fontWeight: '600',
    fontSize: 13,
    marginBottom: spacing.md,
  },
  scheduleSummaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleSummaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  scheduleSummaryDay: {
    ...typography.caption,
    color: colors.themes.teacherSetup.textSecondary,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  scheduleSummaryHours: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.primary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  scheduleSummaryBar: {
    width: 20,
    height: 4,
    backgroundColor: colors.themes.teacherSetup.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  scheduleSummaryBarFill: {
    height: '100%',
    backgroundColor: colors.themes.teacherSetup.primary,
  },
  daySelector: {
    marginBottom: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  daySelectorTitle: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.text,
    fontWeight: '600',
    fontSize: 13,
    marginBottom: spacing.md,
  },
  dayScroll: {
    marginTop: spacing.md,
  },
  dayButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    backgroundColor: colors.themes.teacherSetup.surface,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
    ...elevation.sm,
  },
  dayButtonSelected: {
    backgroundColor: colors.themes.teacherSetup.primary,
  },
  dayButtonText: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  dayButtonTextSelected: {
    color: 'white',
  },
  dayButtonHours: {
    ...typography.caption,
    color: colors.themes.teacherSetup.textSecondary,
    fontSize: 10,
  },
  dayButtonHoursSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timeSlotsSection: {
    marginBottom: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  timeSlotsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timeSlotsTitle: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.text,
    fontWeight: '600',
    fontSize: 13,
  },
  clearDayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.themes.teacherSetup.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    minWidth: 40,
    minHeight: 40,
    ...elevation.sm,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeSlot: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.themes.teacherSetup.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.themes.teacherSetup.border,
    alignItems: 'center',
    minWidth: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    ...elevation.xs,
  },
  timeSlotSelected: {
    backgroundColor: colors.themes.teacherSetup.primary,
    borderColor: colors.themes.teacherSetup.primary,
  },
  timeSlotText: {
    ...typography.bodySmall,
    color: colors.themes.teacherSetup.text,
    fontSize: 11,
    fontWeight: '600',
  },
  timeSlotTextSelected: {
    color: 'white',
    marginRight: spacing.xs,
  },
});



