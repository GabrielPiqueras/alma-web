import { founder, imageLibrary } from "./site";

export type Teacher = {
  slug: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  alt: string;
  quote: string;
  bio: string;
  experience: string[];
  subjectSlugs: string[];
  social?: string;
  isFounder?: boolean;
};

// DEMO: perfiles docentes ficticios. Sustituir por equipo real cuando esté disponible.
export const teachers: Teacher[] = [
  {
    slug: "clara-montes",
    name: founder.name,
    role: founder.role,
    specialty: "Dirección académica, presencia y carrera",
    image: founder.image,
    alt: "Retrato editorial de la fundadora demo de ALMA",
    quote: "La presencia se entrena cuando dejamos de copiar gestos y empezamos a entender intención.",
    bio: founder.bio,
    experience: [
      "Acompañamiento de perfiles emergentes en books, castings y sesiones editoriales.",
      "Dirección de procesos formativos vinculados a imagen, comunicación y desarrollo de talento.",
      "Coordinación demo de metodología ALMA y relación con empresas colaboradoras."
    ],
    subjectSlugs: ["comunicacion-presencia", "protocolo-castings-produccion"],
    social: "@claramontes.demo",
    isFounder: true
  },
  {
    slug: "aitana-rivas",
    name: "Aitana Rivas",
    role: "Coach de pasarela",
    specialty: "Desfile, postura y dirección de movimiento",
    image: imageLibrary.teacherAitana,
    alt: "Retrato demo de Aitana Rivas",
    quote: "Una buena caminata no busca impresionar; busca sostener una prenda con claridad.",
    bio:
      "Aitana trabaja desde hace años en formación de pasarela para perfiles editoriales y comerciales. Su método combina técnica, precisión y una lectura muy actual del cuerpo en movimiento.",
    experience: [
      "Dirección de ensayos de desfile y presentaciones de colección.",
      "Preparación de perfiles para castings de moda y sesiones de lookbook.",
      "Trabajo de postura, ritmo y seguridad corporal."
    ],
    subjectSlugs: ["pasarela-tecnica-desfile", "protocolo-castings-produccion"],
    social: "@aitanarivas.demo"
  },
  {
    slug: "mateo-salas",
    name: "Mateo Salas",
    role: "Fotógrafo editorial",
    specialty: "Posado, luz y narrativa fotográfica",
    image: imageLibrary.teacherMateo,
    alt: "Retrato demo de Mateo Salas",
    quote: "La cámara no necesita más gestos; necesita mejores decisiones.",
    bio:
      "Mateo desarrolla campañas, books y editoriales de moda con una mirada sobria y contemporánea. En ALMA enseña a entender la cámara como una herramienta de comunicación.",
    experience: [
      "Producción de books y editoriales para perfiles emergentes.",
      "Dirección de set, selección de contacto y lectura de luz.",
      "Trabajo con equipos de estilismo, maquillaje y dirección de arte."
    ],
    subjectSlugs: ["posado-fotografico-editorial"],
    social: "@mateosalas.demo"
  },
  {
    slug: "ines-calderon",
    name: "Inés Calderón",
    role: "Preparadora corporal",
    specialty: "Expresión corporal y movimiento",
    image: imageLibrary.teacherInes,
    alt: "Retrato demo de Inés Calderón",
    quote: "El cuerpo gana presencia cuando deja de estar pendiente de hacerlo perfecto.",
    bio:
      "Inés viene del movimiento escénico y la pedagogía corporal. Su trabajo se centra en liberar tensión, ganar escucha física y ampliar los recursos expresivos ante cámara.",
    experience: [
      "Entrenamiento de presencia escénica y movimiento expresivo.",
      "Acompañamiento corporal para sesiones audiovisuales.",
      "Técnicas de respiración, eje y disponibilidad física."
    ],
    subjectSlugs: ["expresion-corporal-movimiento"],
    social: "@inescalderon.demo"
  },
  {
    slug: "diego-varela",
    name: "Diego Varela",
    role: "Director de interpretación",
    specialty: "Cámara, intención y self tape",
    image: imageLibrary.teacherDiego,
    alt: "Retrato demo de Diego Varela",
    quote: "La cámara detecta cuando hay una idea detrás de una mirada.",
    bio:
      "Diego prepara a perfiles para piezas audiovisuales, entrevistas y pruebas grabadas. Su enfoque evita la sobreactuación y trabaja desde la presencia contenida.",
    experience: [
      "Dirección de actores y modelos en piezas audiovisuales.",
      "Preparación de self tapes y videobooks.",
      "Entrenamiento de escucha, pausa e intención ante cámara."
    ],
    subjectSlugs: ["interpretacion-camara"],
    social: "@diegovarela.demo"
  },
  {
    slug: "noa-beltran",
    name: "Noa Beltrán",
    role: "Consultora de comunicación",
    specialty: "Presencia verbal y marca personal",
    image: imageLibrary.teacherNoa,
    alt: "Retrato demo de Noa Beltrán",
    quote: "Una presentación profesional debe sonar a ti, solo que más ordenada.",
    bio:
      "Noa trabaja con perfiles creativos en discurso, entrevistas y presencia digital. En ALMA ayuda a traducir identidad personal en mensajes claros y útiles.",
    experience: [
      "Preparación de entrevistas, bios y discursos de presentación.",
      "Estrategia de marca personal para perfiles creativos.",
      "Revisión de presencia digital, portfolio y contacto profesional."
    ],
    subjectSlugs: ["comunicacion-presencia", "marca-personal-redes"],
    social: "@noabeltran.demo"
  },
  {
    slug: "valeria-prado",
    name: "Valeria Prado",
    role: "Estilista",
    specialty: "Imagen, silueta y dirección estética",
    image: imageLibrary.teacherValeria,
    alt: "Retrato demo de Valeria Prado",
    quote: "El estilismo no tapa a la persona: la sitúa dentro de una historia visual.",
    bio:
      "Valeria combina estilismo editorial, consultoría de imagen y dirección de vestuario para sesiones. Su módulo aporta criterio visual y lectura de prenda.",
    experience: [
      "Estilismo para sesiones editoriales, lookbooks y books personales.",
      "Creación de moodboards y selección de prendas para cámara.",
      "Asesoría de imagen orientada a casting y portfolio."
    ],
    subjectSlugs: ["imagen-estilismo"],
    social: "@valeriaprado.demo"
  },
  {
    slug: "marta-quesada",
    name: "Marta Quesada",
    role: "Makeup artist",
    specialty: "Piel, beauty y maquillaje para cámara",
    image: imageLibrary.teacherMarta,
    alt: "Retrato demo de Marta Quesada",
    quote: "La preparación de piel también es parte del lenguaje de una imagen.",
    bio:
      "Marta trabaja en maquillaje de cámara, beauty natural y preparación de piel. Su asignatura ayuda a entender cómo colaborar con equipos de maquillaje y llegar preparada a set.",
    experience: [
      "Maquillaje para editoriales, campaña y retrato profesional.",
      "Preparación de piel y corrección natural para cámara.",
      "Coordinación con fotografía, estilismo y dirección de arte."
    ],
    subjectSlugs: ["maquillaje-piel-camara"],
    social: "@martaquesada.demo"
  },
  {
    slug: "elena-sanabria",
    name: "Elena Sanabria",
    role: "Especialista en bienestar",
    specialty: "Autocuidado, descanso y límites",
    image: imageLibrary.teacherElena,
    alt: "Retrato demo de Elena Sanabria",
    quote: "Un perfil preparado también sabe descansar, decir no y llegar con energía.",
    bio:
      "Elena acompaña procesos de bienestar aplicados a contextos creativos. En ALMA aborda hábitos sostenibles, preparación física razonable y relación sana con la imagen.",
    experience: [
      "Diseño de rutinas de movilidad y preparación corporal.",
      "Acompañamiento en gestión de nervios y exposición.",
      "Trabajo de límites, descanso y autocuidado profesional."
    ],
    subjectSlugs: ["bienestar-profesional-imagen"],
    social: "@elenasanabria.demo"
  }
];

export const getTeacherBySlug = (slug: string) =>
  teachers.find((teacher) => teacher.slug === slug);
