@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Instala Node o ejecuta npm install antes de usar este editor.
  pause
  exit /b 1
)
echo ALMA - Colores, imagenes, logo y SEO
node tools\theme-editor.mjs
pause