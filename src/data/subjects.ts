export type Subject = {
  slug: string;
  number: string;
  title: string;
  kicker: string;
  summary: string;
  description: string;
  hours: number;
  duration: string;
  teacherSlugs: string[];
  image: string;
  alt: string;
  objectives: string[];
  syllabus: string[];
  activities: string[];
};

// Contenido del programa académico facilitado por ALMA.
export const academicProgram = {
  "duration": "6 meses",
  "trainingHours": 240,
  "practiceHours": 20,
  "totalHours": 260,
  "intro": "ALMA propone una formación orientada a desarrollar perfiles versátiles para moda, imagen, fotografía, contenido digital, publicidad, castings y eventos. El programa combina técnica, práctica, comunicación, conocimiento del sector y preparación para el entorno profesional.",
  "approach": "Las materias se organizan en bloques especializados. Pasarela y fotografía se conciben como disciplinas transversales, con práctica recurrente para consolidar técnica, presencia y adaptación a distintos encargos.",
  "itinerary": "formación (240 h) → prácticas profesionales (20 h) → posible continuidad hacia oportunidades de agencia o empleo. Las prácticas, representación o trabajos posteriores dependen de acuerdos, disponibilidad, requisitos y encargos; no implican contratación garantizada.",
  "planningNote": "La distribución por semanas y sesiones se concretará en el calendario académico. Las horas reflejan la planificación de referencia de cada asignatura.",
  "detailNote": "Cada ficha recoge finalidad, contenidos propuestos, actividades prácticas y resultados esperados. La concreción de ejercicios, evaluación y materiales deberá revisarse con cada docente antes de la impartición.",
  "sections": [
    {
      "title": "Metodología formativa",
      "description": "La metodología combina explicación guiada, demostración profesional, práctica individual, trabajo en equipo, simulaciones de encargos y revisión de resultados. El objetivo es aplicar conceptos en situaciones similares a las del sector.",
      "items": [
        "Aprendizaje práctico: pasarela, sesiones fotográficas, grabaciones, castings simulados, preparación de looks y análisis de casos.",
        "Feedback profesional: observaciones concretas sobre técnica, presencia, comunicación, preparación y actitud.",
        "Trabajo transversal: conexión entre pasarela, fotografía, estilismo, maquillaje, interpretación y contenido digital.",
        "Preparación para encargos: briefings, puntualidad, presentación, comunicación y seguimiento de instrucciones.",
        "Responsabilidad: respeto, seguridad, privacidad, consentimiento, derechos de imagen y límites profesionales."
      ]
    },
    {
      "title": "Evaluación y seguimiento",
      "description": "Como propuesta, cada docente puede combinar observación continua y ejercicios prácticos relacionados con los objetivos de su asignatura. Se valorará el progreso y la aplicación de competencias, no solo el resultado estético final.",
      "items": [
        "Asistencia, puntualidad, preparación y participación.",
        "Evolución técnica individual y aplicación de correcciones.",
        "Realización de ejercicios prácticos o simulaciones.",
        "Actitud profesional, colaboración y respeto por el equipo.",
        "Entrega de materiales o tareas cuando proceda."
      ]
    },
    {
      "title": "Prácticas profesionales: 20 horas",
      "description": "Tras las 240 horas formativas, se prevén 20 horas de prácticas profesionales en un entorno adecuado. Su organización, objetivos, supervisión, cobertura, documentación y condiciones deberán acordarse previamente con la entidad colaboradora y ajustarse a la normativa aplicable.",
      "items": [
        "Aplicación de competencias en un contexto práctico.",
        "Conocimiento de la dinámica de un equipo y sus tiempos.",
        "Puntualidad, comunicación, preparación y seguimiento de instrucciones.",
        "Reflexión final sobre competencias adquiridas y áreas de mejora."
      ]
    },
    {
      "title": "Continuidad profesional y agencia",
      "description": "Tras la formación y, cuando proceda, las prácticas, el alumnado podrá valorar oportunidades gestionadas por ALMA Agencia en función de su perfil, preparación, disponibilidad, requisitos del cliente y existencia de encargos adecuados. La formación no garantiza representación ni contratación; cualquier relación con la agencia se formalizará de forma independiente.",
      "items": []
    },
    {
      "title": "Organización del programa",
      "description": "Este apartado presenta el programa académico de ALMA. El contenido de las sesiones, el calendario, los criterios de evaluación, los materiales y las condiciones de las prácticas se concretarán con el equipo docente.",
      "items": []
    }
  ]
};

