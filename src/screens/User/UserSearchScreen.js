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
          {/* Header con gradiente vibrante */}
          <View style={styles.filtersHeaderGradient}>
            <View style={styles.filtersHeader}>
              <View style={styles.filtersTitleContainer}>
                <View style={styles.filtersIconContainer}>
                  <MaterialIcons name="tune" size={20} color="white" />
                </View>
                <Text style={styles.filtersTitle}>Filtros Avanzados</Text>
              </View>
              <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
                <MaterialIcons name="refresh" size={18} color="white" />
                <Text style={styles.clearButtonText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.filtersContent}>
            {/* Primera fila - Especialidad y Institución */}
            <View style={styles.filtersRow}>
              <View style={styles.filterCard}>
                <View style={styles.filterHeader}>
                  <View style={styles.filterIconContainer}>
                    <MaterialIcons name="school" size={18} color="#00BCD4" />
                  </View>
                  <Text style={styles.filterLabel}>Materia</Text>
                </View>
                <View style={styles.dropdownContainer}>
                  <DropdownList 
                    options={["Todos", "Matemática", "Física", "Inglés", "Literatura", "Química", "Biología", "Historia", "Geografía", "Arte", "Dibujo", "Música", "Piano", "Francés", "Español", "Informática", "Programación", "Psicología", "Orientación", "Economía", "Contabilidad", "Filosofía", "Ética", "Educación Física", "Deportes"]} 
                    value={filtro} 
                    onChange={setFiltro}
                    placeholder="Seleccionar"
                  />
                </View>
              </View>
              
              <View style={styles.filterCard}>
                <View style={styles.filterHeader}>
                  <View style={styles.filterIconContainer}>
                    <MaterialIcons name="business" size={18} color="#8B5CF6" />
                  </View>
                  <Text style={styles.filterLabel}>Institución</Text>
                </View>
                <View style={styles.dropdownContainer}>
                  <DropdownList 
                    options={["Todas", "Escuela", "Colegio", "Universidad"]} 
                    value={tipoInstitucion} 
                    onChange={setTipoInstitucion}
                    placeholder="Tipo"
                  />
                </View>
              </View>
            </View>

            {/* Segunda fila - Horario y Provincia */}
            <View style={styles.filtersRow}>
              <View style={styles.filterCard}>
                <View style={styles.filterHeader}>
                  <View style={styles.filterIconContainer}>
                    <MaterialIcons name="schedule" size={18} color="#F59E0B" />
                  </View>
                  <Text style={styles.filterLabel}>Horario</Text>
                </View>
                <View style={styles.dropdownContainer}>
                  <DropdownList 
                    options={disponibilidadOptions} 
                    value={disponibilidad} 
                    onChange={setDisponibilidad}
                    placeholder="Disponibilidad"
                  />
                </View>
              </View>
              
              <View style={styles.filterCard}>
                <View style={styles.filterHeader}>
                  <View style={styles.filterIconContainer}>
                    <MaterialIcons name="place" size={18} color="#EF4444" />
                  </View>
                  <Text style={styles.filterLabel}>Provincia</Text>
                </View>
                <View style={styles.dropdownContainer}>
                  <DropdownList 
                    options={["Todas", ...getProvinces()]} 
                    value={provincia} 
                    onChange={handleProvinceSelect}
                    placeholder="Provincia"
                  />
                </View>
              </View>
            </View>

            {/* Tercera fila - Ciudad (solo si hay provincia seleccionada) */}
            {provincia !== 'Todas' && (
              <View style={styles.filtersRow}>
                <View style={styles.filterCard}>
                  <View style={styles.filterHeader}>
                    <View style={styles.filterIconContainer}>
                      <MaterialIcons name="location-city" size={18} color="#10B981" />
                    </View>
                    <Text style={styles.filterLabel}>Ciudad</Text>
                  </View>
                  <View style={styles.dropdownContainer}>
                    <DropdownList 
                      options={["Todas", ...getCitiesByProvince(provincia)]} 
                      value={ciudad} 
                      onChange={handleCitySelect}
                      placeholder="Ciudad"
                    />
                  </View>
                </View>
                <View style={styles.filterCard} />
              </View>
            )}
          </View>
        </Animated.View>
      )}

      <View style={styles.resultsSection}>
        <View style={styles.resultsHeader}>
          <View style={styles.resultsTitleContainer}>
            <View style={styles.resultsIconContainer}>
              <MaterialIcons name="search" size={20} color="white" />
            </View>
            <Text style={styles.resultsTitle}>
              {filtered.length} {filtered.length === 1 ? 'docente encontrado' : 'docentes encontrados'}
            </Text>
          </View>
          {filtered.length > 0 && (
            <TouchableOpacity onPress={toggleFilters} style={styles.toggleFiltersButton}>
              <MaterialIcons name="tune" size={18} color="#00BCD4" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <MaterialIcons name="search-off" size={40} color="#00BCD4" />
      </View>
      <Text style={styles.emptyTitle}>No se encontraron docentes</Text>
      <Text style={styles.emptySubtitle}>
        Intenta ajustar los filtros para encontrar más opciones
      </Text>
      <TouchableOpacity onPress={clearFilters} style={styles.emptyActionButton}>
        <MaterialIcons name="refresh" size={20} color="white" />
        <Text style={styles.emptyActionText}>Limpiar Filtros</Text>
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
    padding: spacing.lg,
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  welcomeSubtext: {
    ...typography.bodySmall,
    color: colors.themes.userSearch.textSecondary,
    fontSize: 13,
  },

  filtersSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    marginBottom: spacing.lg,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 188, 212, 0.2)',
    overflow: 'hidden',
  },
  filtersHeaderGradient: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filtersTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filtersIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  filtersTitle: {
    ...typography.subtitle,
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
    flex: 1,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexShrink: 0,
  },
  clearButtonText: {
    ...typography.caption,
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },
  filtersContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  filterCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 188, 212, 0.1)',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  filterIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 188, 212, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  filterLabel: {
    ...typography.caption,
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
    flex: 1,
  },
  dropdownContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 188, 212, 0.2)',
    overflow: 'hidden',
  },
  resultsSection: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    backgroundColor: 'rgba(0, 188, 212, 0.1)',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 188, 212, 0.2)',
  },
  resultsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultsIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  resultsTitle: {
    ...typography.subtitle,
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
    flex: 1,
  },
  toggleFiltersButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 188, 212, 0.3)',
    minWidth: 44,
    minHeight: 44,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  teachersList: {
    paddingBottom: spacing.xxl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 188, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(0, 188, 212, 0.2)',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyTitle: {
    ...typography.subtitle,
    color: '#00BCD4',
    marginBottom: spacing.sm,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
    maxWidth: 280,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: '#64748B',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.xl,
    maxWidth: 280,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BCD4',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 16,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyActionText: {
    ...typography.button,
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
});