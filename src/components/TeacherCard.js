import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import WebCompatibleLinearGradient from './WebCompatibleLinearGradient';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store/store';
import { colors, spacing, radii, elevation } from '../theme/theme';

export default function TeacherCard({ teacher, onPress }) {
  const navigation = useNavigation();
  const { state } = useStore();
  const getSubjectColor = (subject) => {
    const subjectColors = {
      'Matemáticas': '#667eea',
      'Ciencias': '#22C55E',
      'Lenguaje': '#F59E0B',
      'Historia': '#EF4444',
      'Inglés': '#8B5CF6',
      'Física': '#06B6D4',
      'Química': '#10B981',
    };
    return subjectColors[subject] || '#6B7280';
  };

  const getSubjectGradient = (subject) => {
    const gradients = {
      'Matemáticas': ['#667eea', '#764ba2'],
      'Ciencias': ['#4facfe', '#00f2fe'],
      'Lenguaje': ['#feca57', '#ff9ff3'],
      'Historia': ['#ff6b6b', '#ee5a24'],
      'Inglés': ['#f093fb', '#f5576c'],
      'Física': ['#48cae4', '#023e8a'],
      'Química': ['#11998e', '#38ef7d'],
    };
    return gradients[subject] || ['#667eea', '#764ba2'];
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* Header con gradiente */}
      <WebCompatibleLinearGradient
        colors={getSubjectGradient(teacher.subject)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.teacherInfo}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <MaterialIcons name="person" size={32} color={colors.white} />
              </View>
              <View style={styles.availabilityBadge}>
                <View style={[
                  styles.availabilityDot, 
                  { backgroundColor: teacher.available ? colors.success : colors.danger }
                ]} />
              </View>
            </View>
            <View style={styles.teacherDetails}>
              <Text style={styles.teacherName}>{teacher.name}</Text>
              <Text style={styles.teacherSubject}>{teacher.subject}</Text>

            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${teacher.hourlyRate}</Text>
            <Text style={styles.priceUnit}>/hora</Text>
          </View>
        </View>
      </WebCompatibleLinearGradient>

      {/* Contenido principal */}
      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={3}>
          {teacher.description}
        </Text>
        
        <View style={styles.skillsContainer}>
          {teacher.skills?.slice(0, 4).map((skill, index) => (
            <View key={`skill-${skill}-${index}`} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {teacher.skills?.length > 4 && (
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>+{teacher.skills.length - 4}</Text>
            </View>
          )}
        </View>

        {/* Niveles Estudiantiles */}
        {Array.isArray(teacher.nivelEstudiantil) && teacher.nivelEstudiantil.length > 0 && (
          <View style={styles.levelsContainer}>
            <View style={styles.levelsHeader}>
              <MaterialIcons name="class" size={16} color={colors.warning} />
              <Text style={styles.levelsTitle}>Niveles que enseña</Text>
            </View>
            <View style={styles.levelsList}>
              {teacher.nivelEstudiantil.map((level, index) => (
                <View key={`level-${level}-${index}`} style={styles.levelTag}>
                  <Text style={styles.levelText}>{level}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={16} color={colors.primary} />
            <Text style={styles.location}>{teacher.location}</Text>
          </View>
          <View style={styles.institutionContainer}>
            <MaterialIcons name="school" size={16} color={colors.secondary} />
            <Text style={styles.institution}>{teacher.tipoInstitucion || 'Colegio'}</Text>
          </View>
        </View>
      </View>

      {/* Botón de acción */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => {
            if (!state.userProfile) {
              navigation.navigate('UserRegister', { teacherId: teacher.id });
              return;
            }
            navigation.navigate('UserRegister', { teacherId: teacher.id });
          }}
        >
          <MaterialIcons name="assignment-turned-in" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  headerGradient: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  teacherInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  availabilityBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  availabilityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  teacherDetails: {
    flex: 1,
  },
  teacherName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  teacherSubject: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.sm,
  },

  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
  },
  priceUnit: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
  },
  description: {
    fontSize: 15,
    color: colors.neutral700,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  skillTag: {
    backgroundColor: colors.neutral100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral700,
  },
  // Estilos para niveles estudiantiles
  levelsContainer: {
    marginBottom: spacing.md,
  },
  levelsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  levelsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral700,
    marginLeft: spacing.xs,
  },
  levelsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  levelTag: {
    backgroundColor: colors.warning + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.warning,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    fontSize: 13,
    color: colors.neutral600,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  institutionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  institution: {
    fontSize: 13,
    color: colors.neutral600,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  actionContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  contactButton: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    minWidth: 56,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});