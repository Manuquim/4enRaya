@echo off
cd /d "%~dp0"
node run
if errorlevel 1 pause
