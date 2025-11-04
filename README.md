# 🎯 Nola God Level - Dashboard de análise de restaurantes

## 📋 Visão Geral

Este projeto implementa um sistema completo de analytics para gestão de restaurantes, desenvolvido como case técnico para demonstração de competências em desenvolvimento full-stack. O dashboard permite visualizar e analisar o desempenho de múltiplos restaurantes através de métricas, gráficos e relatórios detalhados.

## 🎯 Objetivo

Criar um dashboard de analytics que permita à Maria, proprietária de três restaurantes fictícios, visualizar e analisar o desempenho de seus negócios através de métricas, gráficos e relatórios detalhados.

## ✨ Features

### 📊 Análises Disponíveis

- **Top Produtos**: Ranking dos produtos mais vendidos com gráfico de pizza interativo
- **Performance por Canal**: Análise comparativa de delivery, balcão, drive-thru, etc.
- **Performance por Loja**: Gráfico de linha mostrando evolução e comparação entre lojas
- **Resumo de Vendas**: Métricas gerais de vendas, receita e ticket médio
- **Distribuição Horária**: Análise de vendas por horário do dia
- **Margens por Produto**: Análise de lucratividade por produto
- **Retenção de Clientes**: Métricas de fidelidade
- **Performance de Delivery**: Análise específica do canal delivery
- **Detecção de Anomalias**: Identificação de padrões irregulares

### 🏗️ Arquitetura

- **Separação Frontend/Backend**: Arquitetura full-stack independente
- **API RESTful**: Endpoints bem estruturados para dados analíticos
- **Banco PostgreSQL**: Dados relacionais com suporte a queries complexas
- **Containerização Docker**: Ambiente consistente e isolado
- **Cache Otimizado**: Performance com cache de 5 minutos para dados analíticos

### 🎨 Interface

- **Design Moderno**: Paleta azul/roxo com glassmorphism
- **Responsivo**: Mobile-first design
- **Componentes Reutilizáveis**: Material-UI para consistência
- **Gráficos Interativos**: Recharts para visualizações ricas

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Componentes funcionais com hooks
- **Material-UI**: Design system profissional
- **Recharts**: Gráficos interativos e responsivos
- **Axios**: Cliente HTTP para API

### Backend
- **Node.js + Express**: API RESTful performante
- **PostgreSQL**: Banco de dados relacional
- **Docker**: Containerização completa

### Infraestrutura
- **Docker Compose**: Orquestração de serviços
- **Nginx**: Servidor web otimizado para produção
- **Scripts de Automação**: Controle completo do sistema

## 📋 Pré-requisitos

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)
- **Node.js** 18+ (opcional, para desenvolvimento local)
- **Git** (para versionamento)

## 🚀 Instalação e Execução

### Solução de Problemas com Docker no Windows
Se o comando `docker compose up -d postgres` falhar com erro de pipe:
1. Instale Docker Desktop de https://www.docker.com/products/docker-desktop
2. Reinicie o PC após instalação
3. Execute `docker --version` para verificar
4. Tente novamente o comando


### Inicialização com Docker (Recomendada)

```bash
# Clone o repositório
git clone https://github.com/VinPaulo/Case-nola-god-level
cd nola-god-level

# Build do gerador de dados (opcional, para garantir cache limpo)
docker compose build --no-cache data-generator

# Subir banco de dados
docker compose up -d postgres

# Executar gerador de dados
docker compose run --rm data-generator python generate_data.py --db-url postgresql://challenge:challenge_2024@postgres:5432/challenge_db

# Subir pgAdmin para administração do banco (opcional)
docker compose --profile tools up -d pgadmin

# Inicialização completa do sistema (API + Frontend)
docker compose up -d api frontend

# Aguardar alguns minutos para inicialização completa

# Verificar se os dados foram gerados
docker compose exec postgres psql -U challenge -d challenge_db -c 'SELECT COUNT(*) FROM sales;'

# Acessar o dashboard
# http://localhost:3001
```

## 🔧 Comandos Docker
Esta seção contém comandos úteis para resolver problemas comuns com Docker. Explicamos de forma simples o que cada comando faz e quando usá-lo.

### Problemas Comuns e Soluções

