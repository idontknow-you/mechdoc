@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Setup-MechDoctor.ps1"
if errorlevel 1 (
  pause
  exit /b 1
)
pause
