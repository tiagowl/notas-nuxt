# Documentação Técnica - Sistema de Gerenciamento de Notas

## 1. Stack Tecnológica

### Frontend

#### Framework Principal
- **Nuxt v4**: Framework meta para Vue.js
  - Versão: 4.x (latest stable)
  - Features: SSR, SSG, Auto-imports, File-based routing
  - Justificativa: Requisito obrigatório do projeto

#### Linguagem
- **TypeScript**: Type safety e melhor DX
  - Versão: 5.x
  - Configuração: `tsconfig.json` com strict mode

#### UI Components
- **shadcn ui vue**: Componentes UI baseados em Radix Vue
  - Versão: Latest
  - Design System: Tailwind CSS
  - Justificativa: Requisito obrigatório do projeto

#### State Management
- **Pinia**: Gerenciamento de estado
  - Versão: Latest
  - Módulo: `@pinia/nuxt`
  - Stores: markers, notes, ui
  - Justificativa: Requisito obrigatório, padrão Vue 3

#### Rich Text Editor
- **TipTap**: Editor rich text para Vue
  - Alternativas consideradas: Quill, Trix
  - Justificativa: Melhor integração com Vue 3, extensível

#### CSS Framework
- **Tailwind CSS**: Utility-first CSS
  - Versão: 3.x
  - Integração: Via Nuxt Tailwind module

### Backend

#### Framework
- **Nuxt Server Routes**: API routes do Nuxt
  - Localização: `server/api/`
  - Convenção: File-based routing
  - Justificativa: Integração nativa com Nuxt

#### ORM
- **Prisma**: Type-safe ORM
  - Versão: Latest
  - Módulo: `@prisma/nuxt`
  - Migrations: Prisma Migrate
  - Justificativa: Requisito obrigatório, type safety

#### Validação
- **Zod**: Schema validation
  - Versão: Latest
  - Uso: Validação de request/response
  - Alternativa: Joi, Yup
  - Justificativa: TypeScript-first, type inference

#### Sanitização
- **DOMPurify**: HTML sanitization
  - Versão: Latest
  - Uso: Sanitizar rich text antes de salvar
  - Justificativa: Segurança XSS

### Banco de Dados

#### Banco de Dados
- **Neon PostgreSQL**: Serverless PostgreSQL
  - Versão: PostgreSQL 16
  - Features: Auto-scaling, Point-in-time recovery
  - Justificativa: Requisito obrigatório

#### Migrations
- **Prisma Migrate**: Gerenciamento de migrations
  - Comandos: `prisma migrate dev`, `prisma migrate deploy`
  - Versionamento: Git-tracked migration files

### Integrações Externas

#### API de IA
- **Hugging Face Inference API**: Geração de conteúdo
  - Endpoint: `https://api-inference.huggingface.co/models/*`
  - Autenticação: API Token (env variable)
  - Modelo: A ser definido (ex: GPT-like model)
  - Justificativa: Requisito obrigatório

---

## 2. Modelo de Dados (Schema Prisma)

### Schema Prisma

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Marker {
  id         String      @id @default(cuid())
  name       String      @db.VarChar(255)
  userId     String?     // Future: user authentication
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  
  subMarkers SubMarker[]
  
  @@index([userId])
  @@map("markers")
}

model SubMarker {
  id        String   @id @default(cuid())
  name      String   @db.VarChar(255)
  markerId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  marker Marker @relation(fields: [markerId], references: [id], onDelete: Cascade)
  notes  Note[]
  
  @@index([markerId])
  @@map("sub_markers")
}

model Note {
  id          String   @id @default(cuid())
  title       String   @db.VarChar(255)
  content     String   @db.Text
  subMarkerId String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  subMarker SubMarker @relation(fields: [subMarkerId], references: [id], onDelete: Cascade)
  
  @@index([subMarkerId])
  @@index([createdAt])
  @@map("notes")
}
```

### Relacionamentos

```
Marker (1) ──< (N) SubMarker (1) ──< (N) Note

