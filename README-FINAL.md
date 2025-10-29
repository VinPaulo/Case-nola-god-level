# 🏪 Nola God Level - Dashboard Analytics

## 🎯 Visão Geral

Sistema completo de analytics para gestão de restaurantes, desenvolvido como case técnico. O dashboard permite à Maria, proprietária de três restaurantes fictícios, visualizar e analisar o desempenho de seus negócios através de métricas, gráficos e relatórios detalhados.

## 🚀 Início Rápido

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js (versão 14 ou superior)
- Navegador web moderno

### Instalação e Execução

1. **Clone o repositório** (se aplicável)
2. **Suba o banco de dados:**
   ```bash
   docker-compose up -d postgres
   ```

3. **Execute o gerador de dados:**
   ```bash
   docker-compose run --rm data-generator
   ```

4. **Suba a API:**
   ```bash
   docker-compose up -d api
   ```

5. **Inicie o frontend:**
   ```bash
   node serve.js
   ```

6. **Acesse o dashboard:**
   ```
   http://localhost:3001
   ```

### Validação do Sistema
```bash
node validate-system.js
```

## 🏗️ Arquitetura

### Stack Tecnológico
- **Backend**: Node.js + Express.js + PostgreSQL
- **Frontend**: HTML5 + CSS3 + JavaScript + Chart.js
- **Infraestrutura**: Docker + Docker Compose
- **Banco de Dados**: PostgreSQL com 500k registros de vendas

### Estrutura do Projeto
```
nola-god-level/
├── backend/                 # API Node.js
│   ├── config/             # Configuração do banco
│   ├── routes/             # Endpoints da API
│   └── server.js           # Servidor principal
├── database-schema.sql     # Schema do banco
├── docker-compose.yml      # Orquestração Docker
├── index.html              # Dashboard principal
├── serve.js                # Servidor frontend
└── validate-system.js      # Script de validação
```

## 📊 Funcionalidades

### Dashboard Principal
- **Métricas em Tempo Real**: Receita total, vendas, ticket médio, lojas ativas
- **Filtros Avançados**: Por marca, período, loja específica
- **Status do Sistema**: Indicadores visuais de conectividade

### Análises Disponíveis
1. **Top Produtos**: Ranking por vendas e receita com gráfico de pizza
2. **Performance por Canal**: Análise de delivery, balcão, drive-thru, etc.
3. **Performance por Loja**: Foco nos 3 restaurantes da Maria com gráfico de linha

### Restaurantes da Maria
1. **Restaurante Centro - Maria** (São Paulo, SP)
2. **Restaurante Shopping - Maria** (São Paulo, SP)
3. **Restaurante Zona Sul - Maria** (São Paulo, SP)

## 🔧 API Endpoints

### Saúde do Sistema
- `GET /api/health` - Status da API e banco de dados

### Vendas
- `GET /api/sales/summary` - Resumo de vendas
- `GET /api/sales/by-date` - Vendas por data

### Analytics
- `GET /api/analytics/top-products` - Top produtos
- `GET /api/analytics/revenue-by-channel` - Receita por canal
- `GET /api/analytics/maria-stores` - Performance das lojas da Maria

### Marcas
- `GET /api/brands` - Lista de marcas
- `GET /api/brands/:id` - Detalhes de uma marca

## 🎨 Interface

### Design System
- **Paleta**: Gradientes modernos (azul/roxo)
- **Tipografia**: Segoe UI
- **Componentes**: Cards com glassmorphism
- **Responsividade**: Mobile-first

### Experiência do Usuário
- Loading states com spinners
- Tratamento de erros com mensagens claras
- Feedback de sucesso
- Filtros intuitivos e responsivos

## 📈 Dados de Demonstração

- **500.000 vendas** distribuídas entre as lojas
- **Múltiplos canais** de venda
- **Produtos variados** com diferentes performances
- **Período de 1 ano** de dados históricos
- **3 restaurantes fictícios** da Maria com dados específicos

## 🛠️ Desenvolvimento

### Estrutura de Código
- **Modular**: Código organizado em módulos
- **Documentado**: Comentários explicativos
- **Testável**: Funções isoladas
- **Escalável**: Arquitetura preparada para crescimento

### Validação
O sistema inclui um script de validação completo que verifica:
- Status dos containers Docker
- Conectividade da API
- Funcionamento dos endpoints
- Integridade dos dados
- Interface do frontend

## 🚀 Deploy

### Docker
```bash
# Subir todos os serviços
docker-compose up -d

# Verificar status
docker ps

# Ver logs
docker-compose logs -f
```

### Desenvolvimento Local
```bash
# Backend
cd backend
npm install
npm start

# Frontend
node serve.js
```

## 📋 Checklist de Validação

- [x] Banco de dados PostgreSQL funcionando
- [x] API Node.js respondendo
- [x] Todos os endpoints funcionando
- [x] Frontend carregando corretamente
- [x] Gráficos Chart.js funcionando
- [x] Filtros operacionais
- [x] Dados das lojas da Maria carregados
- [x] Interface responsiva
- [x] Tratamento de erros
- [x] Loading states
- [x] Validação de dados

## 🎯 Próximos Passos

1. **Testes Automatizados**: Implementar suite de testes
2. **Autenticação**: Sistema de login e permissões
3. **Relatórios**: Exportação em PDF/Excel
4. **Notificações**: Alertas em tempo real
5. **Mobile App**: Aplicativo nativo

## 📞 Suporte

Para dúvidas ou problemas:
1. Execute `node validate-system.js` para diagnóstico
2. Verifique os logs com `docker-compose logs`
3. Confirme se todos os containers estão rodando com `docker ps`

---

**Desenvolvido como Case Técnico**  
**Tecnologias**: Node.js, PostgreSQL, Docker, HTML5, CSS3, JavaScript, Chart.js  
**Data**: 2024
