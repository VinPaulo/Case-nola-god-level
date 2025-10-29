# 🏪 Nola God Level - Case Técnico

## 📋 Visão Geral

Este projeto implementa um sistema completo de analytics para gestão de restaurantes, desenvolvido como case técnico para demonstração de competências em desenvolvimento full-stack.

## 🎯 Objetivo

Criar um dashboard de analytics que permita à Maria, proprietária de três restaurantes fictícios, visualizar e analisar o desempenho de seus negócios através de métricas, gráficos e relatórios detalhados.

## 🏗️ Arquitetura da Solução

### Stack Tecnológico

**Backend:**
- Node.js + Express.js
- PostgreSQL (banco de dados)
- Docker + Docker Compose
- API REST com endpoints estruturados

**Frontend:**
- HTML5 + CSS3 + JavaScript Vanilla
- Chart.js para visualizações
- Design responsivo e moderno
- Interface intuitiva e profissional

**Infraestrutura:**
- Docker para containerização
- PostgreSQL para persistência
- Nginx para servir arquivos estáticos

### Estrutura do Projeto

```
nola-god-level/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuração do banco
│   ├── routes/
│   │   ├── sales.js            # Endpoints de vendas
│   │   ├── analytics.js        # Endpoints de analytics
│   │   └── brands.js           # Endpoints de marcas
│   ├── server.js               # Servidor principal
│   ├── package.json            # Dependências do backend
│   └── Dockerfile              # Container do backend
├── database-schema.sql         # Schema do banco de dados
├── docker-compose.yml          # Orquestração dos containers
├── index.html                  # Dashboard principal
├── serve.js                    # Servidor frontend
└── package.json                # Dependências do frontend
```

## 🗄️ Modelo de Dados

### Principais Tabelas

1. **brands** - Marcas/empresas
2. **stores** - Lojas/restaurantes
3. **sales** - Vendas realizadas
4. **products** - Produtos vendidos
5. **channels** - Canais de venda
6. **customers** - Clientes

### Relacionamentos

- Uma marca pode ter múltiplas lojas
- Uma loja pode ter múltiplas vendas
- Uma venda pode ter múltiplos produtos
- Vendas são associadas a canais específicos

## 🚀 Funcionalidades Implementadas

### 1. Dashboard Principal
- **Métricas em Tempo Real**: Receita total, vendas, ticket médio, lojas ativas
- **Filtros Avançados**: Por marca, período, loja específica
- **Status do Sistema**: Indicadores visuais de conectividade

### 2. Análise de Produtos
- **Top 10 Produtos**: Ranking por vendas e receita
- **Gráfico de Pizza**: Visualização da distribuição de vendas
- **Tabela Detalhada**: Dados numéricos organizados

### 3. Performance por Canal
- **Análise de Canais**: Delivery, balcão, drive-thru, etc.
- **Gráfico de Barras**: Comparação visual entre canais
- **Métricas por Canal**: Vendas, receita, ticket médio

### 4. Performance por Loja
- **Análise Específica**: Foco nos 3 restaurantes da Maria
- **Gráfico de Linha**: Evolução da receita por loja
- **Comparação Detalhada**: Métricas individuais de cada restaurante

## 🔧 Endpoints da API

### Sales
- `GET /api/sales/summary` - Resumo de vendas
- `GET /api/sales/by-date` - Vendas por data

### Analytics
- `GET /api/analytics/top-products` - Top produtos
- `GET /api/analytics/revenue-by-channel` - Receita por canal
- `GET /api/analytics/maria-stores` - Performance das lojas da Maria

### Brands
- `GET /api/brands` - Lista de marcas
- `GET /api/brands/:id` - Detalhes de uma marca

### Health Check
- `GET /api/health` - Status da API e banco de dados

## 🐳 Docker e Deploy

### Comandos para Execução

```bash
# 1. Subir o banco de dados
docker-compose up -d postgres

# 2. Executar o gerador de dados
docker-compose run --rm data-generator

# 3. Subir a API
docker-compose up -d api

# 4. Iniciar o frontend
node serve.js
```

