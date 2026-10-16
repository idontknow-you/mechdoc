@echo off
setlocal
cd /d "%~dp0"
if not exist "backend\.venv\Scripts\python.exe" (
  echo Install the backend dependencies first. See README.md.
  pause
  exit /b 1
)
if not exist "frontend\dist\index.html" (
  pushd frontend
  call npm.cmd run build
  if errorlevel 1 exit /b 1
  popd
)
echo Open http://localhost:5000 in your browser.
echo Keep this window open while using MechDoctor. Press Ctrl+C to stop.
"backend\.venv\Scripts\python.exe" "backend\app.py"
