@echo off
REM Abre la web (HTML/CSS/JS plano) en el navegador, servida en local para que
REM el fetch de version.json funcione (file:// lo bloquea por CORS).
cd /d "%~dp0"
node tools\dev-server.js
