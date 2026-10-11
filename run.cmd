@echo off
cd /d "%~dp0"
if not exist "scripts\launch.mjs" goto missing_files
if not exist "dist\index.html" goto missing_files
set "game_node=node.exe"
where node.exe >nul 2>nul
if errorlevel 1 (
  if exist "%ProgramFiles%\nodejs\node.exe" (
    set "game_node=%ProgramFiles%\nodejs\node.exe"
  ) else if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set "game_node=%LOCALAPPDATA%\Programs\nodejs\node.exe"
  ) else (
    echo No se encontro Node.js. Instala Node.js 18 o posterior.
    pause
    exit /b 1
  )
)
"%game_node%" "%~dp0scripts\launch.mjs" %*
if errorlevel 1 pause
exit /b
:missing_files
echo Faltan archivos. Extrae el ZIP completo antes de ejecutar run.cmd.
pause
exit /b 1
