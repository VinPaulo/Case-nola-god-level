#!/usr/bin/env node

/**
 * Script Universal de Inicialização do Sistema Nola God Level
 * Funciona em Windows, Linux e macOS
 */

const { exec, spawn } = require('child_process');
const util = require('util');
const http = require('http');

const execAsync = util.promisify(exec);

// Cores para output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkDocker() {
    try {
        await execAsync('docker --version');
        return true;
    } catch (error) {
        return false;
    }
}

async function checkNode() {
    try {
        await execAsync('node --version');
        return true;
    } catch (error) {
        return false;
    }
}

async function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        
        req.on('error', reject);
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function waitForService(url, serviceName, maxAttempts = 30) {
    log(`⏳ Aguardando ${serviceName} estar pronto...`, 'blue');
    
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const response = await makeRequest(url);
            if (response.status === 200) {
                log(`✅ ${serviceName} está pronto!`, 'green');
                return true;
            }
        } catch (error) {
            // Serviço ainda não está pronto
        }
        
        await sleep(2000);
    }
    
    log(`⚠️  ${serviceName} não respondeu após ${maxAttempts * 2} segundos`, 'yellow');
    return false;
}

async function startSystem() {
    log('🚀 Iniciando Sistema Nola God Level - Dashboard Analytics', 'bold');
    log('=======================================================', 'bold');

    // Verificar pré-requisitos
    log('\n📋 Verificando pré-requisitos...', 'blue');
    
    const dockerOk = await checkDocker();
    const nodeOk = await checkNode();
    
    if (!dockerOk) {
        log('❌ Docker não está instalado ou não está rodando', 'red');
        log('   Por favor, instale o Docker Desktop e tente novamente', 'yellow');
        process.exit(1);
    }
    
    if (!nodeOk) {
        log('❌ Node.js não está instalado', 'red');
        log('   Por favor, instale o Node.js e tente novamente', 'yellow');
        process.exit(1);
    }
    
    log('✅ Pré-requisitos verificados!', 'green');

    try {
        // Parar containers existentes
        log('\n🐳 Parando containers existentes...', 'blue');
        await execAsync('docker-compose down');
        
        // Subir banco de dados
        log('📊 Iniciando banco de dados PostgreSQL...', 'blue');
        await execAsync('docker-compose up -d postgres');
        
        // Aguardar banco estar pronto
        await waitForService('http://localhost:3000/api/health', 'Banco de Dados', 15);
        
        // Executar gerador de dados
        log('📈 Executando gerador de dados...', 'blue');
        await execAsync('docker-compose run --rm data-generator');
        
        // Subir API
        log('🔧 Iniciando API...', 'blue');
        await execAsync('docker-compose up -d api');
        
        // Aguardar API estar pronta
        await waitForService('http://localhost:3000/api/health', 'API', 15);
        
        // Instalar dependências do frontend se necessário
        if (!require('fs').existsSync('node_modules')) {
            log('📦 Instalando dependências do frontend...', 'blue');
            await execAsync('npm install');
        }
        
        // Iniciar frontend
        log('🌐 Iniciando frontend...', 'blue');
        const frontendProcess = spawn('node', ['serve.js'], {
            stdio: 'inherit',
            detached: true
        });
        
        // Aguardar frontend estar pronto
        await waitForService('http://localhost:3001', 'Frontend', 10);
        
        log('\n🎉 Sistema iniciado com sucesso!', 'green');
        log('\n📊 Dashboard: http://localhost:3001', 'blue');
        log('🔧 API: http://localhost:3000', 'blue');
        log('🗄️  Banco: localhost:5432', 'blue');
        
        log('\n📋 Para validar o sistema, execute:', 'yellow');
        log('   node validate-system.js', 'yellow');
        
        log('\n🛑 Para parar o sistema, execute:', 'yellow');
        log('   node stop-system.js', 'yellow');
        
        // Abrir dashboard no navegador
        log('\n🌐 Abrindo dashboard no navegador...', 'blue');
        const openCommand = process.platform === 'win32' ? 'start' : 
                           process.platform === 'darwin' ? 'open' : 'xdg-open';
        
        try {
            await execAsync(`${openCommand} http://localhost:3001`);
        } catch (error) {
            log('⚠️  Não foi possível abrir o navegador automaticamente', 'yellow');
            log('   Acesse manualmente: http://localhost:3001', 'yellow');
        }
        
        log('\n✅ Sistema pronto para uso!', 'green');
        log('\n💡 Pressione Ctrl+C para parar o sistema', 'yellow');
        
        // Manter o processo rodando
        process.on('SIGINT', async () => {
            log('\n\n🛑 Parando sistema...', 'yellow');
            await execAsync('docker-compose down');
            process.exit(0);
        });
        
        // Manter o processo vivo
        setInterval(() => {}, 1000);
        
    } catch (error) {
        log(`\n❌ Erro ao iniciar sistema: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    startSystem().catch(error => {
        log(`\n💥 Erro fatal: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = { startSystem };
