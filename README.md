# Frontend do Sistema de Delivery

Este repositório contém o frontend do sistema de delivery, desenvolvido com **React** e **PrimeReact** para a interface de usuário. A aplicação consome a API backend para gestão de restaurantes, pedidos e usuários.

## Tecnologias Utilizadas

- **React** (com Vite)
- **PrimeReact** (componentes UI)
- **React Router** (para navegação)
- **Axios** (requisições HTTP)
- **Context API** (gerenciamento de autenticação e estado global)
- **WebSockets** (para atualização em tempo real)

## Funcionalidades Principais

- Autenticação e gestão de usuários
- Cadastro e gerenciamento de restaurantes
- Criação e gestão de pedidos
- Painel administrativo para restaurantes
- Notificações em tempo real sobre status dos pedidos

## Como Rodar o Projeto

### 1. Clonar o Repositório
```bash
git clone https://github.com/W3SK3RRX/frontend-pedidos.git
cd frontend-pedidos
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e adicione:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WEBSOCKET_URL=ws://localhost:8000/ws/orders/
```

### 4. Rodar o Projeto
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`

## Estrutura de Pastas
```
frontend-delivery/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Conexão com API (Axios)
│   ├── context/         # Gerenciamento de estado
│   ├── styles/          # Arquivos de estilo
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Ponto de entrada
│   ├── routes.jsx       # Configuração das rotas
│   └── index.css        # Estilos globais
└── package.json         # Dependências do projeto
```

## Contribuição
Se desejar contribuir, siga os passos:
1. Faça um **fork** do repositório.
2. Crie uma nova branch: `git checkout -b minha-feature`.
3. Faça suas alterações e commit: `git commit -m 'Minha nova funcionalidade'`.
4. Envie para o repositório remoto: `git push origin minha-feature`.
5. Abra um **Pull Request**.

## Licença
Este projeto está sob a licença MIT.