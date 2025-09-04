import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { spacing, colors, typography, radii, elevation } from '../theme/theme';

export default function PaymentStatusCard({ teacher, onViewDetails }) {
  const isPaid = teacher.isPaid;
  
  return (
    <TouchableOpacity 
      style={[styles.container, isPaid ? styles.paidContainer : styles.pendingContainer]} 
      onPress={() => onViewDetails(teacher)}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {teacher.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, isPaid ? styles.paidBadge : styles.pendingBadge]}>
            <MaterialIcons 
              name={isPaid ? "check-circle" : "pending"} 
              size={16} 
              color={isPaid ? colors.success : colors.warning} 
            />
            <Text style={[styles.statusText, isPaid ? styles.paidStatusText : styles.pendingStatusText]}>
              {isPaid ? 'Pagado' : 'Pendiente'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.teacherName}>{teacher.nombre}</Text>
        <Text style={styles.specialties}>
          {teacher.especialidades.join(' • ')}
        </Text>
        <Text style={styles.experience}>{teacher.experiencia}</Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentLabel}>
            {isPaid ? 'Comisión pagada' : 'Comisión pendiente'}
          </Text>
          <Text style={styles.paymentAmount}>
            ${isPaid ? '25,000' : '25,000'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.viewButton}>
          <MaterialIcons name="visibility" size={16} color={colors.primary} />
          <Text style={styles.viewButtonText}>Ver</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...elevation.sm,
    borderLeftWidth: 4,
  },
  paidContainer: {
    borderLeftColor: colors.success,
  },
  pendingContainer: {
    borderLeftColor: colors.warning,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.h6,
    color: colors.primary,
    fontWeight: '700',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    gap: spacing.xs,
  },
  paidBadge: {
    backgroundColor: colors.success + '15',
  },
  pendingBadge: {
    backgroundColor: colors.warning + '15',
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 12,
  },
  paidStatusText: {
    color: colors.success,
  },
  pendingStatusText: {
    color: colors.warning,
  },
  
  content: {
    marginBottom: spacing.md,
  },
  teacherName: {
    ...typography.body,
    color: colors.neutral900,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  specialties: {
    ...typography.caption,
    color: colors.neutral600,
    marginBottom: spacing.xs,
  },
  experience: {
    ...typography.caption,
    color: colors.neutral500,
    fontSize: 12,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    ...typography.caption,
    color: colors.neutral600,
    marginBottom: spacing.xs,
  },
  paymentAmount: {
    ...typography.body,
    color: colors.neutral900,
    fontWeight: '700',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.primary + '10',
    gap: spacing.xs,
  },
  viewButtonText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});
