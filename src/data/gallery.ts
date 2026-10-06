import { imageLibrary } from "./site";

export type GalleryImage = {
  src: string;
  alt: string;
  label: string;
  shape: "portrait" | "landscape" | "square" | "wide";
};

// DEMO: galería editorial con imágenes de Unsplash para sustituir por fotografías reales del proyecto.
export const gallery: GalleryImage[] = [
  {
    src: imageLibrary.hero,
    alt: "Editorial de moda con modelo en exterior",
    label: "Editorial",
    shape: "portrait"
  },
  {
    src: imageLibrary.backstage,
    alt: "Backstage de sesión de moda",
    label: "Backstage",
    shape: "landscape"
  },
  {
    src: "/assets/images/alma/gallery-styling.jpg",
    alt: "Perchero con prendas de moda en estudio",
    label: "Estilismo",
    shape: "square"
  },
  {
    src: imageLibrary.escuela,
    alt: "Pasarela de moda con público",
    label: "Pasarela",
    shape: "wide"
  },
  {
    src: "/assets/images/alma/gallery-portrait.jpg",
    alt: "Retrato editorial en blanco y negro",
    label: "Retrato",
    shape: "portrait"
  },
  {
    src: imageLibrary.detail,
    alt: "Retrato beauty con iluminación suave",
    label: "Beauty",
    shape: "portrait"
  },
  {
    src: "/assets/images/alma/gallery-set.jpg",
    alt: "Detalle de sesión editorial en estudio",
    label: "Set",
    shape: "landscape"
  },
  {
    src: "/assets/images/alma/gallery-talent.jpg",
    alt: "Modelo con estilismo contemporáneo",
    label: "Talento",
    shape: "portrait"
  }
];
