@echo off
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 (
  py -3 sunucu.py
  if errorlevel 1 pause
  exit /b
)
where python >nul 2>nul
if not errorlevel 1 (
  python sunucu.py
  if errorlevel 1 pause
  exit /b
)
echo Python 3 bulunamadi. TelemetriDeneme.html dosyasini dogrudan acabilirsiniz.
pause
