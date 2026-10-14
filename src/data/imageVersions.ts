/*
  ALMA image versions.
  Este archivo se genera automaticamente al cambiar imagenes o al ejecutar npm run build.
*/

export const imageVersions = {
  "agency-editorial.jpg": "231144b6df36",
  "backstage.jpg": "9e60759f6812",
  "beauty-portrait.jpg": "b713b2a697e3",
  "editorial-portrait.jpg": "39f8334ac3ad",
  "founder.jpg": "c9ea08651007",
  "gallery-portrait.jpg": "be4a5918a422",
  "gallery-set.jpg": "6c766970a9d8",
  "gallery-styling.jpg": "8b814cee8a41",
  "gallery-talent.jpg": "ec94c314d87d",
  "hero.jpg": "1b228ad79101",
  "runway.jpg": "82d32c294876",
  "subject-bienestar.jpg": "7372504898ce",
  "subject-camara.jpg": "19a740b4886f",
  "subject-comunicacion.jpg": "8c14ad498c4d",
  "subject-estilismo.jpg": "f42679f304e0",
  "subject-maquillaje.jpg": "b02285b109ed",
  "subject-movimiento.jpg": "f8a5029b8a84",
  "subject-posado.jpg": "5c821d23ba5c",
  "subject-redes.jpg": "cabbd062aa68",
  "teacher-aitana.jpg": "12000546f5a5",
  "teacher-diego.jpg": "ce8c979d2118",
  "teacher-elena.jpg": "fbeebcc6d91f",
  "teacher-ines.jpg": "05f97d9df8d9",
  "teacher-marta.jpg": "1ec5efd96163",
  "teacher-mateo.jpg": "2b95a00dfd76",
  "teacher-noa.jpg": "6c5df105e1e2",
  "teacher-valeria.jpg": "2a295c0014cb",
} as const;

export function versionedImage(src: string) {
  const [path] = src.split("?");
  if (!path.startsWith("/assets/images/alma/")) return src;
  const fileName = path.split("/").pop() ?? "";
  const version = imageVersions[fileName as keyof typeof imageVersions];
  return version ? `${path}?v=${version}` : src;
}