export const subjects: Subject[] = [
  {
    "slug": "pasarela-tecnica-desfile",
    "number": "01",
    "title": "Pasarela, Desfile y Coreografía",
    "kicker": "Programa académico",
    "summary": "Técnica de pasarela, seguridad escénica y comprensión del funcionamiento de un desfile, desde la preparación individual hasta la salida final.",
    "description": "Técnica de pasarela, seguridad escénica y comprensión del funcionamiento de un desfile, desde la preparación individual hasta la salida final.",
    "hours": 40,
    "duration": "40 horas",
    "teacherSlugs": [
      "alejandro-fernandez"
    ],
    "image": "/assets/images/alma/runway.jpg",
    "alt": "Imagen editorial de ALMA para Pasarela, Desfile y Coreografía",
    "objectives": [
      "Caminar con control, naturalidad y seguridad.",
      "Ejecutar poses y giros al ritmo requerido.",
      "Seguir coreografías y coordinarse con otros modelos.",
      "Conocer normas básicas de backstage."
    ],
    "syllabus": [
      "Postura y alineación corporal: hombros, cuello, brazos, manos y eje.",
      "Caminata: ritmo, longitud del paso, apoyos, estabilidad y fluidez.",
      "Mirada, expresión, presencia escénica y proyección ante público y cámara.",
      "Giros, paradas, poses, cambios de dirección, entradas y salidas.",
      "Adaptación a prendas, calzado, música y concepto creativo.",
      "Lectura del tempo, marcas en el suelo, esperas y coordinación con el equipo.",
      "Coreografías, formaciones, cruces, relevos y prevención de choques.",
      "Trabajo individual y grupal; escucha de instrucciones y corrección técnica.",
      "Backstage, orden de salida, vestuario, cambios rápidos y puntualidad.",
      "Ensayo de desfile o simulación profesional y evaluación práctica."
    ],
    "activities": [
      "Caminata en línea y control postural.",
      "Giros y poses con ritmos distintos.",
      "Entradas, cruces y salidas en grupo.",
      "Simulación de casting y desfile dirigido."
    ]
  },
  {
    "slug": "posado-fotografico-editorial",
    "number": "02",
    "title": "Fotografía de Moda y Fotopose",
    "kicker": "Programa académico",
    "summary": "Desenvolverse ante la cámara y crear imágenes expresivas y adecuadas para moda, publicidad, retrato y fotografía editorial.",
    "description": "Desenvolverse ante la cámara y crear imágenes expresivas y adecuadas para moda, publicidad, retrato y fotografía editorial.",
    "hours": 35,
    "duration": "35 horas",
    "teacherSlugs": [
      "paco-alacid"
    ],
    "image": "/assets/images/alma/subject-posado.jpg",
    "alt": "Imagen editorial de ALMA para Fotografía de Moda y Fotopose",
    "objectives": [
      "Variar poses sin perder naturalidad.",
      "Aplicar indicaciones del fotógrafo.",
      "Adaptarse a estilos y objetivos comerciales.",
      "Identificar imágenes que transmiten mejor el concepto."
    ],
    "syllabus": [
      "Lenguaje visual: encuadre, plano, composición, perspectiva y punto de vista.",
      "Luz natural y artificial, dirección, sombras, contraste y volumen.",
      "Relación entre modelo, fotógrafo, estilismo, maquillaje y concepto creativo.",
      "Posado de cuerpo entero, medio cuerpo, retrato, belleza, editorial y publicidad.",
      "Uso de manos, brazos, cuello, hombros, piernas, mirada y expresión facial.",
      "Microposes, transiciones, continuidad del movimiento y variedad de registros.",
      "Lectura de referencias visuales y secuencias de poses.",
      "Adaptación de energía y expresión al objetivo de la sesión o producto.",
      "Comunicación en set, repetición de tomas y respuesta a indicaciones.",
      "Selección inicial de imágenes y análisis de fortalezas y mejoras."
    ],
    "activities": [
      "Sesiones de retrato y cuerpo entero.",
      "Poses basadas en referencias editoriales.",
      "Cambios rápidos de expresión y registro.",
      "Revisión de imágenes con feedback."
    ]
  },
  {
    "slug": "fotografia-book-profesional-ecommerce",
    "number": "03",
    "title": "Fotografía, Book Profesional y E-commerce",
    "kicker": "Programa académico",
    "summary": "Entender cómo se construye un book útil para agencias y clientes y cómo se trabaja en sesiones comerciales y de catálogo.",
    "description": "Entender cómo se construye un book útil para agencias y clientes y cómo se trabaja en sesiones comerciales y de catálogo.",
    "hours": 25,
    "duration": "25 horas",
    "teacherSlugs": [
      "alex-de-frutos"
    ],
    "image": "/assets/images/alma/agency-editorial.jpg",
    "alt": "Imagen editorial de ALMA para Fotografía, Book Profesional y E-commerce",
    "objectives": [
      "Identificar el material necesario para presentarse.",
      "Prepararse para book y e-commerce.",
      "Diferenciar imagen editorial, comercial y catálogo.",
      "Organizar un portfolio inicial coherente."
    ],
    "syllabus": [
      "Función del book y adaptación a perfil y objetivos profesionales.",
      "Selección de imágenes: variedad, coherencia, calidad y adecuación al mercado.",
      "Diferencias entre polaroids/digitals, retrato, editorial, belleza, comercial y catálogo.",
      "Preparación de sesión: referencias, vestuario, piel, uñas, cabello y puntualidad.",
      "Dirección de modelo, ritmo, cambios de look y aprovechamiento del tiempo.",
      "E-commerce: consistencia, repetición, poses funcionales y presentación de prendas.",
      "Cómo mostrar el ajuste y los detalles de una prenda sin distraer del producto.",
      "Selección, revisión, edición básica, formatos y entrega.",
      "Organización de archivos, copias y portfolio.",
      "Uso responsable de imágenes y respeto de autorizaciones."
    ],
    "activities": [
      "Diseño de una selección inicial de portfolio.",
      "Simulación de catálogo con cambios de prenda.",
      "Selección de imágenes según distintos encargos.",
      "Checklist para preparar una sesión."
    ]
  },
  {
    "slug": "imagen-estilismo",
    "number": "04",
    "title": "Imagen Personal, Estilismo y Personal Shopper",
    "kicker": "Programa académico",
    "summary": "Construir una imagen cuidada y versátil y comprender el estilismo como herramienta de comunicación personal y profesional.",
    "description": "Construir una imagen cuidada y versátil y comprender el estilismo como herramienta de comunicación personal y profesional.",
    "hours": 25,
    "duration": "25 horas",
    "teacherSlugs": [
      "maru-ortega"
    ],
    "image": "/assets/images/alma/subject-estilismo.jpg",
    "alt": "Imagen editorial de ALMA para Imagen Personal, Estilismo y Personal Shopper",
    "objectives": [
      "Elegir vestuario coherente con el encargo.",
      "Preparar looks con criterio estético y funcional.",
      "Presentarse de forma cuidada ante clientes.",
      "Explicar las decisiones de estilismo."
    ],
    "syllabus": [
      "Imagen personal: apariencia, actitud, lenguaje corporal y coherencia.",
      "Análisis de estilo, objetivos, personalidad y necesidades.",
      "Proporciones, siluetas, volúmenes, líneas y equilibrio visual.",
      "Color en vestuario: armonías, contraste y combinaciones.",
      "Prendas esenciales, fondo de armario y selección de looks.",
      "Estilismo para casting, pasarela, fotografía, eventos, publicidad y entornos corporativos.",
      "Complementos, calzado, cuidado de prendas y preparación de conjuntos.",
      "Códigos de vestimenta, protocolo y adaptación a marca o cliente.",
      "Compra consciente: necesidades, presupuesto, versatilidad y selección.",
      "Marca personal: transmitir profesionalidad sin perder identidad."
    ],
    "activities": [
      "Crear looks para contextos profesionales distintos.",
      "Seleccionar prendas a partir de un briefing.",
      "Preparar kit de vestuario para una jornada.",
      "Presentar una propuesta de estilismo."
    ]
  },
  {
    "slug": "marca-personal-redes",
    "number": "05",
    "title": "Redes Sociales, Influencer y Creación de Contenido",
    "kicker": "Programa académico",
    "summary": "Usar las redes como escaparate profesional, desarrollar contenido coherente y entender las colaboraciones con marcas.",
    "description": "Usar las redes como escaparate profesional, desarrollar contenido coherente y entender las colaboraciones con marcas.",
    "hours": 25,
    "duration": "25 horas",
    "teacherSlugs": [
      "carlos-paya"
    ],
    "image": "/assets/images/alma/subject-redes.jpg",
    "alt": "Imagen editorial de ALMA para Redes Sociales, Influencer y Creación de Contenido",
    "objectives": [
      "Presentar un perfil digital coherente.",
      "Producir contenido sencillo con medios accesibles.",
      "Preparar una colaboración comercial.",
      "Interpretar métricas sin prometer contrataciones."
    ],
    "syllabus": [
      "Plataformas y diferencias de formato, audiencia y objetivo.",
      "Identidad digital, posicionamiento, tono y propuesta de valor.",
      "Ideas, guiones breves, hooks, narrativa y llamadas a la acción.",
      "Grabación móvil: encuadre, luz, sonido, estabilidad y presencia.",
      "Edición básica, subtítulos, ritmo, portadas y adaptación por plataforma.",
      "Planificación editorial, frecuencia sostenible y calendario.",
      "Tendencias y formatos sin perder identidad ni criterio.",
      "Comunidad, comentarios, mensajes, límites y reputación digital.",
      "Colaboraciones: briefing, entregables, plazos, revisiones y comunicación.",
      "Métricas: alcance, visualizaciones, retención, interacción y mejora.",
      "Transparencia comercial, publicidad identificable y uso responsable del contenido."
    ],
    "activities": [
      "Crear biografía y presentación de perfil profesional.",
      "Grabar una pieza de presentación y otra de producto.",
      "Planificar dos semanas de contenido.",
      "Interpretar métricas y proponer mejoras."
    ]
  },
  {
    "slug": "casting-interpretacion-audiovisual",
    "number": "06",
    "title": "Casting, Interpretación y Audiovisual",
    "kicker": "Programa académico",
    "summary": "Preparar al alumnado para castings y pruebas audiovisuales con capacidad de adaptación y comprensión del proceso de selección.",
    "description": "Preparar al alumnado para castings y pruebas audiovisuales con capacidad de adaptación y comprensión del proceso de selección.",
    "hours": 25,
    "duration": "25 horas",
    "teacherSlugs": [
      "barbara-barone"
    ],
    "image": "/assets/images/alma/subject-camara.jpg",
    "alt": "Imagen editorial de ALMA para Casting, Interpretación y Audiovisual",
    "objectives": [
      "Preparar un self-tape correcto.",
      "Seguir instrucciones y responder a cambios.",
      "Presentarse a un casting profesionalmente.",
      "Pedir aclaraciones sobre imagen, condiciones o remuneración."
    ],
    "syllabus": [
      "Tipos de casting: publicidad, ficción, moda y contenido digital.",
      "Lectura de convocatoria, requisitos, perfil, instrucciones y plazos.",
      "Presentación personal y preparación del material solicitado.",
      "Self-tape: encuadre, luz, sonido, fondo, continuidad y envío.",
      "Interpretación breve, escucha, intención, naturalidad y reacción.",
      "Improvisación guiada y respuesta a cambios de dirección.",
      "Continuidad, marcas, repetición de tomas y trabajo con cámara.",
      "Relación profesional con casting y equipo de producción.",
      "Gestión de nervios, rechazo, espera y conducta profesional.",
      "Lectura de condiciones y detección de solicitudes inadecuadas."
    ],
    "activities": [
      "Simular una convocatoria completa.",
      "Grabar y revisar un self-tape.",
      "Interpretar una escena con indicaciones diferentes.",
      "Ejercicios de improvisación y escucha activa."
    ]
  },
  {
    "slug": "interpretacion-camara",
    "number": "07",
    "title": "Interpretación ante Cámara, Comunicación y Oratoria",
    "kicker": "Programa académico",
    "summary": "Mejorar la comunicación verbal y no verbal y expresarse con naturalidad ante cámara, en presentaciones y frente a público.",
    "description": "Mejorar la comunicación verbal y no verbal y expresarse con naturalidad ante cámara, en presentaciones y frente a público.",
    "hours": 20,
    "duration": "20 horas",
    "teacherSlugs": [
      "sergio-villanueva"
    ],
    "image": "/assets/images/alma/subject-comunicacion.jpg",
    "alt": "Imagen editorial de ALMA para Interpretación ante Cámara, Comunicación y Oratoria",
    "objectives": [
      "Comunicar con claridad y estructura.",
      "Presentarse con seguridad y naturalidad.",
      "Controlar voz y lenguaje corporal básicos.",
      "Responder profesionalmente en cámara y eventos."
    ],
    "syllabus": [
      "Respiración, voz, articulación, dicción, ritmo, volumen y pausas.",
      "Lenguaje corporal, postura, mirada, gestos y uso del espacio.",
      "Estructura de presentación: apertura, mensaje y cierre.",
      "Presentación personal, entrevistas y respuestas a preguntas.",
      "Interpretación ante cámara: escucha, intención, objetivos y reacción.",
      "Naturalidad, concentración y gestión de la tensión escénica.",
      "Improvisación y adaptación al interlocutor.",
      "Comunicación en eventos y atención a asistentes.",
      "Recibir indicaciones, repetir tomas y mantener continuidad.",
      "Claridad, escucha y adecuación del mensaje a distintas audiencias."
    ],
    "activities": [
      "Presentación personal de 30 y 60 segundos.",
      "Ejercicios de dicción y proyección vocal.",
      "Grabación de intervención y autoevaluación.",
      "Simulación de entrevista y atención a asistentes."
    ]
  },
  {
    "slug": "diseno-moda-alta-costura-fittings",
    "number": "08",
    "title": "Diseño, Moda, Alta Costura y Fittings",
    "kicker": "Programa académico",
    "summary": "Conocer el proceso creativo de una colección y la preparación de prendas y modelos para fittings, desfiles y presentaciones.",
    "description": "Conocer el proceso creativo de una colección y la preparación de prendas y modelos para fittings, desfiles y presentaciones.",
    "hours": 10,
    "duration": "10 horas",
    "teacherSlugs": [
      "maria-jose-ortiz"
    ],
    "image": "/assets/images/alma/backstage.jpg",
    "alt": "Imagen editorial de ALMA para Diseño, Moda, Alta Costura y Fittings",
    "objectives": [
      "Comprender el papel del modelo en el diseño.",
      "Participar ordenadamente en un fitting.",
      "Cuidar prendas y seguir indicaciones del equipo."
    ],
    "syllabus": [
      "Proceso de diseño: concepto, referencias, colección y público objetivo.",
      "Comprensión de la intención del diseñador y la propuesta creativa.",
      "Fittings: preparación, orden, ajustes y comunicación.",
      "Respeto por prendas, materiales, acabados y piezas delicadas.",
      "Cómo moverse y presentar una prenda para destacar su diseño.",
      "Coordinación entre diseño, modelo, estilismo, maquillaje y backstage.",
      "Cambios de vestuario, cuidado y devolución ordenada.",
      "Actitud profesional en talleres, presentaciones y desfiles."
    ],
    "activities": [
      "Simular un fitting con checklist de prendas y ajustes.",
      "Presentar una prenda siguiendo indicaciones.",
      "Preparar vestuario para un desfile."
    ]
  },
  {
    "slug": "maquillaje-piel-camara",
    "number": "09",
    "title": "Maquillaje, Higiene y Cuidado Personal",
    "kicker": "Programa académico",
    "summary": "Adquirir rutinas de higiene y cuidado y conocer principios de maquillaje aplicados a imagen, fotografía y trabajos profesionales.",
    "description": "Adquirir rutinas de higiene y cuidado y conocer principios de maquillaje aplicados a imagen, fotografía y trabajos profesionales.",
    "hours": 15,
    "duration": "15 horas",
    "teacherSlugs": [
      "melani-anton"
    ],
    "image": "/assets/images/alma/subject-maquillaje.jpg",
    "alt": "Imagen editorial de ALMA para Maquillaje, Higiene y Cuidado Personal",
    "objectives": [
      "Aplicar hábitos básicos de higiene y cuidado.",
      "Comprender qué maquillaje conviene según el encargo.",
      "Prepararse y coordinarse con el equipo.",
      "Usar productos de forma ordenada y responsable."
    ],
    "syllabus": [
      "Higiene de manos, herramientas, brochas, productos y superficies.",
      "Preparación básica de la piel y hábitos de cuidado personal.",
      "Necesidades de maquillaje según piel, luz, cámara y contexto.",
      "Maquillaje natural y correctivo para fotografía y presentaciones.",
      "Diferencias entre maquillaje social, belleza, editorial y cámara.",
      "Control visual de brillos y tonos según luz y objetivo.",
      "Lectura de referencias, selección de productos y orden de aplicación.",
      "Retoques durante sesión y conservación higiénica del material.",
      "Coordinación con peluquería, estilismo, fotografía y dirección.",
      "Comunicación de sensibilidades o alergias antes de usar productos."
    ],
    "activities": [
      "Preparar higiénicamente una estación.",
      "Crear un look natural para fotografía.",
      "Comparar resultados con distintas luces.",
      "Elaborar kit básico y checklist de preparación."
    ]
  },
  {
    "slug": "marketing-branding-estrategia-digital",
    "number": "10",
    "title": "Marketing, Branding y Estrategia Digital",
    "kicker": "Programa académico",
    "summary": "Introducir fundamentos de marketing y marca personal para comunicar una propuesta de valor clara y profesional.",
    "description": "Introducir fundamentos de marketing y marca personal para comunicar una propuesta de valor clara y profesional.",
    "hours": 10,
    "duration": "10 horas",
    "teacherSlugs": [
      "pedro-albaladejo"
    ],
    "image": "/assets/images/alma/subject-redes.jpg",
    "alt": "Imagen editorial de ALMA para Marketing, Branding y Estrategia Digital",
    "objectives": [
      "Explicar qué aporta y qué trabajos busca.",
      "Entender necesidades básicas de una marca.",
      "Presentar imagen profesional coherente.",
      "Valorar acciones de comunicación con criterios básicos."
    ],
    "syllabus": [
      "Marketing, marca, público objetivo y posicionamiento.",
      "Identidad visual, reputación, mensaje y experiencia de marca.",
      "Propuesta de valor personal: fortalezas, especialidad y diferenciación.",
      "Coherencia entre book, redes, presentación, actitud y comunicación.",
      "Fundamentos de estrategia digital y presencia online.",
      "Lectura de briefings y objetivos de campaña.",
      "Introducción a captación, contacto y seguimiento profesional.",
      "Indicadores básicos para evaluar comunicación y resultados.",
      "Comunicación comercial, transparencia y reputación.",
      "Relación entre marca personal y oportunidades profesionales."
    ],
    "activities": [
      "Redactar una propuesta de valor.",
      "Analizar una campaña y su público.",
      "Crear un mini-briefing para colaboración.",
      "Revisar coherencia de perfil digital y portfolio."
    ]
  },
  {
    "slug": "protocolo-castings-produccion",
    "number": "11",
    "title": "Contratos, Derechos de Imagen, Representación y Protocolo",
    "kicker": "Programa académico",
    "summary": "Comprender condiciones de trabajo, conocer derechos y actuar con criterio en relaciones profesionales.",
    "description": "Comprender condiciones de trabajo, conocer derechos y actuar con criterio en relaciones profesionales.",
    "hours": 10,
    "duration": "10 horas",
    "teacherSlugs": [
      "carmina-boronat"
    ],
    "image": "/assets/images/alma/derechos-imagen.jpg",
    "alt": "Imagen editorial de ALMA para Contratos, Derechos de Imagen, Representación y Protocolo",
    "objectives": [
      "Identificar condiciones esenciales de una oferta.",
      "Comprender autorizaciones de imagen.",
      "Distinguir papel de escuela, agencia y cliente.",
      "Saber cuándo solicitar asesoramiento."
    ],
    "syllabus": [
      "Diferencias entre formación, prácticas, representación y contratación.",
      "Lectura de presupuestos, contratos, autorizaciones y condiciones.",
      "Derechos de imagen: finalidad, medios, duración, territorio y límites.",
      "Exclusividad, duración, comisiones, gastos y terminación de acuerdos.",
      "Remuneración, horarios, desplazamientos, cancelaciones y entregables.",
      "Colaboraciones remuneradas, intercambios y documentación de condiciones.",
      "Alertas: pagos opacos, promesas garantizadas, presión o cláusulas ambiguas.",
      "Protección de datos, privacidad y uso de fotografías.",
      "Protocolo: puntualidad, comunicación, vestuario, trato y confidencialidad.",
      "Pedir aclaraciones y conservar copia de documentos."
    ],
    "activities": [
      "Leer cláusulas de un contrato ficticio.",
      "Detectar alertas en una oferta.",
      "Preparar preguntas antes de aceptar un encargo.",
      "Simular una comunicación para aclarar condiciones."
    ]
  }
];

export const getSubjectBySlug = (slug: string) => subjects.find((subject) => subject.slug === slug);
