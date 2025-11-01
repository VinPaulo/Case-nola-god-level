# 🚀 Guia de Deploy 100% Gratuito - Nola God Level

## Opções de Deploy Gratuitas

### 1. Vercel + Supabase (Recomendado - Mais Fácil)

#### Pré-requisitos
- Conta no [Vercel](https://vercel.com) (gratuito)
- Conta no [Supabase](https://supabase.com) (gratuito - 500MB DB)

#### Passos para Deploy

1. **Configurar Banco no Supabase**
   ```bash
   # Criar projeto no Supabase
   # Ir em SQL Editor
   # Executar o conteúdo do database-schema.sql
   ```

2. **Deploy no Vercel**
   ```bash
   # Instalar Vercel CLI
   npm install -g vercel

   # Login
   vercel login

   # Primeiro deploy
   vercel

   # Deploy para produção
   vercel --prod
   ```

3. **Configurar Environment Variables**
   No dashboard Vercel → Project Settings → Environment Variables:
   ```
   DATABASE_URL = postgresql://[user]:[password]@[host]:5432/postgres
   JWT_SECRET = uma-chave-secreta-muito-forte-aqui
   ```

4. **Acesso**
   - Frontend: `https://seu-projeto.vercel.app`
   - API: `https://seu-projeto.vercel.app/api/`

#### Limites Gratuitos Vercel
- ✅ 100GB bandwidth/mês
- ✅ 1000 funções serverless/mês
- ✅ Domínios customizados gratuitos
- ✅ Deploy automático do Git

#### Limites Gratuitos Supabase
- ✅ 500MB PostgreSQL
- ✅ 50MB file storage
- ✅ 50.000 rows por tabela
- ✅ 500MB bandwidth

### 2. Render + Railway (Alternativa Completa)

#### Pré-requisitos
- Conta no [Render](https://render.com) (gratuito)
- Conta no [Railway](https://railway.app) (gratuito)

#### Passos

1. **Banco no Railway**
   ```bash
   # Criar projeto no Railway
   # Adicionar PostgreSQL
   # Copiar DATABASE_URL
   # Executar schema via Railway CLI ou interface
   ```

2. **Backend no Render**
   - Conectar GitHub
   - Escolher "Web Service"
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Adicionar env vars: `DATABASE_URL`, `JWT_SECRET`

3. **Frontend no Render**
   - Mesmo processo
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start` (ou usar static site)

#### Limites Gratuitos
- **Railway**: 512MB RAM, 1GB storage, $5/mês crédito
- **Render**: 750 horas/mês, 1GB storage

### 3. Netlify + PlanetScale (Frontend + DB)

#### Pré-requisitos
- Conta no [Netlify](https://netlify.com) (gratuito)
- Conta no [PlanetScale](https://planetscale.com) (gratuito - MySQL)

#### Passos

1. **Banco no PlanetScale**
   ```sql
   -- Criar database
   -- Executar schema adaptado para MySQL
   ```

2. **Deploy no Netlify**
   ```bash
   # Instalar Netlify CLI
   npm install -g netlify-cli

   # Login
   netlify login

   # Deploy
   netlify deploy --prod --dir=build
   ```

#### Limites Gratuitos
- **Netlify**: 100GB bandwidth, funções serverless limitadas
- **PlanetScale**: 1 database, 1GB storage

### 4. Vercel + Neon (PostgreSQL Serverless)

#### Neon - PostgreSQL Serverless Gratuito
- ✅ 512MB storage
- ✅ Computação baseada em uso
- ✅ Auto-scaling

```bash
# Mesmo processo do Vercel + Supabase
# Apenas trocar DATABASE_URL do Neon
```

## 🔧 Configuração do Banco Gratuito

### Supabase (Recomendado)
1. Criar projeto
2. Ir em Settings → Database → Connection string
3. Usar URI pooling para produção

### Railway
1. Criar projeto
2. Adicionar PostgreSQL
3. Copiar DATABASE_URL das variáveis

### Neon
1. Criar projeto
2. Connection string na dashboard
3. Usar `?sslmode=require` para SSL

## 🌐 Domínios Gratuitos

### Vercel
- ✅ Domínios `.vercel.app` gratuitos
- ✅ Domínios customizados com GitHub Student Pack

### Netlify
- ✅ Domínios `.netlify.app` gratuitos
- ✅ Branch deploys gratuitos

## 🔒 Segurança Gratuita

### Environment Variables
```env
# Sempre use variáveis de ambiente
DATABASE_URL=postgres://...
JWT_SECRET=chave-forte-aqui
NODE_ENV=production
```

### HTTPS Automático
- ✅ Vercel: Automático
- ✅ Netlify: Automático
- ✅ Render: Automático

## 📊 Monitoramento Gratuito

### Vercel Analytics
- ✅ Automático no dashboard
- ✅ Métricas de performance

### Supabase Logs
- ✅ Query logs
- ✅ Error logs

## 🚀 Otimizações para Free Tier

### Database
```sql
-- Criar índices para queries frequentes
CREATE INDEX idx_sales_brand_date ON sales(brand_id, created_at);
CREATE INDEX idx_sales_channel ON sales(channel_id);
```

### Frontend
```javascript
// Lazy loading de componentes
const Analytics = lazy(() => import('./components/Analytics'));

// Compressão de imagens
// Usar WebP quando possível
```

### Backend
```javascript
// Connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5, // Limitar conexões
  ssl: { rejectUnauthorized: false }
});
```

## 🔄 CI/CD Gratuito

### GitHub Actions (Gratuito)
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🧪 Checklist Pré-Deploy

- [ ] Conta criada nas plataformas escolhidas
- [ ] Banco configurado e schema executado
- [ ] Environment variables definidas
- [ ] Build testado localmente
- [ ] CORS configurado para produção
- [ ] HTTPS habilitado

## 🆘 Troubleshooting Free Tier

### Problemas Comuns

#### Limite de Bandwidth Atingido
```
Soluções:
- Otimizar imagens
- Usar CDN do Vercel/Netlify
- Implementar cache
```

#### Database Storage Cheio
```
Soluções:
- Limpar dados antigos
- Arquivar dados históricos
- Upgrade para tier pago quando necessário
```

#### Cold Starts
```
Soluções:
- Usar regiões mais próximas
- Otimizar funções serverless
- Cache de dados frequentes
```

## 💡 Recomendação Final

**Para começar: Vercel + Supabase**
- Mais fácil de configurar
- Melhor performance
- Escalabilidade automática
- Suporte brasileiro

**Fluxo:**
1. Criar Supabase → executar schema
2. Deploy Vercel → configurar env vars
3. Testar aplicação
4. Configurar domínio (opcional)

**Custo Total: $0** 🚀
