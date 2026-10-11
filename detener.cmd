@echo off
cd /d "%~dp0"
node run --stop
if errorlevel 1 pause
