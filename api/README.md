# Backend Boilerplate

Backend API robusta usando Fastify e PostgreSQL, com suporte a WebSocket, filas de tarefas e boas práticas de desenvolvimento.

## 🚀 Tecnologias

- **Framework**: Fastify (v5.3.3)
- **Banco de Dados**: PostgreSQL com Prisma (v6.9.0)
- **WebSocket**: Socket.IO (v4.8.1)
- **Autenticação**: JWT com bcryptjs
- **Fila de Tarefas**: BullMQ
- **Email**: Nodemailer
- **API**: Swagger para documentação
- **Linguagem**: TypeScript (v5.8.3)

## 📋 Estrutura do Projeto

```
src/
├── config/         # Configurações do projeto
├── controllers/    # Controladores das rotas
├── plugins/        # Plugins do Fastify
├── queues/         # Implementação das filas
├── routes/         # Definição das rotas
├── services/       # Serviços da aplicação
├── types/          # Tipos TypeScript
├── index.ts        # Ponto de entrada principal
└── server.ts       # Configuração do servidor
```

## 🛠️ Requisitos

- Node.js (versão LTS)
- PostgreSQL
- Yarn (recomendado)

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositório]
cd backend-boilerplate
```

2. Instale as dependências:
```bash
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute as migrations do banco de dados:
```bash
yarn prisma:all
```

5. Inicie o servidor em modo de desenvolvimento:
```bash
yarn dev
```

## 📦 Scripts Disponíveis

- `yarn dev`: Inicia o servidor em modo de desenvolvimento
- `yarn build`: Compila o projeto
- `yarn start`: Inicia o servidor em modo de produção
- `yarn prisma:all`: Executa migrations, gera Prisma e popula banco
- `yarn studio`: Abre o Prisma Studio

## 🔐 Segurança

- Autenticação JWT
- Hashing de senhas com bcrypt
- Headers de segurança com Helmet
- CORS configurável
- Rate limiting

## 📖 Documentação da API

A documentação da API está disponível em Swagger através da rota `/docs` quando o servidor estiver rodando.

## 📝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo LICENSE para mais detalhes.

---

Desenvolvido com ❤️ usando TypeScript e melhores práticas de desenvolvimento.
