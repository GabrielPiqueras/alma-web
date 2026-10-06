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
    src: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1300&q=82",
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
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=82",
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
    src: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1400&q=82",
    alt: "Detalle de sesión editorial en estudio",
    label: "Set",
    shape: "landscape"
  },
  {
    src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=82",
    alt: "Modelo con estilismo contemporáneo",
    label: "Talento",
    shape: "portrait"
  }
];
