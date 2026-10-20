import { seoSettings } from "./seo";

// Datos públicos editables desde Editar colores ALMA.bat > SEO y datos.
export const siteMeta = {
  name: seoSettings.siteName,
  descriptor: "Escuela & Agencia de Imagen",
  url: seoSettings.siteUrl,
  defaultTitle: seoSettings.defaultTitle,
  defaultDescription: seoSettings.defaultDescription,
  locale: "es_ES"
};

export const contact = {
  ...seoSettings.contact,
  formEndpoint: "",
  formMode: "demo"
};

export const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/escuela", label: "Escuela" },
  { href: "/formacion", label: "Formación" },
  { href: "/equipo", label: "Equipo" },
  { href: "/agencia", label: "Agencia" },
  { href: "/proyecto", label: "Proyecto" },
  { href: "/contacto", label: "Contacto" }
];

export const imageLibrary = {
  hero:
    "/assets/images/alma/hero.jpg",
  heroSecondary:
    "/assets/images/alma/beauty-portrait.jpg",
  escuela:
    "/assets/images/alma/runway.jpg",
  agencia:
    "/assets/images/alma/agency-editorial.jpg",
  founder:
    "/assets/images/personal/eliana-herrero-alma.jpg",
  project:
    "/assets/images/alma/editorial-portrait.jpg",
  contact:
    "/assets/images/alma/editorial-portrait.jpg",
  backstage:
    "/assets/images/alma/backstage.jpg",
  esatur:
    "/assets/images/alma/esatur.jpg",
  imagen:
    "/assets/images/alma/derechos-imagen.jpg",
  detail:
    "/assets/images/alma/beauty-portrait.jpg",
};

export const founder = {
  "slug": "eliana-herrero",
  "name": "Eliana Herrero",
  "role": "Fundadora y directora de ALMA · Escuela & Agencia de Imagen",
  "image": "/assets/images/personal/eliana-herrero-alma.jpg",
  "bio": "Mi nombre es Eliana Herrero y soy la fundadora y directora de ALMA, un proyecto que nace de mi pasión por la moda, la imagen y, sobre todo, por el potencial que tiene cada persona para convertir su esencia en una oportunidad.",
  "vision": "Todo gran proyecto comienza con un sueño. ALMA nació del mío.",
  "story": [
    "Mi nombre es Eliana Herrero y soy la fundadora y directora de ALMA, un proyecto que nace de mi pasión por la moda, la imagen y, sobre todo, por el potencial que tiene cada persona para convertir su esencia en una oportunidad.",
    "Mi camino comenzó desde la propia experiencia. He realizado tres formaciones como modelo, dos en agencias de Madrid y una en Alicante, que me permitieron conocer de cerca el mundo de la moda, sus exigencias, sus oportunidades y todo lo que existe detrás de una imagen profesional. A lo largo de mi trayectoria también he participado en experiencias vinculadas a la publicidad, los desfiles, los castings y los eventos, descubriendo un sector que terminó convirtiéndose en mucho más que una pasión: en mi propósito.",
    "Con el tiempo, aquel sueño fue tomando forma. Empecé a imaginar un espacio diferente, donde la formación no terminara al salir del aula, sino que pudiera abrir puertas hacia el mundo profesional. Un lugar donde cada alumno encontrara herramientas, confianza y orientación para descubrir sus capacidades y aprender a proyectarlas al exterior.",
    "Así nació ALMA.",
    "Detrás de este proyecto hay mucho más que una idea: hay horas de dedicación, formación, planificación, investigación y trabajo. Me he implicado tanto profesional como personalmente en cada detalle, construyendo una estructura que une escuela y agencia con una visión clara: formar personas, impulsar talento y acercar oportunidades reales.",
    "Creo profundamente que la imagen va mucho más allá de lo que vemos. Habla de seguridad, identidad, actitud y autenticidad. Por eso, mi propósito no es únicamente enseñar a desfilar o posar ante una cámara, sino acompañar a cada persona en el desarrollo de su potencial y en la construcción de su propio camino profesional.",
    "ALMA representa todo lo que he aprendido, todo lo que he soñado y todo aquello por lo que he trabajado para hacerlo realidad. Es el comienzo de un camino que quiero recorrer junto a profesionales que compartan esta visión y alumnos que estén dispuestos a descubrir hasta dónde pueden llegar.",
    "Porque a veces un sueño empieza siendo solo una idea, pero cuando se acompaña de compromiso, esfuerzo y pasión, puede convertirse en algo capaz de inspirar a otros.",
    "ALMA es mi sueño convertido en proyecto. Y mi mayor ilusión es que también se convierta en el comienzo de muchas historias profesionales."
  ]
};

export const collaborator = {
  "name": "ESATUR",
  "label": "ALMA × ESATUR",
  "title": "Formación, talento y oportunidades reales",
  "paragraphs": [
    "ESATUR es una entidad especializada en formación y experiencias profesionales vinculadas al turismo, los eventos y el sector empresarial. A través de nuestra colaboración, ALMA busca conectar la formación en moda e imagen con el mundo profesional, acercando a nuestros alumnos a experiencias prácticas y al entorno de los eventos.",
    "Esta sinergia abre la puerta a nuevas oportunidades en ferias, congresos, promociones de marca, eventos corporativos, atención al público y acciones publicitarias, desarrollando perfiles versátiles, preparados y con una imagen profesional.",
    "En ALMA creemos que el talento no solo se forma: se impulsa, se proyecta y se convierte en oportunidades."
  ]
};

export const institutionalCopy = {
  heroClaim: "Tu imagen cuenta una historia antes de que hables.",
  heroLead:
    "ALMA une escuela de modelaje, dirección de imagen y agencia de talento para preparar perfiles con presencia, criterio y herramientas reales de trabajo.",
  manifesto:
    "No enseñamos únicamente a posar. Enseñamos a estar, a escuchar la cámara, a mover el cuerpo con intención y a construir una presencia que pueda sostener una historia.",
  schoolLead:
    "Una formación práctica y exigente para personas que quieren desenvolverse con naturalidad en moda, fotografía, comunicación y proyectos de imagen.",
  agencyLead:
    "La agencia acompaña a perfiles formados o seleccionados en su desarrollo visual: book, castings, sesiones, colaboraciones y oportunidades profesionales."
};

export const faqs = [
  {
    question: "¿ALMA es solo para personas que quieren desfilar?",
    answer:
      "No. La formación está pensada para modelaje, fotografía, imagen personal, presencia escénica y comunicación. El objetivo es construir recursos profesionales aplicables a distintos contextos."
  },
  {
    question: "¿La agencia garantiza trabajos o castings?",
    answer:
      "La formación no garantiza representación ni contratación. Las oportunidades dependen del perfil, la preparación, la disponibilidad, los requisitos del cliente y la existencia de encargos adecuados; cualquier relación con la agencia se formaliza de forma independiente."
  },
  {
    question: "¿Quién forma el equipo y qué colaboración tiene ALMA?",
    answer:
      "Eliana Herrero es la fundadora y directora de ALMA. El equipo reúne a once docentes especializados en moda, imagen, fotografía, comunicación y otras áreas del programa. La colaboración ALMA × ESATUR busca conectar esta formación con experiencias prácticas y el entorno de los eventos."
  }
];
