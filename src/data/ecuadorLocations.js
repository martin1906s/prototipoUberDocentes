// Datos de provincias y ciudades de Ecuador
export const ecuadorData = {
  'Pichincha': ['Quito', 'Sangolquí', 'Cayambe', 'Machachi', 'Pedro Moncayo', 'Puerto Quito', 'Rumiñahui', 'San Miguel de los Bancos', 'Pedro Vicente Maldonado'],
  'Guayas': ['Guayaquil', 'Milagro', 'Daule', 'Samborondón', 'Durán', 'Naranjal', 'Yaguachi', 'Salitre', 'Nobol', 'Playas', 'General Villamil'],
  'Azuay': ['Cuenca', 'Gualaceo', 'Paute', 'Sigsig', 'Girón', 'San Fernando', 'Santa Isabel', 'Pucará', 'Oña', 'Chordeleg', 'El Pan', 'Sevilla de Oro'],
  'Manabí': ['Portoviejo', 'Manta', 'Montecristi', 'Jaramijó', 'Jipijapa', 'Pedernales', 'Puerto López', 'San Vicente', 'Santa Ana', 'Sucre', 'Tosagua', 'Veinticuatro de Mayo'],
  'El Oro': ['Machala', 'Arenillas', 'Atahualpa', 'Balsas', 'Chilla', 'El Guabo', 'Huaquillas', 'Las Lajas', 'Marcabelí', 'Pasaje', 'Piñas', 'Portovelo', 'Santa Rosa', 'Zaruma'],
  'Loja': ['Loja', 'Calvas', 'Catamayo', 'Celica', 'Chaguarpamba', 'Espíndola', 'Gonzanamá', 'Macará', 'Olmedo', 'Paltas', 'Pindal', 'Puyango', 'Quilanga', 'Saraguro', 'Sozoranga', 'Zapotillo'],
  'Tungurahua': ['Ambato', 'Baños de Agua Santa', 'Cevallos', 'Mocha', 'Patate', 'Pelileo', 'Píllaro', 'Quero', 'San Pedro de Pelileo', 'Santiago de Píllaro', 'Tisaleo'],
  'Chimborazo': ['Riobamba', 'Alausí', 'Chambo', 'Chunchi', 'Colta', 'Cumandá', 'Guamote', 'Guano', 'Pallatanga', 'Penipe', 'San Juan'],
  'Imbabura': ['Ibarra', 'Antonio Ante', 'Cotacachi', 'Otavalo', 'Pimampiro', 'San Miguel de Urcuquí'],
  'Santo Domingo de los Tsáchilas': ['Santo Domingo', 'La Concordia'],
  'Los Ríos': ['Babahoyo', 'Baba', 'Buena Fe', 'Mocache', 'Montalvo', 'Palenque', 'Pueblo Viejo', 'Quevedo', 'Quinsaloma', 'Urdaneta', 'Valencia', 'Ventanas', 'Vinces'],
  'Esmeraldas': ['Esmeraldas', 'Atacames', 'Eloy Alfaro', 'Muisne', 'Quinindé', 'Río Verde', 'San Lorenzo'],
  'Cotopaxi': ['Latacunga', 'La Maná', 'Pangua', 'Pujilí', 'Salcedo', 'Saquisilí', 'Sigchos'],
  'Carchi': ['Tulcán', 'Bolívar', 'Espejo', 'Mira', 'Montúfar', 'San Pedro de Huaca'],
  'Galápagos': ['Puerto Baquerizo Moreno', 'Isabela', 'Santa Cruz'],
  'Sucumbíos': ['Nueva Loja', 'Cascales', 'Cuyabeno', 'Gonzalo Pizarro', 'Lago Agrio', 'Putumayo', 'Shushufindi', 'Sucumbíos'],
  'Pastaza': ['Puyo', 'Arajuno', 'Mera', 'Santa Clara'],
  'Morona Santiago': ['Macas', 'Gualaquiza', 'Huamboya', 'Limón Indanza', 'Logroño', 'Pablo Sexto', 'Palora', 'San Juan Bosco', 'Santiago', 'Sucúa', 'Taisha', 'Tiwintza'],
  'Zamora Chinchipe': ['Zamora', 'Centinela del Cóndor', 'Chinchipe', 'El Pangui', 'Nangaritza', 'Palanda', 'Paquisha', 'Yacuambi', 'Yantzaza'],
  'Napo': ['Tena', 'Archidona', 'Carlos Julio Arosemena Tola', 'El Chaco', 'Quijos'],
  'Orellana': ['Coca', 'Aguarico', 'La Joya de los Sachas', 'Loreto']
};

export function getProvinces() {
  return Object.keys(ecuadorData);
}

export function getCitiesByProvince(province) {
  return ecuadorData[province] || [];
}

// Función para obtener la provincia de una ciudad
export function getProvinceByCity(city) {
  const cityLower = city.toLowerCase();
  for (const [province, cities] of Object.entries(ecuadorData)) {
    if (cities.some(c => c.toLowerCase() === cityLower)) {
      return province;
    }
  }
  return null;
}