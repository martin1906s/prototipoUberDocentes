import React, { createContext, useContext, useMemo, useReducer } from 'react';

// Roles: 'usuario' | 'docente' | 'admin'

const initialState = {
  currentRole: null,
  userProfile: null, // { nombre, email, telefono }
  teacherProfile: null, // { nombre, email, telefono, especialidades: string[], experiencia, preguntaSeguridad, respuestaSeguridad }
  teacherSchedule: null, // { Lunes: string[], Martes: string[], ... }
  currentTeacher: null, // Docente actual en proceso de registro
  teachers: [
    {
      id: 't1',
      nombre: 'Ana García',
      especialidades: ['Matemática', 'Física'],
      experiencia: '5 años enseñando nivel secundario',
      disponibilidad: 'Lunes a Viernes',
      ubicacion: 'Quito',
      tipoInstitucion: 'colegio',
      nivelEstudiantil: ['Secundaria', 'Bachillerato'],
      descripcion: 'Docente especializada en matemáticas y física con amplia experiencia en preparación para exámenes universitarios.',
      precioHora: 25,
      isPaid: true, // Ya pagó la comisión
      horarios: {
        'Lunes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Martes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Miércoles': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Jueves': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Viernes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Sábado': [],
        'Domingo': []
      }
    },
    {
      id: 't2',
      nombre: 'Luis Pérez',
      especialidades: ['Inglés', 'Literatura'],
      experiencia: '8 años en academias',
      disponibilidad: 'Fines de semana',
      ubicacion: 'Guayaquil',
      tipoInstitucion: 'universidad',
      nivelEstudiantil: ['Universidad', 'Adultos'],
      descripcion: 'Profesor de inglés nativo con certificación internacional y experiencia en preparación para exámenes TOEFL.',
      precioHora: 30,
      isPaid: true, // Ya pagó la comisión
      horarios: {
        'Lunes': [],
        'Martes': [],
        'Miércoles': [],
        'Jueves': [],
        'Viernes': [],
        'Sábado': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
        'Domingo': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
      }
    },
    {
      id: 't3',
      nombre: 'María Rodríguez',
      especialidades: ['Química', 'Biología'],
      experiencia: '3 años en laboratorios',
      disponibilidad: 'Mañana y tarde',
      ubicacion: 'Quito',
      tipoInstitucion: 'universidad',
      nivelEstudiantil: ['Universidad', 'Postgrado'],
      descripcion: 'Química farmacéutica con experiencia en investigación y docencia universitaria.',
      precioHora: 22,
      isPaid: true, // Ya pagó la comisión
      horarios: {
        'Lunes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
        'Martes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
        'Miércoles': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
        'Jueves': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
        'Viernes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
        'Sábado': ['09:00', '10:00', '14:00', '15:00'],
        'Domingo': []
      }
    },
    {
      id: 't4',
      nombre: 'Carlos Mendoza',
      especialidades: ['Historia', 'Geografía'],
      experiencia: '10 años en colegios',
      disponibilidad: 'Lunes a Jueves',
      ubicacion: 'Guayaquil',
      tipoInstitucion: 'colegio',
      nivelEstudiantil: ['Primaria', 'Secundaria'],
      descripcion: 'Historiador con maestría en educación y especialización en historia latinoamericana.',
      precioHora: 20,
      isPaid: true, // Ya pagó la comisión
      horarios: {
        'Lunes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Martes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Miércoles': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Jueves': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Viernes': [],
        'Sábado': [],
        'Domingo': []
      }
    },
    {
      id: 't5',
      nombre: 'Sofia Herrera',
      especialidades: ['Arte', 'Dibujo'],
      experiencia: '6 años como artista',
      disponibilidad: 'Fines de semana',
      isPaid: true, // Ya pagó la comisión
      ubicacion: 'Cuenca',
      tipoInstitucion: 'escuela',
      nivelEstudiantil: ['Primaria', 'Secundaria', 'Adultos'],
      descripcion: 'Artista plástica con experiencia en técnicas tradicionales y digitales.',
      precioHora: 18,
      horarios: {
        'Lunes': [],
        'Martes': [],
        'Miércoles': [],
        'Jueves': [],
        'Viernes': [],
        'Sábado': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        'Domingo': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
      }
    },
    {
      id: 't6',
      nombre: 'Roberto Silva',
      especialidades: ['Música', 'Piano'],
      experiencia: '12 años como músico',
      disponibilidad: 'Tarde y noche',
      ubicacion: 'Ambato',
      descripcion: 'Pianista profesional con formación clásica y experiencia en composición.',
      precioHora: 35,
      horarios: {
        'Lunes': ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        'Martes': ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        'Miércoles': ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        'Jueves': ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        'Viernes': ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        'Sábado': ['14:00', '15:00', '16:00', '17:00'],
        'Domingo': []
      }
    },
    {
      id: 't7',
      nombre: 'Elena Vargas',
      especialidades: ['Francés', 'Español'],
      experiencia: '4 años en institutos',
      disponibilidad: 'Lunes a Viernes',
      ubicacion: 'Loja',
      descripcion: 'Lingüista con certificación DELF y experiencia en enseñanza de idiomas.',
      precioHora: 28,
      horarios: {
        'Lunes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
        'Martes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
        'Miércoles': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
        'Jueves': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
        'Viernes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
        'Sábado': [],
        'Domingo': []
      }
    },
    {
      id: 't8',
      nombre: 'Diego Morales',
      especialidades: ['Informática', 'Programación'],
      experiencia: '7 años en desarrollo',
      disponibilidad: 'Fines de semana',
      ubicacion: 'Machala',
      descripcion: 'Ingeniero en sistemas con experiencia en desarrollo web y móvil.',
      precioHora: 40,
      horarios: {
        'Lunes': [],
        'Martes': [],
        'Miércoles': [],
        'Jueves': [],
        'Viernes': [],
        'Sábado': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
        'Domingo': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
      }
    },
    {
      id: 't9',
      nombre: 'Patricia Cruz',
      especialidades: ['Psicología', 'Orientación'],
      experiencia: '9 años clínica',
      disponibilidad: 'Mañana',
      ubicacion: 'Portoviejo',
      descripcion: 'Psicóloga clínica especializada en terapia cognitivo-conductual.',
      precioHora: 32,
      horarios: {
        'Lunes': ['08:00', '09:00', '10:00', '11:00'],
        'Martes': ['08:00', '09:00', '10:00', '11:00'],
        'Miércoles': ['08:00', '09:00', '10:00', '11:00'],
        'Jueves': ['08:00', '09:00', '10:00', '11:00'],
        'Viernes': ['08:00', '09:00', '10:00', '11:00'],
        'Sábado': ['08:00', '09:00', '10:00'],
        'Domingo': []
      }
    },
    {
      id: 't10',
      nombre: 'Fernando Torres',
      especialidades: ['Economía', 'Contabilidad'],
      experiencia: '11 años en empresas',
      disponibilidad: 'Noche',
      ubicacion: 'Riobamba',
      descripcion: 'Economista con MBA y experiencia en consultoría financiera.',
      precioHora: 38,
      horarios: {
        'Lunes': ['18:00', '19:00', '20:00'],
        'Martes': ['18:00', '19:00', '20:00'],
        'Miércoles': ['18:00', '19:00', '20:00'],
        'Jueves': ['18:00', '19:00', '20:00'],
        'Viernes': ['18:00', '19:00', '20:00'],
        'Sábado': ['18:00', '19:00'],
        'Domingo': []
      }
    },
    {
      id: 't11',
      nombre: 'Carmen Jiménez',
      especialidades: ['Filosofía', 'Ética'],
      experiencia: '15 años universidad',
      disponibilidad: 'Lunes a Miércoles',
      ubicacion: 'Ibarra',
      descripcion: 'Filósofa con doctorado y experiencia en investigación académica.',
      precioHora: 26,
      horarios: {
        'Lunes': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        'Martes': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        'Miércoles': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        'Jueves': [],
        'Viernes': [],
        'Sábado': [],
        'Domingo': []
      }
    },
    {
      id: 't12',
      nombre: 'Andrés López',
      especialidades: ['Educación Física', 'Deportes'],
      experiencia: '8 años en colegios',
      disponibilidad: 'Tarde',
      ubicacion: 'Esmeraldas',
      descripcion: 'Profesor de educación física con certificación en entrenamiento deportivo.',
      precioHora: 24,
      horarios: {
        'Lunes': ['14:00', '15:00', '16:00', '17:00'],
        'Martes': ['14:00', '15:00', '16:00', '17:00'],
        'Miércoles': ['14:00', '15:00', '16:00', '17:00'],
        'Jueves': ['14:00', '15:00', '16:00', '17:00'],
        'Viernes': ['14:00', '15:00', '16:00', '17:00'],
        'Sábado': ['14:00', '15:00', '16:00'],
        'Domingo': []
      }
    },
    {
      id: 't13',
      nombre: 'Gabriela Mendoza',
      especialidades: ['Biología', 'Ciencias Naturales'],
      experiencia: '5 años en laboratorios',
      disponibilidad: 'Lunes a Viernes',
      ubicacion: 'Sangolquí',
      tipoInstitucion: 'colegio',
      nivelEstudiantil: ['Secundaria', 'Bachillerato'],
      descripcion: 'Bióloga con especialización en ciencias naturales y experiencia en laboratorios.',
      precioHora: 23,
      isPaid: true,
      horarios: {
        'Lunes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Martes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Miércoles': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Jueves': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Viernes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Sábado': [],
        'Domingo': []
      }
    },
    {
      id: 't14',
      nombre: 'Ricardo Vásquez',
      especialidades: ['Matemática', 'Estadística'],
      experiencia: '8 años en universidades',
      disponibilidad: 'Tarde y noche',
      ubicacion: 'Milagro',
      tipoInstitucion: 'universidad',
      nivelEstudiantil: ['Universidad', 'Postgrado'],
      descripcion: 'Matemático con maestría en estadística y experiencia en investigación.',
      precioHora: 35,
      isPaid: true,
      horarios: {
        'Lunes': ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        'Martes': ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        'Miércoles': ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        'Jueves': ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        'Viernes': ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        'Sábado': ['14:00', '15:00', '16:00', '17:00'],
        'Domingo': []
      }
    },
    {
      id: 't15',
      nombre: 'Valentina Castro',
      especialidades: ['Literatura', 'Redacción'],
      experiencia: '6 años en academias',
      disponibilidad: 'Mañana',
      ubicacion: 'Gualaceo',
      tipoInstitucion: 'colegio',
      nivelEstudiantil: ['Secundaria', 'Bachillerato'],
      descripcion: 'Licenciada en literatura con experiencia en técnicas de redacción y análisis.',
      precioHora: 21,
      isPaid: true,
      horarios: {
        'Lunes': ['08:00', '09:00', '10:00', '11:00'],
        'Martes': ['08:00', '09:00', '10:00', '11:00'],
        'Miércoles': ['08:00', '09:00', '10:00', '11:00'],
        'Jueves': ['08:00', '09:00', '10:00', '11:00'],
        'Viernes': ['08:00', '09:00', '10:00', '11:00'],
        'Sábado': ['08:00', '09:00', '10:00'],
        'Domingo': []
      }
    },
    {
      id: 't16',
      nombre: 'Miguel Herrera',
      especialidades: ['Física', 'Matemática'],
      experiencia: '10 años en colegios',
      disponibilidad: 'Lunes a Jueves',
      ubicacion: 'Daule',
      tipoInstitucion: 'colegio',
      nivelEstudiantil: ['Secundaria', 'Bachillerato'],
      descripcion: 'Físico con experiencia en preparación para exámenes de admisión universitaria.',
      precioHora: 28,
      isPaid: true,
      horarios: {
        'Lunes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Martes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Miércoles': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Jueves': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Viernes': [],
        'Sábado': [],
        'Domingo': []
      }
    },
    {
      id: 't17',
      nombre: 'Isabel Ramírez',
      especialidades: ['Química', 'Física'],
      experiencia: '7 años en laboratorios',
      disponibilidad: 'Fines de semana',
      ubicacion: 'Samborondón',
      tipoInstitucion: 'universidad',
      nivelEstudiantil: ['Universidad', 'Postgrado'],
      descripcion: 'Química con doctorado y experiencia en investigación científica.',
      precioHora: 42,
      isPaid: true,
      horarios: {
        'Lunes': [],
        'Martes': [],
        'Miércoles': [],
        'Jueves': [],
        'Viernes': [],
        'Sábado': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
        'Domingo': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
      }
    },
    {
      id: 't18',
      nombre: 'Carlos Benítez',
      especialidades: ['Historia', 'Geografía'],
      experiencia: '12 años en colegios',
      disponibilidad: 'Tarde',
      ubicacion: 'Paute',
      tipoInstitucion: 'colegio',
      nivelEstudiantil: ['Primaria', 'Secundaria'],
      descripcion: 'Historiador con especialización en geografía del Ecuador y América Latina.',
      precioHora: 22,
      isPaid: true,
      horarios: {
        'Lunes': ['14:00', '15:00', '16:00', '17:00'],
        'Martes': ['14:00', '15:00', '16:00', '17:00'],
        'Miércoles': ['14:00', '15:00', '16:00', '17:00'],
        'Jueves': ['14:00', '15:00', '16:00', '17:00'],
        'Viernes': ['14:00', '15:00', '16:00', '17:00'],
        'Sábado': ['14:00', '15:00', '16:00'],
        'Domingo': []
      }
    },
    {
      id: 't19',
      nombre: 'Lucía Fernández',
      especialidades: ['Inglés', 'Francés'],
      experiencia: '9 años en institutos',
      disponibilidad: 'Mañana y tarde',
      ubicacion: 'Jipijapa',
      tipoInstitucion: 'universidad',
      nivelEstudiantil: ['Universidad', 'Adultos'],
      descripcion: 'Lingüista con certificaciones internacionales en inglés y francés.',
      precioHora: 33,
      isPaid: true,
      horarios: {
        'Lunes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Martes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Miércoles': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Jueves': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Viernes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Sábado': ['09:00', '10:00', '14:00', '15:00'],
        'Domingo': []
      }
    },
    {
      id: 't20',
      nombre: 'Oscar Delgado',
      especialidades: ['Programación', 'Informática'],
      experiencia: '11 años en desarrollo',
      disponibilidad: 'Noche',
      ubicacion: 'Pedernales',
      tipoInstitucion: 'universidad',
      nivelEstudiantil: ['Universidad', 'Postgrado'],
      descripcion: 'Ingeniero en sistemas con experiencia en desarrollo de software y aplicaciones móviles.',
      precioHora: 45,
      isPaid: true,
      horarios: {
        'Lunes': ['18:00', '19:00', '20:00', '21:00'],
        'Martes': ['18:00', '19:00', '20:00', '21:00'],
        'Miércoles': ['18:00', '19:00', '20:00', '21:00'],
        'Jueves': ['18:00', '19:00', '20:00', '21:00'],
        'Viernes': ['18:00', '19:00', '20:00', '21:00'],
        'Sábado': ['18:00', '19:00', '20:00'],
        'Domingo': []
      }
    },
    {
      id: 't21',
      nombre: 'Adriana Morales',
      especialidades: ['Psicología', 'Orientación'],
      experiencia: '8 años clínica',
      disponibilidad: 'Lunes a Viernes',
      ubicacion: 'Huaquillas',
      tipoInstitucion: 'colegio',
      nivelEstudiantil: ['Secundaria', 'Bachillerato'],
      descripcion: 'Psicóloga educativa especializada en orientación vocacional y desarrollo adolescente.',
      precioHora: 29,
      isPaid: true,
      horarios: {
        'Lunes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Martes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Miércoles': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Jueves': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Viernes': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
        'Sábado': [],
        'Domingo': []
      }
    },
    {
      id: 't22',
      nombre: 'Javier Rojas',
      especialidades: ['Economía', 'Contabilidad'],
      experiencia: '13 años en empresas',
      disponibilidad: 'Fines de semana',
      ubicacion: 'Cevallos',
      tipoInstitucion: 'universidad',
      nivelEstudiantil: ['Universidad', 'Postgrado'],
      descripcion: 'Economista con MBA y experiencia en consultoría empresarial y análisis financiero.',
      precioHora: 40,
      isPaid: true,
      horarios: {
        'Lunes': [],
        'Martes': [],
        'Miércoles': [],
        'Jueves': [],
        'Viernes': [],
        'Sábado': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
        'Domingo': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
      }
    },
    {
      id: 't23',
      nombre: 'Monica Salazar',
      especialidades: ['Arte', 'Dibujo'],
      experiencia: '7 años como artista',
      disponibilidad: 'Tarde',
      ubicacion: 'Chambo',
      tipoInstitucion: 'escuela',
      nivelEstudiantil: ['Primaria', 'Secundaria'],
      descripcion: 'Artista visual con experiencia en técnicas de dibujo y pintura para niños y jóvenes.',
      precioHora: 19,
      isPaid: true,
      horarios: {
        'Lunes': ['14:00', '15:00', '16:00', '17:00'],
        'Martes': ['14:00', '15:00', '16:00', '17:00'],
        'Miércoles': ['14:00', '15:00', '16:00', '17:00'],
        'Jueves': ['14:00', '15:00', '16:00', '17:00'],
        'Viernes': ['14:00', '15:00', '16:00', '17:00'],
        'Sábado': ['14:00', '15:00', '16:00'],
        'Domingo': []
      }
    },
    {
      id: 't24',
      nombre: 'Roberto Paz',
      especialidades: ['Música', 'Guitarra'],
      experiencia: '14 años como músico',
      disponibilidad: 'Noche',
      ubicacion: 'Cotacachi',
      tipoInstitucion: 'escuela',
      nivelEstudiantil: ['Primaria', 'Secundaria', 'Adultos'],
      descripcion: 'Guitarrista profesional con experiencia en música clásica y popular.',
      precioHora: 32,
      isPaid: true,
      horarios: {
        'Lunes': ['18:00', '19:00', '20:00'],
        'Martes': ['18:00', '19:00', '20:00'],
        'Miércoles': ['18:00', '19:00', '20:00'],
        'Jueves': ['18:00', '19:00', '20:00'],
        'Viernes': ['18:00', '19:00', '20:00'],
        'Sábado': ['18:00', '19:00'],
        'Domingo': []
      }
    },
    {
      id: 't25',
      nombre: 'Patricia Vega',
      especialidades: ['Biología', 'Ciencias Naturales'],
      experiencia: '6 años en laboratorios',
      disponibilidad: 'Mañana',
      ubicacion: 'Otavalo',
      tipoInstitucion: 'colegio',
      nivelEstudiantil: ['Secundaria', 'Bachillerato'],
      descripcion: 'Bióloga con especialización en ciencias ambientales y conservación.',
      precioHora: 24,
      isPaid: true,
      horarios: {
        'Lunes': ['08:00', '09:00', '10:00', '11:00'],
        'Martes': ['08:00', '09:00', '10:00', '11:00'],
        'Miércoles': ['08:00', '09:00', '10:00', '11:00'],
        'Jueves': ['08:00', '09:00', '10:00', '11:00'],
        'Viernes': ['08:00', '09:00', '10:00', '11:00'],
        'Sábado': ['08:00', '09:00', '10:00'],
        'Domingo': []
      }
    },
  ],
  proposals: [
    // ejemplos iniciales para cuando el docente entra
    {
      id: 'p_demo1',
      teacherId: 't1',
      user: { nombre: 'Carlos Ruiz', email: 'carlos@example.com', telefono: '+593 99 911 1222' },
      mensaje: 'Clases de Matemática para mi hijo los sábados.',
      estado: 'aceptada',
    },
    {
      id: 'p_demo2',
      teacherId: 't2',
      user: { nombre: 'María López', email: 'maria@example.com', telefono: '+593 98 833 3444' },
      mensaje: 'Inglés conversacional 2 veces por semana.',
      estado: 'pendiente',
    },
    {
      id: 'p_demo3',
      teacherId: 't3',
      user: { nombre: 'Ana Martínez', email: 'ana@example.com', telefono: '+593 987 654 321' },
      mensaje: 'Necesito ayuda con química orgánica para la universidad.',
      estado: 'aceptada',
    },
    {
      id: 'p_demo4',
      teacherId: 't4',
      user: { nombre: 'Luis González', email: 'luis@example.com', telefono: '+593 912 345 678' },
      mensaje: 'Clases de historia del Ecuador para preparar examen.',
      estado: 'rechazada',
    },
    {
      id: 'p_demo5',
      teacherId: 't5',
      user: { nombre: 'Sofia Herrera', email: 'sofia@example.com', telefono: '+593 923 456 789' },
      mensaje: 'Quiero aprender técnicas de dibujo y pintura.',
      estado: 'pendiente',
    },
    {
      id: 'p_demo6',
      teacherId: 't6',
      user: { nombre: 'Roberto Silva', email: 'roberto@example.com', telefono: '+593 934 567 890' },
      mensaje: 'Clases de piano para mi hija de 8 años.',
      estado: 'aceptada',
    },
    {
      id: 'p_demo7',
      teacherId: 't7',
      user: { nombre: 'Elena Vargas', email: 'elena@example.com', telefono: '+593 945 678 901' },
      mensaje: 'Necesito prepararme para el examen DELF de francés.',
      estado: 'pendiente',
    },
    {
      id: 'p_demo8',
      teacherId: 't8',
      user: { nombre: 'Diego Morales', email: 'diego@example.com', telefono: '+593 956 789 012' },
      mensaje: 'Quiero aprender programación en Python desde cero.',
      estado: 'aceptada',
    },
    {
      id: 'p_demo9',
      teacherId: 't9',
      user: { nombre: 'Patricia Cruz', email: 'patricia@example.com', telefono: '+593 967 890 123' },
      mensaje: 'Busco orientación psicológica para mi hijo adolescente.',
      estado: 'rechazada',
    },
    {
      id: 'p_demo10',
      teacherId: 't10',
      user: { nombre: 'Fernando Torres', email: 'fernando@example.com', telefono: '+593 978 901 234' },
      mensaje: 'Clases de contabilidad para mi negocio.',
      estado: 'pendiente',
    },
    {
      id: 'p_demo11',
      teacherId: 't11',
      user: { nombre: 'Carmen Jiménez', email: 'carmen@example.com', telefono: '+593 989 012 345' },
      mensaje: 'Estudio de filosofía para preparar tesis de grado.',
      estado: 'aceptada',
    },
    {
      id: 'p_demo12',
      teacherId: 't12',
      user: { nombre: 'Andrés López', email: 'andres@example.com', telefono: '+593 990 123 456' },
      mensaje: 'Entrenamiento personal para mejorar condición física.',
      estado: 'pendiente',
    },
    {
      id: 'p_demo13',
      teacherId: 't1',
      user: { nombre: 'Isabel Moreno', email: 'isabel@example.com', telefono: '+593 901 234 567' },
      mensaje: 'Clases de física para preparar examen de admisión.',
      estado: 'aceptada',
    },
    {
      id: 'p_demo14',
      teacherId: 't2',
      user: { nombre: 'Miguel Ángel', email: 'miguel@example.com', telefono: '+593 912 345 678' },
      mensaje: 'Inglés para negocios y presentaciones.',
      estado: 'rechazada',
    },
    {
      id: 'p_demo15',
      teacherId: 't3',
      user: { nombre: 'Valentina Ruiz', email: 'valentina@example.com', telefono: '+593 923 456 789' },
      mensaje: 'Biología celular para estudiantes de medicina.',
      estado: 'pendiente',
    },
  ],
};

const StoreContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, currentRole: action.payload };
    case 'SAVE_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'SAVE_TEACHER_PROFILE':
      return { ...state, teacherProfile: action.payload };
    case 'UPDATE_TEACHER_SCHEDULE':
      return { ...state, teacherSchedule: action.payload };
    case 'CREATE_PROPOSAL': {
      const newProposal = { id: `p_${Date.now()}`, estado: 'pendiente', ...action.payload };
      return { ...state, proposals: [newProposal, ...state.proposals] };
    }
    case 'UPDATE_PROPOSAL_STATUS': {
      const { proposalId, status } = action.payload;
      return {
        ...state,
        proposals: state.proposals.map((p) => (p.id === proposalId ? { ...p, estado: status } : p)),
      };
    }
    case 'UPDATE_TEACHER_PAYMENT_STATUS': {
      const { teacherId, isPaid } = action.payload;
      return {
        ...state,
        teachers: state.teachers.map((t) => (t.id === teacherId ? { ...t, isPaid } : t)),
        currentTeacher: state.currentTeacher && state.currentTeacher.id === teacherId 
          ? { ...state.currentTeacher, isPaid } 
          : state.currentTeacher,
      };
    }
    case 'SET_CURRENT_TEACHER': {
      return {
        ...state,
        currentTeacher: action.payload,
      };
    }
    case 'CLEAR_TEACHER_DATA':
      return {
        ...state,
        teacherProfile: null,
        teacherSchedule: null,
        currentTeacher: null,
      };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      setRole: (role) => dispatch({ type: 'SET_ROLE', payload: role }),
      saveUserProfile: (profile) => dispatch({ type: 'SAVE_USER_PROFILE', payload: profile }),
      saveTeacherProfile: (profile) => dispatch({ type: 'SAVE_TEACHER_PROFILE', payload: profile }),
      updateTeacherSchedule: (schedule) => dispatch({ type: 'UPDATE_TEACHER_SCHEDULE', payload: schedule }),
      createProposal: (payload) => dispatch({ type: 'CREATE_PROPOSAL', payload }),
      updateProposalStatus: (proposalId, status) =>
        dispatch({ type: 'UPDATE_PROPOSAL_STATUS', payload: { proposalId, status } }),
      updateTeacherPaymentStatus: (teacherId, isPaid) =>
        dispatch({ type: 'UPDATE_TEACHER_PAYMENT_STATUS', payload: { teacherId, isPaid } }),
      setCurrentTeacher: (teacher) => dispatch({ type: 'SET_CURRENT_TEACHER', payload: teacher }),
      clearTeacherData: () => dispatch({ type: 'CLEAR_TEACHER_DATA' }),
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider');
  return ctx;
}


