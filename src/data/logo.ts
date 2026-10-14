/*
  ALMA logo settings.
  Este archivo se genera automaticamente al cambiar el logo o al ejecutar npm run build.
*/

export const logo = {
  src: "/assets/images/alma/logo.png",
  version: "b9963f0bf7a9"
} as const;

export function versionedLogo() {
  return logo.version ? `${logo.src}?v=${logo.version}` : logo.src;
}
