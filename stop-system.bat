@echo off
echo 🛑 Parando Sistema Nola God Level
echo ==================================

echo.
echo 🐳 Parando containers Docker...
docker-compose down

echo.
echo 🧹 Limpando processos do Node.js...
taskkill /f /im node.exe >nul 2>&1

echo.
echo ✅ Sistema parado com sucesso!
echo.
echo 💡 Para iniciar novamente, execute:
echo    start-complete.bat
echo.
pause
