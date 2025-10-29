#!/usr/bin/env node

/**
 * Script Universal de Parada do Sistema Nola God Level
 * Funciona em Windows, Linux e macOS
 */

const { exec } = require('child_process');
const util = require('util');

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

async function stopSystem() {
    log('🛑 Parando Sistema Nola God Level', 'bold');
    log('=================================', 'bold');

    try {
        // Parar containers Docker
        log('\n🐳 Parando containers Docker...', 'blue');
        await execAsync('docker-compose down');
        log('✅ Containers Docker parados', 'green');
        
        // Parar processos Node.js relacionados ao projeto
        log('🧹 Parando processos Node.js...', 'blue');
        
        try {
            // No Windows
            if (process.platform === 'win32') {
                await execAsync('taskkill /f /im node.exe 2>nul');
            } else {
                // No Linux/macOS
                await execAsync('pkill -f "node serve.js" 2>/dev/null || true');
            }
            log('✅ Processos Node.js parados', 'green');
        } catch (error) {
            log('⚠️  Nenhum processo Node.js encontrado', 'yellow');
        }
        
        // Verificar se ainda há containers rodando
        log('\n🔍 Verificando containers restantes...', 'blue');
        try {
            const { stdout } = await execAsync('docker ps --format "{{.Names}}"');
            const runningContainers = stdout.trim().split('\n').filter(name => name.includes('godlevel'));
            
            if (runningContainers.length > 0) {
                log(`⚠️  Ainda há ${runningContainers.length} container(s) rodando:`, 'yellow');
                runningContainers.forEach(container => {
                    log(`   - ${container}`, 'yellow');
                });
                log('   Execute "docker-compose down" manualmente se necessário', 'yellow');
            } else {
                log('✅ Todos os containers foram parados', 'green');
            }
        } catch (error) {
            log('⚠️  Não foi possível verificar containers', 'yellow');
        }
        
        log('\n✅ Sistema parado com sucesso!', 'green');
        log('\n💡 Para iniciar novamente, execute:', 'blue');
        log('   node start-system.js', 'blue');
        
    } catch (error) {
        log(`\n❌ Erro ao parar sistema: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    stopSystem().catch(error => {
        log(`\n💥 Erro fatal: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = { stopSystem };
