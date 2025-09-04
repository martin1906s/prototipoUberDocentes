import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import BackButton from '../../components/BackButton';
import { MaterialIcons } from '@expo/vector-icons';
import { useStore } from '../../store/store';
import { colors, spacing, radii, typography } from '../../theme/theme';

function Badge({ label, style }) {
  return (
    <View style={{
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.pill,
      backgroundColor: colors.info,
      borderWidth: 1,
      borderColor: colors.info,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
      ...(style || {}),
    }}>
      <Text style={{ color: colors.white, fontWeight: '600', fontSize: 14 }}>{label}</Text>
    </View>
  );
}

export default function UserTeacherDetailScreen({ route, navigation }) {
  const { state, actions } = useStore();
  const { teacherId, fromRegister } = route.params || {};
  const teacher = state.teachers.find((t) => t.id === teacherId);
  
  const [modalVisible, setModalVisible] = useState(fromRegister || false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('2');

  if (!teacher) {
    return (
      <GradientBackground>
        <View style={{ height: spacing.xl }} />
        <Text style={{ color: overlay.textOnDarkPrimary }}>No se encontró el docente.</Text>
      </GradientBackground>
    );
  }

  // Generar fechas disponibles basadas en horarios del docente
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = dayNames[date.getDay()];
      
      // Solo incluir días que tienen horarios disponibles
      if (teacher.horarios && teacher.horarios[dayName] && teacher.horarios[dayName].length > 0) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('es-ES', { 
            weekday: 'long'
          }),
          dayName: dayName
        });
      }
    }
    return dates;
  };

  // Obtener horarios disponibles para el día seleccionado
  const getAvailableTimes = (selectedDate) => {
    if (!selectedDate || !teacher.horarios) return [];
    
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const date = new Date(selectedDate);
    const dayName = dayNames[date.getDay()];
    
    const times = teacher.horarios[dayName] || [];
    return times.map(time => ({
      value: time,
      label: time.includes(':') ? 
        `${time.split(':')[0]}:${time.split(':')[1]} ${parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM'}` :
        time
    }));
  };

  // Duraciones disponibles
  const durations = [
    { value: '1', label: '1 hora' },
    { value: '2', label: '2 horas' },
    { value: '3', label: '3 horas' },
  ];

  const handleContratar = () => {
    if (!state.userProfile) {
      // Primera vez contratando - ir a registro con datos personales
      navigation.navigate('UserRegister', { teacherId });
      return;
    }
    // Ya tiene perfil - ir directo a selección de horarios
    setModalVisible(true);
  };

  const handleConfirmContract = () => {
    console.log('handleConfirmContract called'); // Debug log
    if (!selectedDate || !selectedTime) {
      console.log('Missing date or time:', { selectedDate, selectedTime }); // Debug log
      Alert.alert('Error', 'Por favor selecciona una fecha y hora');
      return;
    }

    // Crear la propuesta con fecha y hora
    const proposal = {
      teacherId: teacher.id,
      user: state.userProfile,
      mensaje: `Solicito clases de ${teacher.especialidades[0]} el ${selectedDate} a las ${selectedTime} por ${selectedDuration} hora(s).`,
      fecha: selectedDate,
      hora: selectedTime,
      duracion: selectedDuration,
    };

    console.log('Creating proposal:', proposal); // Debug log
    actions.createProposal(proposal);
    
    console.log('Proposal created, closing modal and navigating'); // Debug log
    
    // Cerrar modal y navegar al historial
    setModalVisible(false);
    navigation.navigate('UserTabs', { screen: 'UserHistory' });
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDuration('2');
  };

  return (
    <GradientBackground variant="white" theme="userSearch">
      <BackButton navigation={navigation} />
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeEmoji}>👨‍🏫</Text>
              <Text style={styles.welcomeText}>Detalle del Docente</Text>
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
              <View style={styles.experienceRow}>
                <MaterialIcons name="work" size={18} color={colors.info} />
                <Text style={styles.experienceText}>{teacher.experiencia}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.specialtiesCard}>
          <Text style={styles.sectionTitle}>📚 Especialidades</Text>
          <View style={styles.specialtiesContainer}>
            {teacher.especialidades.map((e) => (
              <Badge key={e} label={e} />
            ))}
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>ℹ️ Información Adicional</Text>
          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailEmoji}>⏰</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Disponibilidad</Text>
                <Text style={styles.detailValue}>{teacher.disponibilidad}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailEmoji}>📍</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Ubicación</Text>
                <Text style={styles.detailValue}>{teacher.ubicacion}</Text>
              </View>
            </View>
            {teacher.descripcion && (
              <View style={styles.detailRow}>
                <Text style={styles.detailEmoji}>📝</Text>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Descripción</Text>
                  <Text style={styles.detailValue}>{teacher.descripcion}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <AppButton 
            title="Contratar docente"
            leftIcon="phone" 
            variant="success" 
            size="lg" 
            onPress={handleContratar}
            style={styles.contractButton}
          />
        </View>
      </ScrollView>

      {/* Modal de Selección de Fecha y Hora */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📅 Seleccionar Fecha y Hora</Text>
              <AppButton
                iconOnly
                leftIcon="close"
                onPress={closeModal}
                variant="ghost"
                size="sm"
                style={styles.closeButton}
              />
            </View>

            <ScrollView 
              style={styles.modalScrollContainer} 
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Selección de Fecha */}
              <View style={styles.selectionSection}>
                <Text style={styles.sectionTitle}>📅 Selecciona una Fecha</Text>
                <View style={styles.optionsContainer}>
                  {getAvailableDates().map((date) => (
                    <TouchableOpacity
                      key={date.value}
                      style={[
                        styles.optionButton,
                        selectedDate === date.value && styles.selectedOption
                      ]}
                      onPress={() => setSelectedDate(date.value)}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedDate === date.value && styles.selectedOptionText
                      ]}>
                        {date.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Selección de Hora */}
              <View style={styles.selectionSection}>
                <Text style={styles.sectionTitle}>⏰ Selecciona una Hora</Text>
                {selectedDate ? (
                  <View style={styles.optionsContainer}>
                    {getAvailableTimes(selectedDate).map((time) => (
                      <TouchableOpacity
                        key={time.value}
                        style={[
                          styles.optionButton,
                          selectedTime === time.value && styles.selectedOption
                        ]}
                        onPress={() => setSelectedTime(time.value)}
                      >
                        <Text style={[
                          styles.optionText,
                          selectedTime === time.value && styles.selectedOptionText
                        ]}>
                          {time.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>
                      Primero selecciona una fecha para ver los horarios disponibles
                    </Text>
                  </View>
                )}
              </View>

              {/* Selección de Duración */}
              <View style={styles.selectionSection}>
                <Text style={styles.sectionTitle}>⏱️ Duración de la Clase</Text>
                <View style={styles.optionsContainer}>
                  {durations.map((duration) => (
                    <TouchableOpacity
                      key={duration.value}
                      style={[
                        styles.optionButton,
                        selectedDuration === duration.value && styles.selectedOption
                      ]}
                      onPress={() => setSelectedDuration(duration.value)}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedDuration === duration.value && styles.selectedOptionText
                      ]}>
                        {duration.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Resumen de la Selección */}
              {(selectedDate || selectedTime || selectedDuration) && (
                <View style={styles.summarySection}>
                  <Text style={styles.sectionTitle}>📋 Resumen de tu Solicitud</Text>
                  <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                      <MaterialIcons name="person" size={20} color={colors.primary} />
                      <Text style={styles.summaryText}>Docente: {teacher.nombre}</Text>
                    </View>
                    {selectedDate && (
                      <View style={styles.summaryRow}>
                        <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
                        <Text style={styles.summaryText}>
                          Fecha: {getAvailableDates().find(d => d.value === selectedDate)?.label}
                        </Text>
                      </View>
                    )}
                    {selectedTime && (
                      <View style={styles.summaryRow}>
                        <MaterialIcons name="access-time" size={20} color={colors.primary} />
                        <Text style={styles.summaryText}>
                          Hora: {getAvailableTimes(selectedDate).find(t => t.value === selectedTime)?.label}
                        </Text>
                      </View>
                    )}
                    {selectedDuration && (
                      <View style={styles.summaryRow}>
                        <MaterialIcons name="schedule" size={20} color={colors.primary} />
                        <Text style={styles.summaryText}>
                          Duración: {durations.find(d => d.value === selectedDuration)?.label}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Botones del Modal */}
            <View style={styles.modalActions}>
              <AppButton
                title="Cancelar"
                leftIcon="close"
                onPress={closeModal}
                variant="outline"
                size="md"
                style={[styles.modalButton, styles.cancelButton]}
              />
              
              <AppButton
                title="Confirmar"
                leftIcon="check"
                onPress={handleConfirmContract}
                variant="success"
                size="md"
                style={[styles.modalButton, styles.confirmButton]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.info,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  teacherAvatarText: {
    ...typography.title,
    color: colors.white,
    fontSize: 32,
    fontWeight: '700',
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    ...typography.title,
    color: colors.themes.userSearch.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  experienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experienceText: {
    ...typography.bodySmall,
    color: colors.themes.userSearch.textSecondary,
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  specialtiesCard: {
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
  sectionTitle: {
    ...typography.subtitle,
    color: colors.themes.userSearch.text,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: spacing.md,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  detailsCard: {
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
  detailsList: {
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailEmoji: {
    fontSize: 20,
    marginRight: spacing.md,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.themes.userSearch.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  detailValue: {
    ...typography.bodySmall,
    color: colors.themes.userSearch.text,
    fontSize: 16,
    lineHeight: 22,
  },
  actionsContainer: {
    gap: spacing.md,
  },
  contractButton: {
    marginBottom: spacing.sm,
  },
  saveButton: {
    marginBottom: spacing.lg,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: '90%',
    minHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  modalTitle: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
    fontSize: 18,
  },
  closeButton: {
    padding: spacing.sm,
  },
  modalScrollContainer: {
    flex: 1,
  },
  modalContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  selectionSection: {
    marginBottom: spacing.xl,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.neutral300,
    backgroundColor: colors.white,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  optionText: {
    ...typography.bodySmall,
    color: colors.neutral700,
    fontWeight: '500',
    fontSize: 14,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  summarySection: {
    marginBottom: spacing.xl,
  },
  summaryCard: {
    backgroundColor: colors.neutral50,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryText: {
    ...typography.bodySmall,
    color: colors.neutral700,
    marginLeft: spacing.sm,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
    gap: spacing.md,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    gap: spacing.sm,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: colors.neutral200,
  },
  confirmButton: {
    backgroundColor: colors.success,
  },
  cancelButtonText: {
    ...typography.bodySmall,
    color: colors.neutral600,
    fontWeight: '600',
    fontSize: 14,
  },
  confirmButtonText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  placeholderContainer: {
    padding: spacing.lg,
    backgroundColor: colors.neutral100,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderStyle: 'dashed',
  },
  placeholderText: {
    ...typography.bodySmall,
    color: colors.neutral500,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});


