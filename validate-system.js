const http = require('http');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

const API_BASE = 'http://localhost:3000';
const FRONTEND_BASE = 'http://localhost:3001';

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

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });
        
        req.on('error', reject);
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function checkDockerContainers() {
    log('\n🐳 Verificando containers Docker...', 'blue');
    
    try {
        const { stdout } = await execAsync('docker ps --format "table {{.Names}}\\t{{.Status}}"');
        const lines = stdout.trim().split('\n').slice(1);
        
        const containers = {
            'postgres': false,
            'godlevel-analytics-api': false
        };
        
        lines.forEach(line => {
            if (line.includes('postgres') || line.includes('godlevel-db')) containers.postgres = true;
            if (line.includes('godlevel-analytics-api')) containers['godlevel-analytics-api'] = true;
        });
        
        Object.entries(containers).forEach(([name, running]) => {
            if (running) {
                log(`  ✅ ${name} está rodando`, 'green');
            } else {
                log(`  ❌ ${name} não está rodando`, 'red');
            }
        });
        
        return Object.values(containers).every(Boolean);
    } catch (error) {
        log(`  ❌ Erro ao verificar containers: ${error.message}`, 'red');
        return false;
    }
}

async function checkAPIHealth() {
    log('\n🔍 Verificando saúde da API...', 'blue');
    
    try {
        const response = await makeRequest(`${API_BASE}/api/health`);
        
        if (response.status === 200) {
            log('  ✅ API está respondendo', 'green');
            log(`  📊 Status: ${response.data.status}`, 'blue');
            log(`  🗄️  Banco: ${response.data.database}`, 'blue');
            return true;
        } else {
            log(`  ❌ API retornou status ${response.status}`, 'red');
            return false;
        }
    } catch (error) {
        log(`  ❌ Erro ao conectar com API: ${error.message}`, 'red');
        return false;
    }
}

async function checkAPIEndpoints() {
    log('\n📡 Verificando endpoints da API...', 'blue');
    
    const endpoints = [
        { path: '/api/brands', name: 'Marcas' },
        { path: '/api/sales/summary?brand_id=1', name: 'Resumo de Vendas' },
        { path: '/api/analytics/top-products?brand_id=1&limit=5', name: 'Top Produtos' },
        { path: '/api/analytics/revenue-by-channel?brand_id=1', name: 'Receita por Canal' },
        { path: '/api/analytics/maria-stores?brand_id=1', name: 'Lojas da Maria' }
    ];
    
    let allWorking = true;
    
    for (const endpoint of endpoints) {
        try {
            const response = await makeRequest(`${API_BASE}${endpoint.path}`);
            
            if (response.status === 200) {
                log(`  ✅ ${endpoint.name}`, 'green');
                
                // Verificar se retorna dados válidos
                if (Array.isArray(response.data) && response.data.length > 0) {
                    log(`    📊 Retornou ${response.data.length} registros`, 'blue');
                } else if (typeof response.data === 'object' && response.data !== null) {
                    log(`    📊 Retornou dados válidos`, 'blue');
                }
            } else {
                log(`  ❌ ${endpoint.name} - Status ${response.status}`, 'red');
                allWorking = false;
            }
        } catch (error) {
            log(`  ❌ ${endpoint.name} - Erro: ${error.message}`, 'red');
            allWorking = false;
        }
    }
    
    return allWorking;
}

async function checkFrontend() {
    log('\n🌐 Verificando frontend...', 'blue');
    
    try {
        const response = await makeRequest(FRONTEND_BASE);
        
        if (response.status === 200) {
            log('  ✅ Frontend está respondendo', 'green');
            
            // Verificar se contém elementos essenciais
            const html = response.data;
            const hasTitle = html.includes('Nola God Level');
            const hasCharts = html.includes('Chart.js') || html.includes('chart.js');
            const hasFilters = html.includes('brandSelect');
            
            if (hasTitle) log('    📄 Título encontrado', 'green');
            if (hasCharts) log('    📊 Chart.js carregado', 'green');
            if (hasFilters) log('    🔍 Filtros implementados', 'green');
            
            return hasTitle && hasCharts && hasFilters;
        } else {
            log(`  ❌ Frontend retornou status ${response.status}`, 'red');
            return false;
        }
    } catch (error) {
        log(`  ❌ Erro ao conectar com frontend: ${error.message}`, 'red');
        return false;
    }
}

async function checkDatabaseData() {
    log('\n🗄️  Verificando dados do banco...', 'blue');
    
    try {
        // Verificar se há marcas
        const brandsResponse = await makeRequest(`${API_BASE}/api/brands`);
        if (brandsResponse.status === 200 && brandsResponse.data.length > 0) {
            log(`  ✅ ${brandsResponse.data.length} marcas encontradas`, 'green');
        } else {
            log('  ❌ Nenhuma marca encontrada', 'red');
            return false;
        }
        
        // Verificar se há lojas da Maria
        const storesResponse = await makeRequest(`${API_BASE}/api/analytics/maria-stores?brand_id=1`);
        if (storesResponse.status === 200 && storesResponse.data.length > 0) {
            log(`  ✅ ${storesResponse.data.length} lojas da Maria encontradas`, 'green');
            
            // Verificar se as lojas têm dados
            const hasData = storesResponse.data.some(store => store.sales_count > 0);
            if (hasData) {
                log('  ✅ Lojas têm dados de vendas', 'green');
            } else {
                log('  ⚠️  Lojas não têm dados de vendas', 'yellow');
            }
        } else {
            log('  ❌ Lojas da Maria não encontradas', 'red');
            return false;
        }
        
        return true;
    } catch (error) {
        log(`  ❌ Erro ao verificar dados: ${error.message}`, 'red');
        return false;
    }
}

async function runValidation() {
    log('🚀 Iniciando validação do sistema Nola God Level...', 'bold');
    
    const results = {
        docker: await checkDockerContainers(),
        apiHealth: await checkAPIHealth(),
        apiEndpoints: await checkAPIEndpoints(),
        frontend: await checkFrontend(),
        database: await checkDatabaseData()
    };
    
    log('\n📋 Resumo da Validação:', 'bold');
    log('========================', 'bold');
    
    Object.entries(results).forEach(([test, passed]) => {
        const status = passed ? '✅ PASSOU' : '❌ FALHOU';
        const color = passed ? 'green' : 'red';
        log(`${test.toUpperCase()}: ${status}`, color);
    });
    
    const allPassed = Object.values(results).every(Boolean);
    
    if (allPassed) {
        log('\n🎉 SISTEMA VALIDADO COM SUCESSO!', 'green');
        log('O dashboard está pronto para uso em: http://localhost:3001', 'blue');
    } else {
        log('\n⚠️  ALGUNS TESTES FALHARAM', 'yellow');
        log('Verifique os erros acima e tente novamente', 'yellow');
    }
    
    return allPassed;
}

// Executar validação se chamado diretamente
if (require.main === module) {
    runValidation().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        log(`\n💥 Erro fatal: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = { runValidation };
