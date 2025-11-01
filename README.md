# Nola God Level - Painel de Análises

Sistema de dashboard analítico completo para análise de dados de vendas, com alertas proativos e visualizações interativas.

## 🚀 Funcionalidades

### 📊 Dashboard Completo
- **Visão Geral**: Métricas principais, alertas proativos e gráficos de receita
- **Tendências**: Distribuição horária e performance por canal
- **Lojas**: Análise de performance individual das lojas
- **Produtos**: Top produtos e margens de lucro
- **Análises Avançadas**: Detecção de anomalias, retenção de clientes e performance de entrega
- **Consultas Personalizadas**: Construtor de queries com filtros avançados

### 🎯 Alertas Proativos
- **Role-based**: Diferentes níveis de detalhe por perfil (Sócio, Gerente, Marketing)
- **Inteligentes**: Detecção automática de quedas em vendas/receita, atrasos em entrega, etc.
- **Priorizados**: Severidade alta, média e baixa com cores distintas

### 📈 Visualizações
- Gráficos interativos (barras, linhas, pizza)
- Tabelas responsivas com filtros
- Export para CSV e PDF
- Interface moderna com Material-UI

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** com Express
- **PostgreSQL** para dados
- **Docker** para containerização

### Frontend
- **React** com Material-UI
- **Recharts** para gráficos
- **Axios** para API calls
- **React Router** para navegação

## 📋 Pré-requisitos

- Docker e Docker Compose
- Node.js (v16+)
- npm ou yarn
- PostgreSQL (via Docker)

## 🚀 Como Rodar a Aplicação

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd nola-god-level
```

### 2. Iniciar a Infraestrutura
```bash
# Parar containers existentes (se houver)
docker compose down

# Iniciar banco de dados e serviços
docker compose up -d
```

### 3. Configurar o Backend
```bash
# Entrar no diretório do backend
cd backend

# Instalar dependências
npm install

# Iniciar o servidor backend
npm start
```

### 4. Configurar o Frontend
```bash
# Em outro terminal, entrar no diretório do frontend
cd frontend

# Instalar dependências
npm install

# Fazer build de produção
npm run build

# Servir a aplicação
serve -s build
```

### 5. Acessar a Aplicação
- **Frontend**: http://localhost:(porta aleatória gerada pelo builder) / https://case-nola-god-level.vercel.app/
- **Backend API**: http://localhost:3001 / 

## 📁 Estrutura do Projeto

```
nola-god-level/
├── backend/                 # API Node.js/Express
│   ├── routes/             # Endpoints da API
│   ├── middleware/         # Middlewares
│   ├── config/            # Configurações
│   └── package.json
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Serviços (API calls)
│   │   └── App.js
│   └── package.json
├── database-schema.sql     # Schema do banco
├── docker-compose.yml      # Configuração Docker
└── README.md
```

## 🔧 Configuração do Banco de Dados

O banco PostgreSQL é configurado automaticamente via Docker Compose. O schema inicial está em `database-schema.sql`.


## 📊 Endpoints da API

### Marcas
- `GET /brands` - Listar marcas
- `GET /brands/:id/channels` - Canais de uma marca
- `GET /brands/:id/stores` - Lojas de uma marca

### Analytics
- `GET /analytics/alerts` - Alertas proativos
- `GET /analytics/anomalies` - Detecção de anomalias
- `GET /analytics/delivery-performance` - Performance de entrega
- `GET /analytics/customer-retention` - Retenção de clientes
- `GET /analytics/product-margins` - Margens de produtos
- `GET /analytics/top-products` - Top produtos
- `GET /analytics/revenue-by-channel` - Receita por canal
- `GET /analytics/revenue-by-store` - Receita por loja
- `GET /analytics/hourly-distribution` - Distribuição horária
- `GET /analytics/top-products-by-weekday` - Top produtos por dia
- `GET /analytics/revenue-by-day` - Receita por dia
- `POST /analytics/custom` - Consultas personalizadas

### Vendas
- `GET /sales/summary` - Resumo de vendas

## 🎨 Personalização

### Roles de Usuário
- **Sócio**: Acesso completo a todos os dados - Implementação futura
- **Gerente**: Foco em performance operacional - Implementação futura
- **Marketing**: Métricas de vendas e clientes - Implementação futura

### Temas
- Modo claro/escuro integrado
- Paleta de cores customizável
- Tipografia Roboto

## 📈 Alertas do Sistema

### Tipos de Alertas
- **Crítico (Vermelho)**: Quedas >15% em vendas/receita, atrasos >20%
- **Atenção (Laranja)**: Ticket médio baixo, crescimento positivo
- **Informação (Azul)**: Melhorias e oportunidades

### Configuração
Os thresholds dos alertas podem ser ajustados no backend conforme necessidade do negócio.

## 🔍 Desenvolvimento

### Scripts Disponíveis

#### Backend
```bash
cd backend
npm install          # Instalar dependências
npm start           # Iniciar servidor desenvolvimento
npm test            # Executar testes
npm run lint        # Verificar código
```

#### Frontend
```bash
cd frontend
npm install         # Instalar dependências
npm start          # Iniciar desenvolvimento
npm run build      # Build de produção
npm test           # Executar testes
npm run eject      # Ejetar Create React App
```

### Docker Development
```bash
# Desenvolvimento com hot reload
docker compose -f docker-compose.dev.yml up

# Produção
docker compose up -d
```


Desenvolvido com <3 para demonstrar excelência em desenvolvimento full-stack OBS: NÃO FOQUEI NO PRÊMIO, E SIM EM CONSEGUIR UM ESTÁGIO :)
