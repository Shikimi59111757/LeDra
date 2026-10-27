@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0app\install.ps1" -Keep
timeout /t 6
