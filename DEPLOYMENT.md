# 🚀 Guia de Deploy - Nola God Level

## Opções de Deploy

### 1. Vercel (Recomendado para MVP/Rápido)

#### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com) ou [Railway](https://railway.app) para PostgreSQL

#### Passos para Deploy

1. **Configurar Banco de Dados**
   ```bash
   # No Supabase/Railway, crie um banco PostgreSQL
   # Execute o script database-schema.sql no banco
   ```

2. **Deploy no Vercel**
   ```bash
   # Instalar Vercel CLI
   npm install -g vercel

   # Login no Vercel
   vercel login

   # Deploy
   vercel --prod
   ```

3. **Configurar Environment Variables no Vercel**
   - `DATABASE_URL`: URL do seu banco PostgreSQL
   - `JWT_SECRET`: Chave secreta para JWT (gere uma segura)

4. **Acesso**
   - Frontend: `https://seu-projeto.vercel.app`
   - API: `https://seu-projeto.vercel.app/api/`

### 2. Heroku

#### Pré-requisitos
- Conta no [Heroku](https://heroku.com)
- Heroku CLI instalado

#### Passos
```bash
# Login no Heroku
heroku login

# Criar app
heroku create nola-god-level

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Configurar variáveis
heroku config:set JWT_SECRET=your-secret-key

# Deploy
git push heroku main
```

### 3. Digital Ocean App Platform

#### Pré-requisitos
- Conta na [Digital Ocean](https://digitalocean.com)

#### Passos
1. Conectar repositório GitHub
2. Configurar app spec:
   ```yaml
   name: nola-god-level
   services:
   - name: backend
     source_dir: backend
     github:
       repo: seu-user/nola-god-level
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: DATABASE_URL
       value: ${database.DATABASE_URL}
     - key: JWT_SECRET
       value: your-secret-key

   databases:
   - name: database
     engine: PG
     version: "14"
     size: basic
   ```

### 4. AWS (Produção Completa)

#### Serviços Necessários
- **EC2** ou **ECS** para aplicação
- **RDS PostgreSQL** para banco
- **CloudFront** + **S3** para frontend
- **API Gateway** + **Lambda** para serverless

#### Passos Básicos
1. Criar VPC e subnets
2. Configurar RDS PostgreSQL
3. Deploy backend no ECS
4. Deploy frontend no S3 + CloudFront

## 🔧 Configuração do Banco de Dados

### Opções de PostgreSQL na Nuvem

#### Supabase (Recomendado)
```sql
-- Execute no SQL Editor do Supabase
-- Cole o conteúdo do database-schema.sql
```

#### Railway
```bash
# Conectar via Railway CLI
railway connect

# Executar schema
psql $DATABASE_URL -f database-schema.sql
```

#### PlanetScale ou Neon
- Importar o `database-schema.sql`
- Ajustar tipos se necessário (MySQL vs PostgreSQL)

## 🌐 Configuração de Domínio

### Vercel
```bash
# Adicionar domínio customizado
vercel domains add seu-dominio.com
```

### Outros
- Configurar DNS para apontar para o serviço
- Adicionar SSL/TLS

## 🔒 Segurança

### Variáveis de Ambiente
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=chave-secreta-muito-forte
NODE_ENV=production
```

### CORS
- Configurar origens permitidas em produção
- Usar HTTPS sempre

## 📊 Monitoramento

### Vercel Analytics
- Automático no Vercel
- Métricas de performance

### Sentry para Error Tracking
```bash
npm install @sentry/react @sentry/tracing
```

### Logs
- Vercel: Dashboard de logs
- Heroku: `heroku logs --tail`
- AWS: CloudWatch

## 🚀 Otimização

### Frontend
```bash
# Build otimizado
npm run build

# Analisar bundle
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

### Backend
- Connection pooling para PostgreSQL
- Cache com Redis (opcional)
- Rate limiting

## 🔄 CI/CD

### GitHub Actions (Exemplo)
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🧪 Testes em Produção

### Checklist Pré-Deploy
- [ ] Banco de dados configurado
- [ ] Environment variables setadas
- [ ] Build passando localmente
- [ ] Testes executando
- [ ] CORS configurado
- [ ] HTTPS habilitado

### Pós-Deploy
- [ ] Frontend carregando
- [ ] API endpoints respondendo
- [ ] Login funcionando
- [ ] Dados carregando
- [ ] Performance aceitável

## 🆘 Troubleshooting

### Problemas Comuns

#### Erro de CORS
```javascript
// Adicionar no backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

#### Database Connection
```javascript
// Verificar connection string
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
```

#### Build Falhando
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📞 Suporte

Para dúvidas sobre deploy:
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Railway Docs: https://docs.railway.app