#### 1. **Erro ao subir serviços (containers não iniciam)**
```bash
# Parar todos os serviços em execução
docker compose down

# Limpar imagens e caches não utilizados (libera espaço)
docker system prune -f

# Rebuildar um serviço específico (exemplo: data-generator)
docker compose build data-generator

# Subir os serviços novamente
docker compose up -d
```

#### 2. **Problemas com o banco de dados PostgreSQL**
```bash
# Ver os logs do banco de dados para identificar erros
docker compose logs postgres

# Reiniciar apenas o banco de dados
docker compose restart postgres

# Entrar no banco para executar comandos SQL diretamente
docker compose exec postgres psql -U challenge -d challenge_db
```

#### 3. **API não responde ou dá erro**
```bash
# Ver logs da API para ver mensagens de erro
docker compose logs api

# Reiniciar a API
docker compose restart api

# Testar se a API está funcionando (deve retornar status)
curl http://localhost:3000/api/health
```

#### 4. **Frontend não carrega no navegador**
```bash
# Ver logs do frontend
docker compose logs frontend

# Reiniciar o frontend
docker compose restart frontend

# Verificar se a porta 3001 está sendo usada por outro programa
netstat -an | find "3001"
```

#### 5. **Dados não foram gerados ou estão faltando**
```bash
# Executar o gerador de dados novamente
docker compose run --rm data-generator 

# Verificar quantos registros existem na tabela de vendas
docker compose exec postgres psql -U challenge -d challenge_db -c 'SELECT COUNT(*) FROM sales;'
```

#### 6. **Limpeza completa do sistema**
```bash
# Parar serviços e remover containers, volumes e redes
docker compose down -v

# Limpar imagens, containers e volumes não utilizados
docker system prune -f
docker volume prune -f
```

#### 7. **Atualizar imagens e rebuildar tudo**
```bash
# Baixar as últimas versões das imagens do Docker Hub
docker compose pull

# Rebuildar todos os serviços do zero (ignora cache)
docker compose build --no-cache
```

#### 8. **Verificar status dos serviços**
```bash
# Listar todos os containers e seu status
docker compose ps

# Ver logs de todos os serviços de uma vez
docker compose logs
```

#### 9. **Gerenciar pgAdmin (ferramenta opcional para visualizar banco)**
```bash
# Subir pgAdmin para administração visual do banco
docker compose --profile tools up -d pgadmin

# Ver logs do pgAdmin
docker compose logs pgadmin

# Parar pgAdmin
docker compose --profile tools down pgadmin
```

### Dicas Gerais
- **Sempre verifique logs primeiro**: Use `docker compose logs [serviço]` para entender o erro
- **Reinicie serviços específicos**: Evite parar tudo se só um serviço está com problema
- **Limpe regularmente**: Execute `docker system prune` para liberar espaço em disco
- **Verifique portas**: Certifique-se que portas 3000 (API) e 3001 (frontend) não estão ocupadas
- **Banco de dados**: Se o PostgreSQL não conectar, aguarde alguns segundos após subir o container

### Inicialização Manual

```bash
# 1. Subir o banco de dados
docker compose up -d postgres

# 2. Executar o gerador de dados
docker compose run --rm data-generator python generate_data.py --db-url postgresql://challenge:challenge_2024@postgres:5432/challenge_db

# 3. Criar uma brand inicial - exemplo
# docker exec -it godlevel-db psql -U challenge -d challenge_db -c "INSERT INTO brands (name) VALUES ('Paulo`s Solution');"

# 4. Subir a API
docker compose up -d api

# 5. Iniciar o frontend (em outro terminal)
cd frontend
npm install
npm start

# 6. Acessar o dashboard
# http://localhost:3001
```

### Desenvolvimento Local

```bash
# Backend (terminal 1)
cd backend
npm install
npm start

# Frontend (terminal 2)
cd frontend
npm install
npm start

# Acessar: http://localhost:3001
```

### API Standalone (Apenas Backend)

```bash
# 1. Subir banco de dados
docker compose up -d postgres

# 2. Executar gerador de dados
docker compose run --rm data-generator

# 3. Iniciar API
docker compose up -d api

