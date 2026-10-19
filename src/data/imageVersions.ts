/*
  ALMA image versions.
  Este archivo se genera automaticamente al cambiar imagenes o al ejecutar npm run build.
*/

export const imageVersions = {
  "alma/agency-editorial.jpg": "231144b6df36",
  "alma/backstage.jpg": "9e60759f6812",
  "alma/beauty-portrait.jpg": "b713b2a697e3",
  "alma/derechos-imagen.jpg": "251564b5e115",
  "alma/editorial-portrait.jpg": "2097ebb5d3ab",
  "alma/founder.jpg": "c9ea08651007",
  "alma/gallery-portrait.jpg": "be4a5918a422",
  "alma/gallery-set.jpg": "6c766970a9d8",
  "alma/gallery-styling.jpg": "8b814cee8a41",
  "alma/gallery-talent.jpg": "ec94c314d87d",
  "alma/hero.jpg": "1b228ad79101",
  "alma/logo.png": "b9963f0bf7a9",
  "alma/runway.jpg": "fe6cda391602",
  "alma/subject-bienestar.jpg": "7372504898ce",
  "alma/subject-camara.jpg": "19a740b4886f",
  "alma/subject-comunicacion.jpg": "8c14ad498c4d",
  "alma/subject-estilismo.jpg": "f42679f304e0",
  "alma/subject-maquillaje.jpg": "b02285b109ed",
  "alma/subject-movimiento.jpg": "f8a5029b8a84",
  "alma/subject-posado.jpg": "d65fd2fa91e5",
  "alma/subject-redes.jpg": "cabbd062aa68",
  "alma/teacher-aitana.jpg": "12000546f5a5",
  "alma/teacher-diego.jpg": "ce8c979d2118",
  "alma/teacher-elena.jpg": "fbeebcc6d91f",
  "alma/teacher-ines.jpg": "05f97d9df8d9",
  "alma/teacher-marta.jpg": "1ec5efd96163",
  "alma/teacher-mateo.jpg": "2b95a00dfd76",
  "alma/teacher-noa.jpg": "6c5df105e1e2",
  "alma/teacher-valeria.jpg": "2a295c0014cb",
  "personal/1-manu-ortega.jpg": "747338a36bd5",
  "personal/10-barbara-barone.jpg": "11ec5c82679c",
  "personal/11-sergio-villanueva.jpg": "4f6aad7f61fd",
  "personal/2-carlos-paya.jpg": "762ac8e39b7d",
  "personal/3-maria-jose-ortiz.jpg": "d32abf6d62c6",
  "personal/4-pedro-albaladejo.jpg": "340d4347dfaa",
  "personal/5-melani-anton.jpg": "157a16d8627b",
  "personal/6-paco-alacid.jpg": "6e8db0b8229f",
  "personal/7-carmina-boronat.jpg": "34f1d7342f94",
  "personal/8-alejandro-fernandez.jpg": "7e69cf55e496",
  "personal/9-alex-de-frutos.jpg": "efccfe86c173",
  "personal/eliana-herrero-alma.jpg": "d2e6f577293b",
} as const;

export function versionedImage(src: string) {
  const [path] = src.split("?");
  if (!path.startsWith("/assets/images/")) return src;
  const fileName = path.slice("/assets/images/".length);
  const version = imageVersions[fileName as keyof typeof imageVersions];
  return version ? `${path}?v=${version}` : src;
}