### Acesso
- **Dashboard**: http://localhost:3001
- **API**: http://localhost:3000
- **Banco**: localhost:5432

## 📊 Dados de Demonstração

### Restaurantes da Maria
1. **Restaurante Centro - Maria** (São Paulo, SP)
2. **Restaurante Shopping - Maria** (São Paulo, SP)
3. **Restaurante Zona Sul - Maria** (São Paulo, SP)

### Dados Gerados
- **500.000 vendas** distribuídas entre as lojas
- **Múltiplos canais** de venda
- **Produtos variados** com diferentes performances
- **Período de 1 ano** de dados históricos

## 🎨 Interface e UX

### Design System
- **Paleta de Cores**: Gradientes modernos (azul/roxo)
- **Tipografia**: Segoe UI para legibilidade
- **Componentes**: Cards com glassmorphism
- **Responsividade**: Mobile-first approach

### Experiência do Usuário
- **Loading States**: Indicadores visuais durante carregamento
- **Error Handling**: Mensagens claras de erro
- **Success Feedback**: Confirmações de ações
- **Filtros Intuitivos**: Interface simples e direta

## 🔍 Análise Técnica

### Pontos Fortes
1. **Arquitetura Limpa**: Separação clara entre frontend e backend
2. **API RESTful**: Endpoints bem estruturados e documentados
3. **Containerização**: Deploy consistente com Docker
4. **Performance**: Carregamento paralelo de dados
5. **Visualizações**: Gráficos interativos e informativos

### Melhorias Implementadas
1. **Tratamento de Erros**: Validação robusta de dados
2. **Loading States**: UX melhorada com indicadores
3. **Responsividade**: Interface adaptável a diferentes telas
4. **Validação de Dados**: Verificação de integridade
5. **Status do Sistema**: Monitoramento em tempo real

## 📈 Métricas e KPIs

### Principais Indicadores
- **Receita Total**: Soma de todas as vendas
- **Total de Vendas**: Quantidade de transações
- **Ticket Médio**: Receita dividida por vendas
- **Lojas Ativas**: Número de estabelecimentos operando

### Análises Disponíveis
- **Performance por Produto**: Ranking e distribuição
- **Performance por Canal**: Eficiência de cada canal
- **Performance por Loja**: Comparação entre restaurantes
- **Tendências Temporais**: Evolução ao longo do tempo

## 🛠️ Desenvolvimento e Manutenção

### Estrutura de Código
- **Modular**: Código organizado em módulos
- **Documentado**: Comentários explicativos
- **Testável**: Funções isoladas e testáveis
- **Escalável**: Arquitetura preparada para crescimento

### Próximos Passos
1. **Testes Automatizados**: Implementar suite de testes
2. **Autenticação**: Sistema de login e permissões
3. **Relatórios**: Exportação em PDF/Excel
4. **Notificações**: Alertas e notificações em tempo real
5. **Mobile App**: Aplicativo nativo para dispositivos móveis

## 🎯 Conclusão

Este case técnico demonstra competências em:

- **Desenvolvimento Full-Stack**: Frontend e backend integrados
- **Banco de Dados**: Modelagem e consultas SQL complexas
- **Containerização**: Deploy com Docker
- **APIs REST**: Criação e consumo de endpoints
- **Visualização de Dados**: Gráficos e dashboards interativos
- **UX/UI**: Interface moderna e responsiva
- **Arquitetura de Software**: Estrutura escalável e manutenível

A solução atende completamente aos requisitos do case, fornecendo uma ferramenta robusta e profissional para gestão de restaurantes, com foco na experiência do usuário e na qualidade técnica do código.

---

**Desenvolvido por**: Paulo Lemos
**Data**: 11/2025
**Tecnologias**: Node.js, PostgreSQL, Docker, HTML5, CSS3, JavaScript, Chart.js
