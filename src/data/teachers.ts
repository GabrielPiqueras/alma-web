import { founder } from "./site";

export type Teacher = {
  slug: string;
  name: string;
  role: string;
  image: string;
  alt: string;
  bio: string;
  subjectSlugs: string[];
  isFounder?: boolean;
};

// La fundadora se muestra en su sección de dirección, separada de los once docentes.
export const teachers: Teacher[] = [
  {
    slug: founder.slug,
    name: founder.name,
    role: founder.role,
    image: founder.image,
    alt: "Retrato de Eliana Herrero, fundadora y directora de ALMA",
    bio: founder.bio,
    subjectSlugs: [],
    isFounder: true
  },
  {
    "slug": "maru-ortega",
    "name": "Maru Ortega",
    "role": "Imagen personal, estilismo y Personal Shopper",
    "bio": "Especialista en asesoría de imagen personal y profesional, marca personal y comunicación de moda.",
    "image": "/assets/images/personal/1-manu-ortega.jpg",
    "alt": "Retrato de Maru Ortega",
    "subjectSlugs": [
      "imagen-estilismo"
    ]
  },
  {
    "slug": "carlos-paya",
    "name": "Carlos Payá",
    "role": "Redes sociales, influencer y creación de contenido",
    "bio": "Creador de contenido especializado en tendencias y comunicación en redes.",
    "image": "/assets/images/personal/2-carlos-paya.jpg",
    "alt": "Retrato de Carlos Payá",
    "subjectSlugs": [
      "marca-personal-redes"
    ]
  },
  {
    "slug": "maria-jose-ortiz",
    "name": "Mª José Ortiz",
    "role": "Diseño, moda, alta costura y fittings",
    "bio": "Diseño y preparación de prendas, pruebas de vestuario y relación entre diseñadora y modelo.",
    "image": "/assets/images/personal/3-maria-jose-ortiz.jpg",
    "alt": "Retrato de Mª José Ortiz",
    "subjectSlugs": [
      "diseno-moda-alta-costura-fittings"
    ]
  },
  {
    "slug": "pedro-albaladejo",
    "name": "Pedro Albaladejo",
    "role": "Marketing, branding y estrategia digital",
    "bio": "Consultor de transformación digital y estrategia online, vinculado al desarrollo de negocios digitales",
    "image": "/assets/images/personal/4-pedro-albaladejo.jpg",
    "alt": "Retrato de Pedro Albaladejo",
    "subjectSlugs": [
      "marketing-branding-estrategia-digital"
    ]
  },
  {
    "slug": "melani-anton",
    "name": "Melani Antón",
    "role": "Maquillaje, higiene y cuidado personal",
    "bio": "Formación en maquillaje y preparación de la imagen para sesiones y trabajos profesionales.",
    "image": "/assets/images/personal/5-melani-anton.jpg",
    "alt": "Retrato de Melani Antón",
    "subjectSlugs": [
      "maquillaje-piel-camara"
    ]
  },
  {
    "slug": "paco-alacid",
    "name": "Paco Alacid",
    "role": "Fotografía de moda y fotopose",
    "bio": "Fotógrafo de retrato, moda y publicidad con trayectoria internacional.",
    "image": "/assets/images/personal/6-paco-alacid.jpg",
    "alt": "Retrato de Paco Alacid",
    "subjectSlugs": [
      "posado-fotografico-editorial"
    ]
  },
  {
    "slug": "carmina-boronat",
    "name": "Carmina Boronat",
    "role": "Contratos, derechos de imagen, representación y protocolo",
    "bio": "Área jurídica y profesional: contratos, condiciones de representación, derechos de imagen y prevención de abusos.",
    "image": "/assets/images/personal/7-carmina-boronat.jpg",
    "alt": "Retrato de Carmina Boronat",
    "subjectSlugs": [
      "protocolo-castings-produccion"
    ]
  },
  {
    "slug": "alejandro-fernandez",
    "name": "Alejandro Fernández",
    "role": "Pasarela, desfile y coreografía",
    "bio": "Exmodelo y fundador de Agencia de Modelos Escala, con experiencia en dirección de desfiles.",
    "image": "/assets/images/personal/8-alejandro-fernandez.jpg",
    "alt": "Retrato de Alejandro Fernández",
    "subjectSlugs": [
      "pasarela-tecnica-desfile"
    ]
  },
  {
    "slug": "alex-de-frutos",
    "name": "Alex de Frutos",
    "role": "Fotografía, book profesional y e-commerce",
    "bio": "Fotógrafo especializado en moda, retrato, books de modelos y fotografía comercial.",
    "image": "/assets/images/personal/9-alex-de-frutos.jpg",
    "alt": "Retrato de Alex de Frutos",
    "subjectSlugs": [
      "fotografia-book-profesional-ecommerce"
    ]
  },
  {
    "slug": "barbara-barone",
    "name": "Bárbara Barone",
    "role": "Casting, interpretación y audiovisual",
    "bio": "Actriz y directora de casting; fundadora de Human Art Casting.",
    "image": "/assets/images/personal/10-barbara-barone.jpg",
    "alt": "Retrato de Bárbara Barone",
    "subjectSlugs": [
      "casting-interpretacion-audiovisual"
    ]
  },
  {
    "slug": "sergio-villanueva",
    "name": "Sergio Villanueva",
    "role": "Interpretación ante cámara, comunicación y oratoria",
    "bio": "Actor, director, guionista y docente de interpretación.",
    "image": "/assets/images/personal/11-sergio-villanueva.jpg",
    "alt": "Retrato de Sergio Villanueva",
    "subjectSlugs": [
      "interpretacion-camara"
    ]
  }
];

export const getTeacherBySlug = (slug: string) => teachers.find((teacher) => teacher.slug === slug);
