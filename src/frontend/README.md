# Sistema de Gerenciamento de Notas

Sistema de gerenciamento de notas hierárquico construído com Nuxt 4, Vue 3, Prisma, e integração com Hugging Face AI.

## 🚀 Começando

### Pré-requisitos

- Node.js v18.x ou superior
- npm v9.x ou superior (ou yarn/pnpm)
- PostgreSQL (Neon database)
- Conta Hugging Face com API Key

### Instalação

1. **Entre no diretório do frontend**
```bash
cd src/frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite `.env` na raiz do repositório (ou em `src/frontend` se existir) e configure:
```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
HUGGING_FACE_API_KEY="hf_xxxxxxxxxxxx"
NODE_ENV="development"
NUXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Configure o banco de dados** (execute de dentro de `src/frontend`)
```bash
# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma migrate dev
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 📁 Estrutura do Projeto (src/frontend)

```
src/frontend/
├── package.json         # Dependências e scripts
├── nuxt.config.ts       # Configuração Nuxt
├── prisma/              # Prisma schema e migrations
├── server/              # API routes (markers, sub-markers, notes, ai)
│   ├── api/
│   └── utils/
├── components/          # Componentes Vue
├── composables/         # Composables
├── pages/               # Nuxt pages (auto-routes)
├── stores/              # Pinia stores
├── types/               # TypeScript types
├── utils/               # Funções utilitárias
└── assets/              # CSS e assets
```

## 🛠️ Stack Tecnológica

- **Framework**: Nuxt 4
- **Frontend**: Vue 3 + TypeScript
- **UI**: Tailwind CSS
- **State**: Pinia
- **ORM**: Prisma
- **Database**: Neon PostgreSQL
- **Editor**: TipTap
- **AI**: Hugging Face API
- **Validation**: Zod
- **Sanitization**: DOMPurify

## 📚 Documentação

Documentação completa disponível em:
- `outputs/product-owner/` - Requisitos e User Stories
- `outputs/architect/` - Arquitetura e decisões técnicas
- `outputs/ux/` - Wireframes e protótipos

## 🧪 Testes

```bash
npm run test
```

## 📦 Build

```bash
npm run build
```

## 🚢 Deploy

O projeto está pronto para deploy em plataformas que suportam Nuxt:
- Vercel
- Netlify
- Render

Configure as variáveis de ambiente no painel de deploy.

## 📝 Licença

MIT
