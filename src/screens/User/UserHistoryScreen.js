import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import AppCard from '../../components/AppCard';
import OptionsMenu from '../../components/OptionsMenu';
import { MaterialIcons } from '@expo/vector-icons';
import { useStore } from '../../store/store';
import { spacing, colors, radii, typography } from '../../theme/theme';

export default function UserHistoryScreen({ navigation }) {
  const { state } = useStore();

  // Simular historial de contrataciones
  const historyData = useMemo(() => [
    {
      id: 'h1',
      teacherName: 'Ana García',
      subject: 'Matemáticas',
      date: '2024-01-15',
      status: 'completada',
      rating: 5,
      hours: 8,
      total: 200,
    },
    {
      id: 'h2',
      teacherName: 'Luis Pérez',
      subject: 'Inglés',
      date: '2024-01-10',
      status: 'en_progreso',
      rating: 4,
      hours: 4,
      total: 100,
    },
    {
      id: 'h3',
      teacherName: 'María López',
      subject: 'Física',
      date: '2024-01-05',
      status: 'completada',
      rating: 5,
      hours: 6,
      total: 150,
    },
  ], []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completada': return '#10B981';
      case 'en_progreso': return '#F59E0B';
      case 'cancelada': return '#EF4444';
      default: return colors.neutral500;
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'completada': return '✅';
      case 'en_progreso': return '⏳';
      case 'cancelada': return '❌';
      default: return '📋';
    }
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <View style={styles.teacherInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.teacherName.charAt(0)}</Text>
          </View>
          <View style={styles.teacherDetails}>
            <Text style={styles.teacherName}>{item.teacherName}</Text>
            <Text style={styles.subject}>{item.subject}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusEmoji}>{getStatusEmoji(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.historyDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📅 Fecha:</Text>
          <Text style={styles.detailValue}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>⏰ Horas:</Text>
          <Text style={styles.detailValue}>{item.hours}h</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>💰 Total:</Text>
          <Text style={styles.detailValue}>${item.total}</Text>
        </View>

      </View>
    </View>
  );

  const ListHeaderComponent = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeEmoji}>📚</Text>
            <Text style={styles.welcomeText}>Mi Historial</Text>
          </View>
          <OptionsMenu navigation={navigation} theme="userProfile" />
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Resumen</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{historyData.length}</Text>
            <Text style={styles.statLabel}>Contrataciones</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{historyData.reduce((acc, item) => acc + item.hours, 0)}h</Text>
            <Text style={styles.statLabel}>Horas totales</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>${historyData.reduce((acc, item) => acc + item.total, 0)}</Text>
            <Text style={styles.statLabel}>Total invertido</Text>
          </View>
        </View>
      </View>

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>📋 Historial de Contrataciones</Text>
      </View>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📭</Text>
      <Text style={styles.emptyTitle}>No hay historial aún</Text>
      <Text style={styles.emptySubtitle}>
        Cuando contrates docentes, aparecerán aquí
      </Text>
    </View>
  );

  return (
    <GradientBackground variant="white" theme="userProfile">
      <FlatList
        data={historyData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        style={styles.flatList}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.xl,
  },
  flatList: {
    flex: 1,
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
    color: colors.themes.userProfile.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.themes.userProfile.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.themes.userProfile.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  roleButtonText: {
    color: colors.themes.userProfile.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
    fontSize: 14,
  },
  statsCard: {
    backgroundColor: colors.themes.userProfile.card,
    padding: spacing.lg,
    borderRadius: radii.xl,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statsTitle: {
    ...typography.subtitle,
    color: colors.themes.userProfile.primary,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.title,
    color: colors.themes.userProfile.primary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  historySection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.themes.userProfile.primary,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: spacing.md,
  },
  historyCard: {
    backgroundColor: colors.themes.userProfile.card,
    padding: spacing.lg,
    borderRadius: radii.xl,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.themes.userProfile.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '700',
    fontSize: 18,
  },
  teacherDetails: {
    flex: 1,
  },
  teacherName: {
    ...typography.bodySmall,
    color: colors.themes.userProfile.primary,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  subject: {
    ...typography.caption,
    color: '#6B7280',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  statusEmoji: {
    fontSize: 16,
  },
  historyDetails: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    ...typography.bodySmall,
    color: '#6B7280',
    fontSize: 14,
  },
  detailValue: {
    ...typography.bodySmall,
    color: colors.themes.userProfile.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.subtitle,
    color: colors.themes.userProfile.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});
