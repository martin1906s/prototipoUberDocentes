import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import AppButton from '../../components/AppButton';
import TeacherCard from '../../components/TeacherCard';
import DropdownList from '../../components/DropdownList';
import OptionsMenu from '../../components/OptionsMenu';
import { MaterialIcons } from '@expo/vector-icons';
import { useStore } from '../../store/store';
import { colors, spacing, typography } from '../../theme/theme';
import { getProvinces, getCitiesByProvince, getProvinceByCity } from '../../data/ecuadorLocations';

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
  const [provincia, setProvincia] = useState('Todas');
  const [ciudad, setCiudad] = useState('Todas');
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
    setProvincia('Todas');
    setCiudad('Todas');
  };

  const handleProvinceSelect = (selectedProvince) => {
    setProvincia(selectedProvince);
    setCiudad('Todas'); // Limpiar ciudad cuando cambie la provincia
  };

  const handleCitySelect = (selectedCity) => {
    setCiudad(selectedCity);
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
    if (provincia !== 'Todas') {
      base = base.filter((t) => {
        const ubicacion = t.ubicacion || '';
        const provinciaDelDocente = getProvinceByCity(ubicacion);
        return provinciaDelDocente === provincia;
      });
    }
    if (ciudad !== 'Todas') {
      base = base.filter((t) => (t.ubicacion || '').toLowerCase() === ciudad.toLowerCase());
    }
    return base;
  }, [filtro, disponibilidad, tipoInstitucion, provincia, ciudad, state.teachers]);

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
            <Text style={styles.filtersTitle}>Filtros</Text>
            <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
              <MaterialIcons name="clear" size={16} color={colors.themes.userSearch.primary} />
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.filtersGrid}>
            {/* Primera fila - Especialidad y Institución */}
            <View style={styles.filtersRow}>
              <View style={styles.filterItem}>
                <View style={styles.filterHeader}>
                  <MaterialIcons name="school" size={16} color={colors.themes.userSearch.primary} />
                  <Text style={styles.filterLabel}>Especialidad</Text>
                </View>
                <DropdownList 
                  options={["Todos", "Matemática", "Física", "Inglés", "Literatura", "Química", "Biología", "Historia", "Geografía", "Arte", "Dibujo", "Música", "Piano", "Francés", "Español", "Informática", "Programación", "Psicología", "Orientación", "Economía", "Contabilidad", "Filosofía", "Ética", "Educación Física", "Deportes"]} 
                  value={filtro} 
                  onChange={setFiltro}
                  placeholder="Seleccionar"
                />
              </View>
              
              <View style={styles.filterItem}>
                <View style={styles.filterHeader}>
                  <MaterialIcons name="business" size={16} color={colors.themes.userSearch.primary} />
                  <Text style={styles.filterLabel}>Institución</Text>
                </View>
                <DropdownList 
                  options={["Todas", "Escuela", "Colegio", "Universidad"]} 
                  value={tipoInstitucion} 
                  onChange={setTipoInstitucion}
                  placeholder="Tipo"
                />
              </View>
            </View>

            {/* Segunda fila - Horario y Provincia */}
            <View style={styles.filtersRow}>
              <View style={styles.filterItem}>
                <View style={styles.filterHeader}>
                  <MaterialIcons name="schedule" size={16} color={colors.themes.userSearch.primary} />
                  <Text style={styles.filterLabel}>Horario</Text>
                </View>
                <DropdownList 
                  options={disponibilidadOptions} 
                  value={disponibilidad} 
                  onChange={setDisponibilidad}
                  placeholder="Disponibilidad"
                />
              </View>
              
              <View style={styles.filterItem}>
                <View style={styles.filterHeader}>
                  <MaterialIcons name="place" size={16} color={colors.themes.userSearch.primary} />
                  <Text style={styles.filterLabel}>Provincia</Text>
                </View>
                <DropdownList 
                  options={["Todas", ...getProvinces()]} 
                  value={provincia} 
                  onChange={handleProvinceSelect}
                  placeholder="Provincia"
                />
              </View>
            </View>

            {/* Tercera fila - Ciudad (solo si hay provincia seleccionada) */}
            {provincia !== 'Todas' && (
              <View style={styles.filtersRow}>
                <View style={styles.filterItem}>
                  <View style={styles.filterHeader}>
                    <MaterialIcons name="location-city" size={16} color={colors.themes.userSearch.primary} />
                    <Text style={styles.filterLabel}>Ciudad</Text>
                  </View>
                  <DropdownList 
                    options={["Todas", ...getCitiesByProvince(provincia)]} 
                    value={ciudad} 
                    onChange={handleCitySelect}
                    placeholder="Ciudad"
                  />
                </View>
                <View style={styles.filterItem} />
              </View>
            )}
          </View>
        </Animated.View>
      )}

      <View style={styles.resultsSection}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {filtered.length} {filtered.length === 1 ? 'docente encontrado' : 'docentes encontrados'}
          </Text>
          {filtered.length > 0 && (
            <AppButton
              iconOnly
              leftIcon="sort"
              onPress={toggleFilters}
              variant="outline"
              size="md"
              style={styles.sortButton}
            />
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
      <AppButton
        iconOnly
        leftIcon="refresh"
        onPress={clearFilters}
        variant="primary"
        size="md"
        style={styles.emptyActionButton}
      />
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
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(8, 145, 178, 0.12)',
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  filtersTitle: {
    ...typography.subtitle,
    color: colors.themes.userSearch.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 145, 178, 0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(8, 145, 178, 0.2)',
  },
  clearButtonText: {
    ...typography.caption,
    color: colors.themes.userSearch.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: spacing.xs,
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
    gap: spacing.md,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  filterItem: {
    flex: 1,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  filterLabel: {
    ...typography.caption,
    color: colors.themes.userSearch.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: spacing.xs,
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