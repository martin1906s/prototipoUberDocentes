import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import GradientBackground from '../../components/GradientBackground';

import TeacherCard from '../../components/TeacherCard';
import DropdownList from '../../components/DropdownList';
import OptionsMenu from '../../components/OptionsMenu';
import { MaterialIcons } from '@expo/vector-icons';
import { useStore } from '../../store/store';
import { colors, spacing, typography } from '../../theme/theme';

const disponibilidadOptions = ["Todas", "Mañana", "Tarde", "Noche"];

function Highlight({ text, query }) {
  if (!query) return <Text style={{ color: colors.neutral900 }}>{text}</Text>;
  const q = query.toLowerCase();
  const parts = text.split(new RegExp(`(${query})`, 'i'));
  return (
    <Text style={{ color: colors.neutral900 }}>
      {parts.map((part, i) => (
        <Text key={i} style={{ color: part.toLowerCase() === q ? '#FDE68A' : colors.neutral900, fontWeight: part.toLowerCase() === q ? '800' : 'normal' }}>
          {part}
        </Text>
      ))}
    </Text>
  );
}

export default function UserSearchScreen({ navigation }) {
  const { state } = useStore();

  const [filtro, setFiltro] = useState('Todos');
  const [disponibilidad, setDisponibilidad] = useState('Todas');
  const [tipoInstitucion, setTipoInstitucion] = useState('Todas');
  const [showFilters, setShowFilters] = useState(true);
  const [filtersAnimation] = useState(new Animated.Value(1));



  const toggleFilters = () => {
    const newShowFilters = !showFilters;
    setShowFilters(newShowFilters);
    
    Animated.timing(filtersAnimation, {
      toValue: newShowFilters ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const clearFilters = () => {
    setFiltro('Todos');
    setDisponibilidad('Todas');
    setTipoInstitucion('Todas');
  };

  const filtered = useMemo(() => {
    let base = state.teachers;
    if (filtro !== 'Todos') {
      base = base.filter((t) => (t.especialidades || []).includes(filtro));
    }
    if (disponibilidad !== 'Todas') {
      base = base.filter((t) => (t.disponibilidad || '').toLowerCase().includes(disponibilidad.toLowerCase()));
    }
    if (tipoInstitucion !== 'Todas') {
      base = base.filter((t) => (t.tipoInstitucion || '').toLowerCase() === tipoInstitucion.toLowerCase());
    }
    return base;
  }, [filtro, disponibilidad, tipoInstitucion, state.teachers]);

  const renderItem = ({ item }) => {
    // Transformar los datos del store al formato esperado por TeacherCard
    const teacher = {
      id: item.id,
      name: item.nombre,
      subject: item.especialidades?.[0] || 'General',
      hourlyRate: item.precioHora || 20, // Precio real del docente
      description: item.descripcion || 'Docente experimentado con amplia trayectoria en educación.',
      skills: Array.isArray(item.especialidades) ? item.especialidades : ['Matemáticas', 'Ciencias'],
      location: item.ubicacion || 'Quito, Ecuador',
      tipoInstitucion: item.tipoInstitucion || 'colegio',
      nivelEstudiantil: Array.isArray(item.nivelEstudiantil) ? item.nivelEstudiantil : ['Secundaria'],
      available: true, // Todos los docentes están disponibles por defecto
    };

    return (
      <TeacherCard
        teacher={teacher}
        onPress={() => navigation.navigate('UserTeacherDetail', { teacherId: item.id })}
      />
    );
  };

  const ListHeaderComponent = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.welcomeSection}>
            <View style={styles.welcomeIconContainer}>
              <Text style={styles.welcomeEmoji}>🔍</Text>
            </View>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>Filtrar Docentes</Text>
              <Text style={styles.welcomeSubtext}>Encuentra el profesor perfecto usando filtros</Text>
            </View>
          </View>
          <OptionsMenu navigation={navigation} theme="userSearch" />
        </View>
      </View>



      {showFilters && (
        <Animated.View 
          style={[
            styles.filtersSection,
            {
              opacity: filtersAnimation,
              transform: [{
                translateY: filtersAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              }],
            }
          ]}
        >
                     <View style={styles.filtersHeader}>
             <Text style={styles.filtersTitle}>Filtros de Búsqueda</Text>
           </View>
          
          <View style={styles.filtersGrid}>
            {/* Filtro 1: Especialidades */}
            <View style={styles.filterRow}>
              <View style={styles.filterGroup}>
                <View style={styles.filterLabelContainer}>
                  <View style={styles.filterIconContainer}>
                    <Text style={styles.filterEmoji}>📚</Text>
                  </View>
                  <Text style={styles.filterLabel}>Especialidades</Text>
                </View>
                <DropdownList 
                  options={["Todos", "Matemática", "Física", "Inglés", "Literatura", "Química", "Biología", "Historia", "Geografía", "Arte", "Dibujo", "Música", "Piano", "Francés", "Español", "Informática", "Programación", "Psicología", "Orientación", "Economía", "Contabilidad", "Filosofía", "Ética", "Educación Física", "Deportes"]} 
                  value={filtro} 
                  onChange={setFiltro}
                  placeholder="Seleccionar especialidad"
                />
              </View>
            </View>



            {/* Filtro 3: Tipo de Institución */}
            <View style={styles.filterRow}>
              <View style={styles.filterGroup}>
                <View style={styles.filterLabelContainer}>
                  <View style={styles.filterIconContainer}>
                    <Text style={styles.filterEmoji}>🏫</Text>
                  </View>
                  <Text style={styles.filterLabel}>Tipo de Institución</Text>
                </View>
                <DropdownList 
                  options={["Todas", "Escuela", "Colegio", "Universidad"]} 
                  value={tipoInstitucion} 
                  onChange={setTipoInstitucion}
                  placeholder="Seleccionar institución"
                />
              </View>
            </View>

            {/* Filtro 4: Disponibilidad */}
            <View style={styles.filterRow}>
              <View style={styles.filterGroup}>
                <View style={styles.filterLabelContainer}>
                  <View style={styles.filterIconContainer}>
                    <Text style={styles.filterEmoji}>⏰</Text>
                  </View>
                  <Text style={styles.filterLabel}>Disponibilidad</Text>
                </View>
                <DropdownList 
                  options={disponibilidadOptions} 
                  value={disponibilidad} 
                  onChange={setDisponibilidad}
                  placeholder="Seleccionar horario"
                />
              </View>
            </View>


          </View>
        </Animated.View>
      )}

      <View style={styles.resultsSection}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {filtered.length} {filtered.length === 1 ? 'docente encontrado' : 'docentes encontrados'}
          </Text>
          {filtered.length > 0 && (
            <TouchableOpacity style={styles.sortButton} onPress={toggleFilters}>
              <MaterialIcons name="sort" size={24} color="#0891B2" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyEmoji}>🔍</Text>
      </View>
      <Text style={styles.emptyTitle}>No se encontraron docentes</Text>
      <Text style={styles.emptySubtitle}>
        Intenta ajustar los filtros para encontrar más opciones
      </Text>
      <TouchableOpacity style={styles.emptyActionButton} onPress={clearFilters}>
        <MaterialIcons name="refresh" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <GradientBackground variant="white" theme="userSearch">
      <FlatList
        data={filtered}
        renderItem={renderItem}
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
    marginBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  welcomeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.themes.userSearch.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  welcomeEmoji: {
    fontSize: 24,
    color: 'white',
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    ...typography.subtitle,
    color: colors.themes.userSearch.primary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  welcomeSubtext: {
    ...typography.bodySmall,
    color: colors.themes.userSearch.textSecondary,
    fontSize: 14,
  },

  filtersSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(8, 145, 178, 0.15)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(8, 145, 178, 0.3)',
  },
  filtersHeader: {
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(8, 145, 178, 0.1)',
  },
  filtersTitle: {
    ...typography.subtitle,
    color: colors.themes.userSearch.primary,
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(8, 145, 178, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  clearFiltersButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.themes.userSearch.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    minWidth: 40,
    minHeight: 40,
  },
  filtersGrid: {
    gap: spacing.sm,
  },
  filterRow: {
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(8, 145, 178, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  filterGroup: {
    marginBottom: 0,
  },
  filterLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  filterIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(8, 145, 178, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(8, 145, 178, 0.15)',
  },
  filterEmoji: {
    fontSize: 14,
  },
  filterLabel: {
    ...typography.body,
    color: colors.themes.userSearch.primary,
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(8, 145, 178, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  resultsSection: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resultsTitle: {
    ...typography.subtitle,
    color: colors.themes.userSearch.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  sortButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.themes.userSearch.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.themes.userSearch.primary,
    minWidth: 40,
    minHeight: 40,
  },
  teachersList: {
    paddingBottom: spacing.xxl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.themes.userSearch.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyTitle: {
    ...typography.subtitle,
    color: '#0891B2',
    marginBottom: spacing.sm,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: '#475569',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  emptyActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0891B2',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    minWidth: 56,
    minHeight: 56,
  },
});