@echo off
setlocal
cd /d "%~dp0"

echo ALMA - generar build
echo.

echo Comprobando Node.js...
where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Instala Node.js para poder generar la web.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo No se encontro npm. Revisa la instalacion de Node.js.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Instalando dependencias del proyecto...
  call npm install
  if errorlevel 1 (
    echo No se pudieron instalar las dependencias.
    pause
    exit /b 1
  )
)

echo.
echo Generando carpeta dist...
call npm run build
if errorlevel 1 (
  echo.
  echo No se pudo generar el build.
  pause
  exit /b 1
)

echo.
echo Build completado. La web generada esta en:
echo %~dp0dist
echo.
pause
