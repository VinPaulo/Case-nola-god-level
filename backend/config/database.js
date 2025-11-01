const { Pool } = require('pg');

// Configuração do pool de conexão com Supabase
const pool = new Pool({
  connectionString: 'postgresql://postgres:paulovin0203@db.emnxkhzmpbvwaktgjmxl.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }, // obrigatório para Supabase
  max: 20,                           // máximo de conexões no pool
  idleTimeoutMillis: 30000,          // tempo máximo de inatividade antes de liberar a conexão
  connectionTimeoutMillis: 2000      // tempo máximo para tentar conectar
});

// Teste de conexão
pool.on('connect', () => {
  console.log('✅ Conectado ao Supabase');
});

pool.on('error', (err) => {
  console.error('❌ Erro no Supabase:', err);
});

module.exports = pool;
