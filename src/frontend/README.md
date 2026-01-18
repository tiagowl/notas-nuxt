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
# Opcional: Modelo de IA (padrão: openai-community/gpt2)
# Para melhores resultados, use modelos instrucionais como:
# - mistralai/Mistral-7B-Instruct-v0.2 (melhor qualidade, pode exigir token pago)
# - google/flan-t5-base (bom para instruções)
# - microsoft/DialoGPT-large (diálogo)
HUGGING_FACE_MODEL="openai-community/gpt2"
NODE_ENV="development"
NUXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Nota sobre modelos de IA:**
- O modelo padrão (GPT-2) é limitado e pode gerar textos menos coerentes
- Para melhores resultados, configure um modelo instrucional via `HUGGING_FACE_MODEL`
- Alguns modelos podem exigir tokens pagos no Hugging Face
- Verifique a disponibilidade dos modelos no Router: https://huggingface.co/inference-api

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

## 🤖 Dicas para Geração de Conteúdo com IA

Para obter melhores resultados ao gerar conteúdo:

### Prompts Efetivos
- **Seja específico**: Inclua tema, público-alvo, tom e formato desejado
- **Forneça contexto**: Explique o propósito do texto (resumo, explicação, tutorial, etc.)
- **Mencione exemplos**: Se relevante, peça exemplos práticos ou estudos de caso
- **Defina estrutura**: Para textos longos, sugira seções ou subtópicos

### Exemplo de Prompt Eficaz
```
Escreva um resumo sobre derivadas parciais explicando: 
o que são, como calcular e suas aplicações práticas 
em problemas de otimização. Use linguagem acessível 
para estudantes universitários e inclua um exemplo prático.
```

### Modelos Recomendados

**Importante**: Nem todos os modelos estão disponíveis via Inference Providers do Hugging Face. Use modelos que estejam marcados como "Deployed by Inference Provider" no Hugging Face Hub.

**Modelos recomendados para seguir instruções bem (estilo ChatGPT)**:

1. **Llama 3.1 8B Instruct** (`meta-llama/Llama-3.1-8B-Instruct`) - ⭐ **Melhor para seguir instruções** - Muito bom em seguir comandos específicos
2. **Mistral-7B-Instruct** (`mistralai/Mistral-7B-Instruct-v0.2`) - Bom para instruções gerais
3. **GPT-2** (`openai-community/gpt2`) - Básico, mas amplamente disponível (não segue instruções tão bem)

⚠️ **Modelos que podem não estar disponíveis**:
- `google/flan-t5-base` - Não está implantado por Inference Providers (pode dar erro 404)
- `microsoft/DialoGPT-large` - Verificar disponibilidade

**Dica**: Para melhor qualidade de resposta às suas instruções, use `meta-llama/Llama-3.1-8B-Instruct`.

Configure via `HUGGING_FACE_MODEL` no `.env`:
```env
HUGGING_FACE_MODEL=meta-llama/Llama-3.1-8B-Instruct
```

Para verificar se um modelo está disponível, visite a página do modelo no [Hugging Face Hub](https://huggingface.co/models) e procure por "Deployed by Inference Provider".

### Configuração da API Key

**Importante**: Para evitar erros 404, certifique-se de:

1. **Token com permissões corretas**: 
   - Acesse [Hugging Face Settings → Access Tokens](https://huggingface.co/settings/tokens)
   - Crie um token do tipo **"Fine-grained"** ou use um token **"Read"** que tenha permissão para Inference API
   - Tokens antigos podem não ter as permissões necessárias

2. **Modelo disponível**:
   - Verifique se o modelo está disponível para inferência na página do modelo no Hugging Face Hub
   - Alguns modelos podem estar temporariamente indisponíveis ou requerer permissões especiais

3. **Verificar variáveis de ambiente**:
   ```env
   HUGGING_FACE_API_KEY=seu_token_aqui
   HUGGING_FACE_MODEL=openai-community/gpt2  # Opcional, padrão é gpt2
   ```

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