Cascade Deletes:
- Deletar Marker → deleta todos SubMarkers → deleta todas Notes
- Deletar SubMarker → deleta todas Notes
```

### Índices

- **markers.userId**: Para filtragem por usuário (futuro)
- **sub_markers.markerId**: Para queries eficientes de sub-marcadores
- **notes.subMarkerId**: Para queries eficientes de notas
- **notes.createdAt**: Para ordenação por data

---

## 3. Estrutura de Código

### Convenções de Nomenclatura

#### Arquivos e Diretórios
- **Componentes**: PascalCase (`MarkerCard.vue`)
- **Composables**: camelCase com prefixo `use` (`useMarkers.ts`)
- **Stores**: camelCase (`markersStore.ts`)
- **API Routes**: kebab-case (`markers.get.ts`)
- **Utils**: camelCase (`formatDate.ts`)

#### Variáveis e Funções
- **Variáveis**: camelCase (`markerList`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_TITLE_LENGTH`)
- **Funções**: camelCase (`createMarker()`)
- **Classes**: PascalCase (`MarkerService`)

#### Componentes Vue
- **Props**: camelCase (`markerId`)
- **Events**: kebab-case (`marker-created`)
- **Slots**: kebab-case (`marker-header`)

---

## 4. Padrões de Código

### Composables Pattern

```typescript
// composables/useMarkers.ts
export const useMarkers = () => {
  const markersStore = useMarkersStore()
  const { data, pending, error, refresh } = useFetch('/api/markers')
  
  const createMarker = async (name: string) => {
    const response = await $fetch('/api/markers', {
      method: 'POST',
      body: { name }
    })
    markersStore.addMarker(response)
    return response
  }
  
  return {
    markers: computed(() => markersStore.markers),
    pending,
    error,
    createMarker,
    refresh
  }
}
```

### API Route Pattern

```typescript
// server/api/markers/index.post.ts
import { z } from 'zod'
import { prisma } from '@prisma/client'

const createMarkerSchema = z.object({
  name: z.string().min(1).max(255)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validation
  const validatedData = createMarkerSchema.parse(body)
  
  // Business logic
  const marker = await prisma.marker.create({
    data: validatedData
  })
  
  return marker
})
```

### Error Handling Pattern

```typescript
// utils/errorHandler.ts
export const handleApiError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: error.errors
    })
  }
  
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database Error'
    })
  }
  
  throw createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error'
  })
}
```

---

## 5. API Design

### RESTful Endpoints

#### Markers
```
GET    /api/markers          - List all markers
POST   /api/markers          - Create marker
GET    /api/markers/:id      - Get marker by id
PUT    /api/markers/:id      - Update marker
DELETE /api/markers/:id      - Delete marker
```

#### Sub-Markers
```
GET    /api/sub-markers?markerId=:id  - List sub-markers by marker
POST   /api/sub-markers               - Create sub-marker
GET    /api/sub-markers/:id           - Get sub-marker by id
PUT    /api/sub-markers/:id           - Update sub-marker
DELETE /api/sub-markers/:id           - Delete sub-marker
```

#### Notes
```
GET    /api/notes?subMarkerId=:id  - List notes by sub-marker
POST   /api/notes                  - Create note
GET    /api/notes/:id              - Get note by id
PUT    /api/notes/:id              - Update note
DELETE /api/notes/:id              - Delete note
```

#### AI
```
POST   /api/ai/generate            - Generate content with AI
```

### Request/Response Format

#### Request Example
```json
POST /api/markers
{
  "name": "Estudos"
}
```

#### Response Example
```json
{
  "id": "clxxx...",
  "name": "Estudos",
  "createdAt": "2024-01-20T10:00:00Z",
  "updatedAt": "2024-01-20T10:00:00Z"
}
```

#### Error Response
```json
{
  "statusCode": 400,
  "statusMessage": "Validation Error",
  "data": [
    {
      "path": ["name"],
      "message": "String must contain at least 1 character(s)"
    }
  ]
}
```

---

## 6. Segurança

### Validação de Entrada

#### Client-side
- Validação de formulários com Vue
- Feedback visual em tempo real
- Prevenção de envio inválido

#### Server-side
- Validação obrigatória com Zod
- Sanitização de strings
- Type checking

### Sanitização

#### Rich Text Content
```typescript
import DOMPurify from 'dompurify'

export const sanitizeRichText = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  })
}
```

### SQL Injection Protection
- Prisma ORM usa parameterized queries
- Nunca usar raw SQL strings
- Sem queries dinâmicas não validadas

### XSS Protection
- Vue automatic escaping
- DOMPurify para rich text
- CSP headers (futuro)

---

