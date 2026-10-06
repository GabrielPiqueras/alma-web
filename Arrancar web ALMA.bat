@echo off
setlocal
cd /d "%~dp0"

echo ALMA - servidor local

echo Comprobando Node.js...
where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Instala Node.js para poder arrancar la web.
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

echo Abriendo navegador en http://127.0.0.1:4321/
start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:4321/'"

echo.
echo Servidor activo mientras esta ventana permanezca abierta.
echo Pulsa Ctrl+C para detenerlo.
echo.
call npm run dev -- --host 127.0.0.1 --port 4321

pause