# 4. Testar endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/brands
curl "http://localhost:3000/api/sales/summary?brand_id=1"
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Health Check
```http
GET /api/health
```
Retorna status do sistema.

#### Brands
```http
GET /api/brands
```
Retorna lista de restaurantes/lojas.

#### Sales Summary
```http
GET /api/sales/summary?brand_id={id}&start_date={date}&end_date={date}
```
Retorna métricas agregadas de vendas.

#### Analytics Data
```http
GET /api/analytics/{endpoint}?brand_id={id}&filters...
```
Endpoints específicos para cada análise:
- `/top-products`
- `/channel-performance`
- `/store-performance`
- `/hourly-distribution`
- `/revenue-chart`
- `/customer-retention`
- `/delivery-performance`
- `/product-margins`
- `/anomalies`


### Respostas
Todas as respostas seguem o formato JSON:
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🔧 Desenvolvimento

### Estrutura do Projeto
```
nola-god-level/
├── backend/                 # API Node.js
│   ├── config/             # Configuração do banco
│   ├── routes/             # Endpoints da API
│   ├── utils/              # Utilitários (cache, etc.)
│   └── server.js           # Servidor principal
├── frontend/                # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── services/       # Cliente API
│   │   └── App.js          # App principal
│   ├── public/             # Arquivos estáticos
│   └── package.json        # Dependências
├── database-schema.sql     # Schema PostgreSQL
├── docker-compose.yml      # Orquestração
├── generate_data.py        # Gerador de dados
├── start-system.js         # Inicialização
├── stop-system.js          # Parada
└── validate-system.js      # Validação
```

### Scripts Disponíveis

```bash
# Backend
cd backend
npm test          # Executar testes
npm run lint      # Verificar código
npm run dev       # Desenvolvimento com nodemon

# Frontend
cd frontend
npm test          # Testes React
npm run build     # Build de produção
npm run eject     # Ejetar Create React App
```

### Banco de Dados

O schema está definido em `database-schema.sql`:
- Tabela `brands`: Informações das lojas
- Tabela `products`: Catálogo de produtos
- Tabela `sales`: Registros de vendas (500k registros)

### Geração de Dados

```bash
# Executar gerador de dados
docker compose run --rm data-generator

# Ou localmente
python generate_data.py
```

## 🧪 Validação e Testes

### Script de Validação Automática
```bash
node validate-system.js
```

Verifica:
- ✅ Conectividade com banco de dados
- ✅ API endpoints responding
- ✅ Dados inseridos corretamente
- ✅ Frontend carregando
- ✅ Serviços Docker ativos

### Testes Manuais
```bash
# API Health
curl http://localhost:3000/api/health

# Frontend
open http://localhost:3001

# Database
docker compose exec postgres psql -U challenge -d challenge_db
```

## 🚀 Deploy em Produção

### Preparação
```bash
# Build de produção
cd frontend
npm run build

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com configurações de produção
```

### Docker Compose Produção
```bash
# Usar configuração de produção
docker compose -f docker-compose.prod.yml up -d

# Ou com nginx customizado
docker compose -f docker-compose.prod.yml -f docker-compose.nginx.yml up -d
```

### Configurações de Produção
- **Nginx**: Servidor web otimizado
- **SSL**: Configurado para HTTPS
- **Cache**: Headers apropriados
- **Compressão**: Gzip habilitado


### Padrões de Código
- **ESLint**: Configurado para React/Node.js
- **Prettier**: Formatação automática
- **Husky**: Pre-commit hooks


## 📞 Contato

- 📧 Email: paulovinaudmoreira@gmail.com

## 🎉 Resultado Final

**Sistema 100% funcional e pronto para demonstração!**

- ✅ **Dashboard**: http://localhost:3001
- ✅ **API**: http://localhost:3000
- ✅ **Validação**: Todos os testes passando
- ✅ **Performance**: Carregamento rápido e responsivo
- ✅ **Dados**: 3 restaurantes da Maria com dados reais
- ✅ **Interface**: Profissional e intuitiva

---

**Desenvolvido com <3 para demonstrar excelência em desenvolvimento full-stack OBS: NÃO FOQUEI NO PRÊMIO, E SIM EM CONSEGUIR UM ESTÁGIO :)**
