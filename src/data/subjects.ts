import { imageLibrary } from "./site";

export type Subject = {
  slug: string;
  number: string;
  title: string;
  kicker: string;
  summary: string;
  description: string;
  duration: string;
  teacherSlugs: string[];
  image: string;
  alt: string;
  objectives: string[];
  syllabus: string[];
  methodology: string;
};

// DEMO: asignaturas ficticias para mostrar una primera versión completa del plan formativo.
export const subjects: Subject[] = [
  {
    slug: "pasarela-tecnica-desfile",
    number: "01",
    title: "Pasarela y técnica de desfile",
    kicker: "Movimiento, ritmo y presencia",
    summary:
      "Trabajo técnico de caminar, girar, marcar prendas y entender el ritmo de una pasarela contemporánea.",
    description:
      "La asignatura prepara al alumnado para comprender la pasarela como lenguaje: postura, intención, lectura de prenda, tempo musical y relación con el espacio.",
    duration: "18 horas demo",
    teacherSlugs: ["aitana-rivas"],
    image: imageLibrary.escuela,
    alt: "Modelo caminando en una pasarela con luz de estudio",
    objectives: [
      "Construir una caminata limpia, segura y adaptable.",
      "Entender giros, paradas, salidas y marcas escénicas.",
      "Trabajar presencia sin rigidez ni exageración."
    ],
    syllabus: [
      "Eje corporal, pisada y desplazamiento.",
      "Giros, finales de pasarela y lectura de prenda.",
      "Ritmo, música y coordinación grupal.",
      "Simulación de desfile y corrección individual."
    ],
    methodology:
      "Sesiones prácticas con corrección en directo, grabación breve y revisión de postura para detectar hábitos y ajustar el movimiento."
  },
  {
    slug: "posado-fotografico-editorial",
    number: "02",
    title: "Posado fotográfico editorial",
    kicker: "Cámara, gesto y narrativa",
    summary:
      "Técnica para trabajar delante de cámara con intención, variedad, naturalidad y lectura de luz.",
    description:
      "El posado se aborda como una conversación con el fotógrafo: dirección del rostro, manos, tensión justa, microgestos y coherencia con el concepto visual.",
    duration: "20 horas demo",
    teacherSlugs: ["mateo-salas"],
    image:
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1400&q=82",
    alt: "Sesión editorial con modelo mirando a cámara",
    objectives: [
      "Desarrollar recursos de pose sin automatismos.",
      "Comprender luz, encuadre y dirección fotográfica.",
      "Crear secuencias de imagen con continuidad visual."
    ],
    syllabus: [
      "Rostro, manos, hombros y líneas corporales.",
      "Posado de beauty, medio cuerpo y cuerpo entero.",
      "Trabajo con prendas, accesorios y movimiento.",
      "Revisión de contacto y selección de imágenes."
    ],
    methodology:
      "Práctica en set con referencias editoriales, dirección fotográfica y análisis de resultados al final de cada bloque."
  },
  {
    slug: "expresion-corporal-movimiento",
    number: "03",
    title: "Expresión corporal y movimiento",
    kicker: "Cuerpo consciente",
    summary:
      "Entrenamiento para liberar tensión, ganar coordinación y utilizar el cuerpo como herramienta expresiva.",
    description:
      "Una asignatura orientada a mejorar disponibilidad física, musicalidad, presencia escénica y capacidad de responder a indicaciones de dirección.",
    duration: "16 horas demo",
    teacherSlugs: ["ines-calderon"],
    image:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1400&q=82",
    alt: "Persona en movimiento dentro de un estudio fotográfico",
    objectives: [
      "Reconocer bloqueos posturales y corregirlos.",
      "Trabajar coordinación, respiración y control.",
      "Ampliar el vocabulario corporal para sesiones y pasarela."
    ],
    syllabus: [
      "Conciencia corporal y respiración.",
      "Trabajo de eje, peso y direcciones.",
      "Improvisación guiada para cámara.",
      "Movimiento con prendas y accesorios."
    ],
    methodology:
      "Ejercicios de estudio, improvisación progresiva y pequeñas piezas de movimiento aplicadas a sesiones fotográficas."
  },
  {
    slug: "interpretacion-camara",
    number: "04",
    title: "Interpretación ante cámara",
    kicker: "Intención y verdad",
    summary:
      "Recursos interpretativos para videobooks, campañas, self tapes y piezas audiovisuales de moda o imagen.",
    description:
      "El módulo trabaja la relación entre presencia, emoción contenida, escucha y cámara, sin convertir el modelaje en actuación sobreactuada.",
    duration: "14 horas demo",
    teacherSlugs: ["diego-varela"],
    image:
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1400&q=82",
    alt: "Retrato cinematográfico en estudio",
    objectives: [
      "Aprender a sostener cámara en video.",
      "Traducir indicaciones en intención visual.",
      "Preparar piezas breves de presentación."
    ],
    syllabus: [
      "Mirada, pausa y escucha.",
      "Presentación personal ante cámara.",
      "Dirección de escenas breves.",
      "Revisión técnica de self tapes."
    ],
    methodology:
      "Grabación de ejercicios cortos, corrección individual y pautas concretas para repetir fuera del aula."
  },
  {
    slug: "comunicacion-presencia",
    number: "05",
    title: "Comunicación y presencia profesional",
    kicker: "Hablar, presentarse, sostener",
    summary:
      "Preparación para entrevistas, castings, reuniones y presentaciones con seguridad y naturalidad.",
    description:
      "La imagen profesional también se comunica con voz, escucha y estructura. Este módulo trabaja cómo presentarse sin impostar y cómo sostener una conversación profesional.",
    duration: "12 horas demo",
    teacherSlugs: ["clara-montes", "noa-beltran"],
    image:
      "https://images.unsplash.com/photo-1512310604669-443f26c35f52?auto=format&fit=crop&w=1400&q=82",
    alt: "Retrato editorial en interior con gesto sereno",
    objectives: [
      "Construir una presentación personal clara.",
      "Ganar seguridad verbal y presencia en sala.",
      "Preparar respuestas para entrevistas y castings."
    ],
    syllabus: [
      "Voz, ritmo y escucha.",
      "Presentación de perfil y trayectoria.",
      "Comunicación en casting y reunión.",
      "Feedback y ajustes de discurso."
    ],
    methodology:
      "Dinámicas de role-play, grabación breve y revisión con pautas aplicables a situaciones profesionales."
  },
  {
    slug: "imagen-estilismo",
    number: "06",
    title: "Imagen, estilismo y lectura de prenda",
    kicker: "Criterio visual",
    summary:
      "Herramientas para entender proporciones, siluetas, color, moodboards y coherencia de imagen.",
    description:
      "La asignatura no busca uniformar estilos, sino ayudar a leer una propuesta visual y tomar decisiones coherentes con cada proyecto.",
    duration: "16 horas demo",
    teacherSlugs: ["valeria-prado"],
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=82",
    alt: "Detalle de estilismo editorial con abrigo y luz natural",
    objectives: [
      "Entender silueta, proporción y color.",
      "Leer moodboards y referencias de dirección de arte.",
      "Preparar cambios de estilismo para sesión o casting."
    ],
    syllabus: [
      "Fundamentos de estilismo aplicado a imagen.",
      "Armario base, casting looks y book.",
      "Relación entre prenda, pose y actitud.",
      "Moodboard y coherencia visual."
    ],
    methodology:
      "Análisis de referencias, pruebas de estilismo y ejercicios de composición personal con feedback profesional."
  },
  {
    slug: "maquillaje-piel-camara",
    number: "07",
    title: "Maquillaje, piel y cámara",
    kicker: "Preparación visible e invisible",
    summary:
      "Bases de cuidado, maquillaje natural para cámara y coordinación con equipos de belleza.",
    description:
      "Un módulo práctico para entender cómo se prepara la piel, cómo reacciona el maquillaje ante luz de estudio y cómo comunicarse con profesionales de beauty.",
    duration: "10 horas demo",
    teacherSlugs: ["marta-quesada"],
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=82",
    alt: "Mesa de maquillaje profesional con brochas y tonos naturales",
    objectives: [
      "Preparar piel y rostro para cámara.",
      "Distinguir maquillaje social y maquillaje editorial.",
      "Trabajar higiene, tiempos y comunicación en set."
    ],
    syllabus: [
      "Preparación de piel y luz.",
      "Maquillaje natural para castings.",
      "Correcciones básicas ante cámara.",
      "Relación con makeup artist en sesión."
    ],
    methodology:
      "Demostraciones, práctica guiada y checklist de preparación para sesiones, castings y pruebas de cámara."
  },
  {
    slug: "marca-personal-redes",
    number: "08",
    title: "Marca personal y redes sociales",
    kicker: "Presencia digital con criterio",
    summary:
      "Construcción de perfil, selección de imágenes, tono y presentación digital sin perder naturalidad.",
    description:
      "El módulo ayuda a ordenar la identidad digital de un perfil emergente: qué enseñar, cómo escribir, cuándo actualizar y cómo evitar una imagen dispersa.",
    duration: "12 horas demo",
    teacherSlugs: ["noa-beltran"],
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1400&q=82",
    alt: "Mesa creativa con portátil, referencias visuales y teléfono",
    objectives: [
      "Definir una presentación digital coherente.",
      "Seleccionar imágenes para portfolio y redes.",
      "Entender límites entre exposición personal y perfil profesional."
    ],
    syllabus: [
      "Bio, tono y estructura de perfil.",
      "Selección de imágenes y secuencia visual.",
      "Contacto profesional y mensajes de presentación.",
      "Plan de actualización sencillo."
    ],
    methodology:
      "Revisión de perfiles demo, creación de pautas editoriales y simulación de contacto profesional."
  },
  {
    slug: "protocolo-castings-produccion",
    number: "09",
    title: "Protocolo de castings y producción",
    kicker: "Cómo funciona el sector",
    summary:
      "Normas prácticas para moverse con profesionalidad en castings, pruebas, fittings y sesiones.",
    description:
      "Una guía realista sobre tiempos, documentación, trato, preparación, derechos de imagen básicos y comportamiento en entornos de producción.",
    duration: "12 horas demo",
    teacherSlugs: ["clara-montes", "aitana-rivas"],
    image: imageLibrary.backstage,
    alt: "Backstage de moda con prendas y equipo de producción",
    objectives: [
      "Entender el flujo de un casting o sesión.",
      "Preparar material, looks y documentación básica.",
      "Actuar con puntualidad, respeto y criterio profesional."
    ],
    syllabus: [
      "Casting, call sheet, fitting y set.",
      "Material de presentación y contacto.",
      "Uso de imagen y autorizaciones básicas.",
      "Simulación de dinámica profesional."
    ],
    methodology:
      "Trabajo con casos prácticos, simulaciones y checklist descargable en una futura fase del proyecto."
  },
  {
    slug: "bienestar-profesional-imagen",
    number: "10",
    title: "Bienestar aplicado al sector de la imagen",
    kicker: "Cuerpo, descanso y límites",
    summary:
      "Pautas de autocuidado, gestión de energía y límites profesionales dentro de un sector visualmente exigente.",
    description:
      "El módulo aborda hábitos sostenibles, preparación física razonable, descanso, límites y relación sana con la propia imagen.",
    duration: "10 horas demo",
    teacherSlugs: ["elena-sanabria"],
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=82",
    alt: "Persona estirando en un estudio con luz suave",
    objectives: [
      "Crear rutinas de preparación sin obsesión.",
      "Gestionar cansancio, nervios y exposición.",
      "Reconocer límites personales y profesionales."
    ],
    syllabus: [
      "Calentamiento, descanso y recuperación.",
      "Gestión de nervios antes de casting.",
      "Imagen corporal y conversación interna.",
      "Límites, trato y señales de alerta."
    ],
    methodology:
      "Sesiones prácticas y conversacionales con ejercicios sencillos para integrar antes y después de jornadas de imagen."
  }
];

export const getSubjectBySlug = (slug: string) =>
  subjects.find((subject) => subject.slug === slug);
