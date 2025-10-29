@echo off
echo 🚀 Iniciando Sistema Nola God Level - Dashboard Analytics
echo ========================================================

echo.
echo 📋 Verificando pré-requisitos...

:: Verificar se Docker está rodando
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não está rodando. Por favor, inicie o Docker Desktop.
    pause
    exit /b 1
)

:: Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não está instalado. Por favor, instale o Node.js.
    pause
    exit /b 1
)

echo ✅ Pré-requisitos verificados!

echo.
echo 🐳 Iniciando containers Docker...

:: Parar containers existentes
docker-compose down

:: Subir banco de dados
echo 📊 Iniciando banco de dados PostgreSQL...
docker-compose up -d postgres

:: Aguardar banco estar pronto
echo ⏳ Aguardando banco de dados estar pronto...
timeout /t 10 /nobreak >nul

:: Executar gerador de dados
echo 📈 Executando gerador de dados...
docker-compose run --rm data-generator

:: Subir API
echo 🔧 Iniciando API...
docker-compose up -d api

:: Aguardar API estar pronta
echo ⏳ Aguardando API estar pronta...
timeout /t 5 /nobreak >nul

:: Verificar se API está funcionando
echo 🔍 Verificando API...
curl -s http://localhost:3000/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  API ainda não está pronta, aguardando mais um pouco...
    timeout /t 10 /nobreak >nul
)

:: Instalar dependências do frontend se necessário
if not exist "node_modules" (
    echo 📦 Instalando dependências do frontend...
    npm install
)

:: Iniciar frontend
echo 🌐 Iniciando frontend...
start "Nola God Level Frontend" cmd /k "node serve.js"

:: Aguardar frontend estar pronto
echo ⏳ Aguardando frontend estar pronto...
timeout /t 3 /nobreak >nul

echo.
echo 🎉 Sistema iniciado com sucesso!
echo.
echo 📊 Dashboard: http://localhost:3001
echo 🔧 API: http://localhost:3000
echo 🗄️  Banco: localhost:5432
echo.
echo 📋 Para validar o sistema, execute:
echo    node validate-system.js
echo.
echo 🛑 Para parar o sistema, execute:
echo    docker-compose down
echo.

:: Abrir dashboard no navegador
echo 🌐 Abrindo dashboard no navegador...
start http://localhost:3001

echo.
echo ✅ Sistema pronto para uso!
pause
