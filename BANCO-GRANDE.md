# 🗄️ Estratégias para Bancos de Dados Grandes

## Quando o Banco Excede os Limites Gratuitos

### Opção 1: Otimização e Limpeza (Recomendado Primeiro)

**Scripts de Limpeza:**
```sql
-- Remover dados antigos (manter últimos 6 meses)
DELETE FROM sales WHERE created_at < NOW() - INTERVAL '6 months';

-- Arquivar dados históricos em tabelas separadas
CREATE TABLE sales_archive AS SELECT * FROM sales WHERE created_at < NOW() - INTERVAL '1 year';
DELETE FROM sales WHERE created_at < NOW() - INTERVAL '1 year';

-- Limpar tabelas temporárias
TRUNCATE TABLE temp_data;

-- Vacuum para recuperar espaço
VACUUM FULL;
```

**Otimização de Estrutura:**
```sql
-- Adicionar índices para queries frequentes
CREATE INDEX CONCURRENTLY idx_sales_brand_date ON sales(brand_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_sales_channel ON sales(channel_id);
CREATE INDEX CONCURRENTLY idx_products_category ON products(category_id);

-- Particionamento por data (para tabelas muito grandes)
CREATE TABLE sales_y2024 PARTITION OF sales FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

#### Opção 2: Estratégia de Dados em Camadas

**Banco Híbrido:**
- **Dados Quentes**: Últimos 3-6 meses (banco gratuito)
- **Dados Frios**: Histórico antigo (arquivo CSV/S3 gratuito)

```javascript
// Estratégia de cache + archive
const getSalesData = async (brandId, months = 6) => {
  // Dados recentes do banco
  const recentData = await pool.query(`
    SELECT * FROM sales
    WHERE brand_id = $1 AND created_at >= NOW() - INTERVAL '${months} months'
  `, [brandId]);

  // Dados antigos do cache/S3 se necessário
  if (months > 6) {
    const archivedData = await getArchivedData(brandId, months);
    return [...recentData.rows, ...archivedData];
  }

  return recentData.rows;
};
```

#### Opção 3: Upgrade para Tier Pago Quando Necessário

**Supabase Pago (a partir de $25/mês):**
- ✅ Até 100GB storage
- ✅ Backup automático
- ✅ Read replicas

**Railway Pago (a partir de $5/mês):**
- ✅ Até 8GB RAM
- ✅ Até 100GB storage
- ✅ CPU dedicada

**Neon Pago (a partir de $19/mês):**
- ✅ Até 1TB storage
- ✅ Computação dedicada
- ✅ Backup automático

### Monitoramento de Uso

**Queries para Verificar Tamanho:**
```sql
-- Tamanho total do banco
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Tamanho por tabela
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Rows por tabela
SELECT schemaname, tablename, n_tup_ins - n_tup_del as rowcount
FROM pg_stat_user_tables
ORDER BY n_tup_ins - n_tup_del DESC;
```

### Estratégia de Migração

**Passos para Migrar Banco Grande:**

1. **Backup Completo:**
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

2. **Limpeza de Dados:**
   ```sql
   -- Script de limpeza antes da migração
   DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '1 year';
   DELETE FROM temp_sessions WHERE expires_at < NOW();
   ```

3. **Migração para Serviço Pago:**
   - Criar novo banco no serviço pago
   - Restaurar backup limpo
   - Atualizar connection string
   - Testar aplicação

4. **Otimização Pós-Migração:**
   ```sql
   -- Reindexar tudo
   REINDEX DATABASE current_database;

   -- Vacuum full
   VACUUM FULL;

   -- Analyze para estatísticas
   ANALYZE;
   ```

### Alternativas para Dados Muito Grandes

#### 1. ClickHouse (para Analytics)
- **Gratuito**: Community edition
- **Vantagem**: Compressão extrema, queries analíticas rápidas
- **Uso**: Migrar dados históricos para ClickHouse

#### 2. BigQuery (Google)
- **Gratuito**: 1TB queries/mês, 10GB storage
- **Vantagem**: Serverless, integração com Google Cloud

#### 3. Estratégia Multi-Banco
```
Aplicação → PostgreSQL (dados recentes) + ClickHouse (histórico)
```

### Checklist para Banco Grande

- [ ] Verificar tamanho atual: `SELECT pg_size_pretty(pg_database_size(current_database()));`
- [ ] Identificar tabelas grandes
- [ ] Avaliar dados necessários vs históricos
- [ ] Implementar limpeza automática
- [ ] Configurar monitoramento de crescimento
- [ ] Planejar upgrade quando aproximar limite

### Recomendação por Tamanho

- **< 100MB**: Qualquer opção gratuita
- **100MB - 500MB**: Supabase gratuito, Railway gratuito
- **500MB - 2GB**: Railway pago ($5/mês), Supabase pago ($25/mês)
- **> 2GB**: Neon pago ($19/mês), AWS RDS, Google Cloud SQL

### Scripts de Manutenção Automática

**Função para Limpeza Automática:**
```sql
CREATE OR REPLACE FUNCTION cleanup_old_data() RETURNS void AS $$
BEGIN
    -- Deletar vendas antigas (manter 1 ano)
    DELETE FROM sales WHERE created_at < NOW() - INTERVAL '1 year';

    -- Deletar logs antigos (manter 6 meses)
    DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '6 months';

    -- Limpar cache antigo
    DELETE FROM cache WHERE expires_at < NOW();

    -- Vacuum para liberar espaço
    VACUUM;
END;
$$ LANGUAGE plpgsql;

-- Executar limpeza mensal
SELECT cron.schedule('cleanup-old-data', '0 2 1 * *', 'SELECT cleanup_old_data();');
```

**Dica**: Comece otimizando e limpando dados antes de migrar para serviços pagos!