## 7. Performance

### Otimizações Frontend

#### Code Splitting
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  experimental: {
    payloadExtraction: true
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'pinia'],
            'editor': ['@tiptap/vue-3', '@tiptap/starter-kit']
          }
        }
      }
    }
  }
})
```

#### Lazy Loading
```vue
<script setup>
const LazyComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)
</script>
```

### Otimizações Backend

#### Database Queries
- Usar `select` para limitar campos
- Incluir relacionamentos apenas quando necessário
- Indexes em foreign keys e campos frequentemente consultados

#### Caching (Futuro)
- Cache de queries frequentes
- Redis para cache distribuído
- CDN para assets estáticos

---

## 8. Environment Variables

### Variáveis de Ambiente

```bash
# .env.example

# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Hugging Face API
HUGGING_FACE_API_KEY="hf_xxxxxxxxxxxx"

# Application
NODE_ENV="development"
NUXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Segurança
- Nunca commitar `.env` no Git
- Usar `.env.example` como template
- Validar variáveis obrigatórias na inicialização

---

## 9. Testing Strategy

### Tipos de Testes

#### Unit Tests
- **Framework**: Vitest
- **Cobertura**: Utils, composables, stores
- **Target**: >80% coverage

#### Integration Tests
- **Framework**: Vitest + Nuxt Test Utils
- **Cobertura**: API routes, database operations
- **Target**: Critical paths only

#### E2E Tests (Futuro)
- **Framework**: Playwright
- **Cobertura**: User flows principais
- **Target**: Happy paths

### Estrutura de Testes

```
tests/
├── unit/
│   ├── composables/
│   ├── stores/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
    └── flows/
```

---

## 10. CI/CD (Futuro)

### Pipeline de CI/CD

#### GitHub Actions Workflow

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run lint
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npx prisma migrate deploy
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        # Deploy steps
```

---

## 11. Monitoring e Logging

### Logging

#### Development
- Console logging com `console.log`
- Debug info detalhado

#### Production
- Structured logging (JSON format)
- Error tracking (Sentry - futuro)
- Log levels: error, warn, info, debug

### Health Checks

```typescript
// server/api/health.get.ts
export default defineEventHandler(async (event) => {
  const dbHealth = await checkDatabase()
  const aiHealth = await checkAIAPI()
  
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: dbHealth,
      ai: aiHealth
    }
  }
})
```

---

## 12. Documentação de Código

### Comentários

#### JSDoc para Funções
```typescript
/**
 * Creates a new marker
 * @param name - The name of the marker (1-255 characters)
 * @returns Promise resolving to the created marker
 * @throws {ValidationError} If name is invalid
 */
export async function createMarker(name: string): Promise<Marker> {
  // Implementation
}
```

### README Files
- `README.md`: Visão geral do projeto
- `docs/`: Documentação técnica detalhada
- `docs/api/`: Documentação de API (futuro)

---

## 13. Versionamento

### Git Workflow
- **Main branch**: Produção
- **Develop branch**: Desenvolvimento
- **Feature branches**: `feature/feature-name`
- **Hotfix branches**: `hotfix/fix-name`

### Semantic Versioning
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes

### Changelog
- Manter `CHANGELOG.md`
- Seguir formato Conventional Commits

---

## 14. Dependências Principais

### Production Dependencies

```json
{
  "dependencies": {
    "@nuxt/content": "^3.x",
    "@pinia/nuxt": "^1.x",
    "@prisma/client": "^5.x",
    "@tiptap/vue-3": "^2.x",
    "@tiptap/starter-kit": "^2.x",
    "dompurify": "^3.x",
    "nuxt": "^4.x",
    "pinia": "^2.x",
    "vue": "^3.x",
    "zod": "^3.x"
  },
  "devDependencies": {
    "@nuxt/devtools": "^1.x",
    "@prisma/client": "^5.x",
    "@types/dompurify": "^3.x",
    "prisma": "^5.x",
    "typescript": "^5.x",
    "vitest": "^1.x"
  }
}
```

---

## 15. Recursos e Referências

### Documentação Oficial
- [Nuxt 4 Documentation](https://nuxt.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [shadcn ui vue](https://www.shadcn-vue.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [TipTap Documentation](https://tiptap.dev/)

### Comunidades
- Nuxt Discord
- Vue.js Discord
- Prisma Discord
