# Guias de Desenvolvimento - Sistema de Gerenciamento de Notas

## 1. Setup do Ambiente de Desenvolvimento

### Pré-requisitos

#### Software Necessário
- **Node.js**: v18.x ou superior
- **npm**: v9.x ou superior (ou yarn/pnpm)
- **Git**: Versão recente
- **VS Code**: Recomendado (com extensões)
- **PostgreSQL Client**: Opcional (para acesso direto ao banco)

#### Extensões VS Code Recomendadas
- **Vue Language Features (Volar)**: Suporte Vue 3
- **TypeScript Vue Plugin (Volar)**: TypeScript em Vue
- **Prisma**: Syntax highlighting para Prisma
- **ESLint**: Linting JavaScript/TypeScript
- **Prettier**: Formatação de código

---

### Instalação Passo a Passo

#### 1. Clonar Repositório
```bash
git clone <repository-url>
cd notas-nuxt
```

#### 2. Instalar Dependências
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

#### 3. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
```

Editar `.env` com:
```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
HUGGING_FACE_API_KEY="hf_xxxxxxxxxxxx"
NODE_ENV="development"
```

#### 4. Configurar Banco de Dados
```bash
# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma migrate dev

# (Opcional) Visualizar banco de dados
npx prisma studio
```

#### 5. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

Acessar: `http://localhost:3000`

---

## 2. Estrutura de Projeto

### Visão Geral

```
notas-nuxt/
├── .nuxt/              # Build output (não commitar)
├── .output/            # Build final (não commitar)
├── node_modules/       # Dependências (não commitar)
├── prisma/             # Prisma schema e migrations
│   ├── schema.prisma   # Schema do banco de dados
│   └── migrations/     # Migration files
├── public/             # Assets estáticos
├── server/             # Server-side code
│   ├── api/           # API routes
│   └── middleware/    # Server middleware
├── src/               # Source code (ou root)
│   ├── components/    # Componentes Vue
│   ├── composables/   # Composables Vue
│   ├── stores/        # Pinia stores
│   ├── utils/         # Funções utilitárias
│   ├── pages/         # Nuxt pages (auto-routes)
│   └── app.vue        # Root component
├── .env               # Variáveis de ambiente (não commitar)
├── .env.example       # Template de .env
├── .gitignore         # Arquivos ignorados pelo Git
├── nuxt.config.ts     # Configuração do Nuxt
├── package.json       # Dependências e scripts
└── tsconfig.json      # Configuração TypeScript
```

---

## 3. Convenções de Código

### Nomenclatura

#### Arquivos e Diretórios
```typescript
// Componentes Vue: PascalCase
MarkerCard.vue
NoteEditor.vue

// Composables: camelCase com prefixo 'use'
useMarkers.ts
useNotes.ts

// Stores: camelCase
markersStore.ts
notesStore.ts

// API Routes: kebab-case
markers.get.ts
markers.post.ts
[id].get.ts
```

#### Variáveis e Funções
```typescript
// Variáveis: camelCase
const markerList = ref([])
const isLoading = ref(false)

// Constantes: UPPER_SNAKE_CASE
const MAX_TITLE_LENGTH = 255
const DEFAULT_PAGE_SIZE = 20

// Funções: camelCase
function createMarker(name: string) { }
async function fetchMarkers() { }

// Classes: PascalCase
class MarkerService { }
```

#### Componentes Vue
```vue
<script setup lang="ts">
// Props: camelCase
interface Props {
  markerId: string
  isLoading?: boolean
}

// Emits: kebab-case
const emit = defineEmits<{
  'marker-created': [marker: Marker]
  'marker-updated': [marker: Marker]
}>()
</script>
```

---

### Estrutura de Componentes Vue

#### Template Padrão

```vue
<template>
  <div class="marker-card">
    <!-- Conteúdo -->
  </div>
</template>

<script setup lang="ts">
// 1. Imports
import { ref, computed } from 'vue'
import type { Marker } from '~/types'

// 2. Props e Emits
interface Props {
  marker: Marker
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'marker-deleted': [id: string]
}>()

// 3. Composables
const { deleteMarker } = useMarkers()

// 4. State local
const isLoading = ref(false)

// 5. Computed
const markerTitle = computed(() => props.marker.name)

// 6. Methods
async function handleDelete() {
  isLoading.value = true
  await deleteMarker(props.marker.id)
  emit('marker-deleted', props.marker.id)
  isLoading.value = false
}

// 7. Lifecycle hooks
onMounted(() => {
  // Inicialização
})
</script>

<style scoped>
.marker-card {
  /* Estilos */
}
</style>
```

---

## 4. Padrões de Desenvolvimento

### Composables Pattern

#### Estrutura Padrão

```typescript
// composables/useMarkers.ts
export const useMarkers = () => {
  // 1. State (se necessário)
  const markers = ref<Marker[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // 2. Store (se usando Pinia)
  const markersStore = useMarkersStore()

  // 3. Fetch data
  const fetchMarkers = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Marker[]>('/api/markers')
      markers.value = data
      markersStore.setMarkers(data)
    } catch (err) {
      error.value = err as Error
    } finally {
      isLoading.value = false
    }
  }

  // 4. CRUD operations
  const createMarker = async (name: string) => {
    const marker = await $fetch<Marker>('/api/markers', {
      method: 'POST',
      body: { name }
    })
    markers.value.push(marker)
    return marker
  }

  // 5. Return
  return {
    markers: computed(() => markersStore.markers),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchMarkers,
    createMarker
  }
}
```

---

### API Route Pattern

#### Estrutura Padrão

```typescript
// server/api/markers/index.post.ts
import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'

// 1. Schema de validação
const createMarkerSchema = z.object({
  name: z.string().min(1).max(255)
})

// 2. Handler
export default defineEventHandler(async (event) => {
  // 3. Validação de método
  assertMethod(event, 'POST')

  // 4. Leitura do body
  const body = await readBody(event)

  // 5. Validação de dados
  const validatedData = createMarkerSchema.parse(body)

  // 6. Business logic
  try {
    const marker = await prisma.marker.create({
      data: validatedData
    })

    // 7. Response
    return marker
  } catch (error) {
    // 8. Error handling
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create marker'
    })
  }
})
```

---

### Store Pattern (Pinia)

#### Estrutura Padrão

```typescript
// stores/markers.ts
import { defineStore } from 'pinia'
import type { Marker } from '~/types'

export const useMarkersStore = defineStore('markers', () => {
  // 1. State
  const markers = ref<Marker[]>([])
  const selectedMarkerId = ref<string | null>(null)

  // 2. Getters
  const selectedMarker = computed(() => 
    markers.value.find(m => m.id === selectedMarkerId.value)
  )

  const markerCount = computed(() => markers.value.length)

  // 3. Actions
  function setMarkers(newMarkers: Marker[]) {
    markers.value = newMarkers
  }

  function addMarker(marker: Marker) {
    markers.value.push(marker)
  }

  function updateMarker(id: string, updates: Partial<Marker>) {
    const index = markers.value.findIndex(m => m.id === id)
    if (index !== -1) {
      markers.value[index] = { ...markers.value[index], ...updates }
    }
  }

  function removeMarker(id: string) {
    markers.value = markers.value.filter(m => m.id !== id)
  }

  // 4. Return
  return {
    markers: readonly(markers),
    selectedMarkerId,
    selectedMarker,
    markerCount,
    setMarkers,
    addMarker,
    updateMarker,
    removeMarker
  }
})
```

---

## 5. Validação e Sanitização

### Validação com Zod

#### Schemas Reutilizáveis

```typescript
// utils/validation/schemas.ts
import { z } from 'zod'

export const markerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo')
})

export const subMarkerSchema = z.object({
  name: z.string().min(1).max(255),
  markerId: z.string().cuid('ID de marcador inválido')
})

export const noteSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(255),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  subMarkerId: z.string().cuid('ID de sub-marcador inválido')
})
```

#### Uso em API Routes

```typescript
// server/api/markers/index.post.ts
import { markerSchema } from '~/utils/validation/schemas'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validação
  const validatedData = markerSchema.parse(body)
  
  // Resto do código...
})
```

---

### Sanitização de Rich Text

```typescript
// utils/sanitize.ts
import DOMPurify from 'dompurify'

const ALLOWED_TAGS = ['p', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li']
const ALLOWED_ATTR: string[] = []

export const sanitizeRichText = (content: string): string => {
  if (import.meta.server) {
    // Server-side: usar isDOMJSDOM ou similar
    const { JSDOM } = require('jsdom')
    const window = new JSDOM('').window
    const purify = DOMPurify(window)
    return purify.sanitize(content, {
      ALLOWED_TAGS,
      ALLOWED_ATTR
    })
  }
  
  // Client-side
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS,
    ALLOWED_ATTR
  })
}
```

---

## 6. Tratamento de Erros

### Error Handling em API Routes

```typescript
// utils/errorHandler.ts
import { Prisma } from '@prisma/client'
import { z } from 'zod'

export function handleApiError(error: unknown) {
  // Zod validation error
  if (error instanceof z.ZodError) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: error.errors
    })
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Record already exists'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Database Error'
    })
  }

  // Generic error
  throw createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error'
  })
}
```

---

### Error Handling em Components

```vue
<script setup lang="ts">
const { createMarker } = useMarkers()
const error = ref<Error | null>(null)

async function handleCreate() {
  try {
    error.value = null
    await createMarker(name.value)
    // Success handling
  } catch (err) {
    error.value = err as Error
    // Show toast or error message
  }
}
</script>

<template>
  <div v-if="error" class="error-message">
    {{ error.message }}
  </div>
</template>
```

---

## 7. Testes

### Unit Tests com Vitest

#### Configuração

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node'
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '@': resolve(__dirname, '.')
    }
  }
})
```

#### Exemplo de Teste

```typescript
// tests/unit/utils/sanitize.test.ts
import { describe, it, expect } from 'vitest'
import { sanitizeRichText } from '~/utils/sanitize'

describe('sanitizeRichText', () => {
  it('should remove script tags', () => {
    const input = '<p>Hello</p><script>alert("xss")</script>'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('<script>')
  })

  it('should preserve allowed tags', () => {
    const input = '<p><strong>Hello</strong></p>'
    const result = sanitizeRichText(input)
    expect(result).toContain('<p>')
    expect(result).toContain('<strong>')
  })
})
```

---

## 8. Git Workflow

### Branching Strategy

```
main (production)
  └── develop (development)
       ├── feature/marker-crud
       ├── feature/note-editor
       └── bugfix/validation-error
```

#### Convenções de Branches
- **feature/**: Novas funcionalidades
- **bugfix/**: Correções de bugs
- **hotfix/**: Correções urgentes em produção
- **refactor/**: Refatorações
- **docs/**: Documentação

### Commit Messages

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add marker creation endpoint
fix: resolve validation error in note editor
docs: update README with setup instructions
refactor: simplify marker store logic
test: add unit tests for sanitization
```

---

## 9. Code Review Guidelines

### Checklist de Review

#### Funcionalidade
- [ ] Código implementa o requisito corretamente?
- [ ] Todos os casos extremos foram tratados?
- [ ] Validações estão implementadas?

#### Código
- [ ] Código segue convenções do projeto?
- [ ] Nomes de variáveis/funções são descritivos?
- [ ] Código está limpo e legível?
- [ ] Não há código duplicado?

#### Testes
- [ ] Testes foram escritos (quando aplicável)?
- [ ] Testes passam?

#### Segurança
- [ ] Validação de entrada implementada?
- [ ] Sanitização de rich text implementada?
- [ ] Sem SQL injection risks?

#### Performance
- [ ] Queries otimizadas?
- [ ] Sem loops desnecessários?
- [ ] Lazy loading usado quando apropriado?

---

## 10. Debugging

### Debug em VS Code

#### Configuração Launch

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Nuxt",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 9229,
      "console": "integratedTerminal"
    }
  ]
}
```

### Debugging Tips

#### Client-side
- Usar Vue DevTools
- Console.log (desenvolvimento)
- Browser DevTools

#### Server-side
- Console.log (desenvolvimento)
- VS Code debugger
- Nuxt DevTools

#### Database
- Prisma Studio: `npx prisma studio`
- Query logging: Ativar em Prisma config

---

## 11. Performance Best Practices

### Otimizações Frontend

#### Code Splitting
```typescript
// Lazy load components
const LazyComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)
```

#### Memoização
```typescript
// Use computed para valores derivados
const filteredMarkers = computed(() => 
  markers.value.filter(m => m.name.includes(search.value))
)
```

#### Virtual Scrolling (para listas grandes)
```vue
<VirtualList :items="markers" />
```

---

### Otimizações Backend

#### Query Optimization
```typescript
// ✅ Bom: Select apenas campos necessários
const markers = await prisma.marker.findMany({
  select: {
    id: true,
    name: true,
    createdAt: true
  }
})

// ❌ Evitar: Select tudo
const markers = await prisma.marker.findMany()
```

#### Pagination
```typescript
const markers = await prisma.marker.findMany({
  take: 20,
  skip: (page - 1) * 20
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

#### Comentários Inline
```typescript
// ✅ Bom: Explica por quê
// Cascade delete: when marker is deleted, all sub-markers and notes are deleted
await prisma.marker.delete({ where: { id } })

// ❌ Evitar: Explica o que (óbvio)
// Delete marker
await prisma.marker.delete({ where: { id } })
```

---

## 13. Recursos Úteis

### Documentação
- [Nuxt 4 Docs](https://nuxt.com/)
- [Vue 3 Docs](https://vuejs.org/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [shadcn ui vue](https://www.shadcn-vue.com/)

### Ferramentas
- **Prisma Studio**: `npx prisma studio`
- **Nuxt DevTools**: `npm run dev` (incluído)
- **Vue DevTools**: Browser extension

### Comunidades
- Nuxt Discord
- Vue.js Discord
- Prisma Discord

---

## 14. Troubleshooting Comum

### Problemas Comuns

#### Erro: Prisma Client not generated
```bash
npx prisma generate
```

#### Erro: Database connection failed
- Verificar `DATABASE_URL` no `.env`
- Verificar se banco está acessível
- Verificar SSL mode

#### Erro: Module not found
```bash
npm install
```

#### Erro: Type errors after Prisma schema change
```bash
npx prisma generate
# Reiniciar TypeScript server no VS Code (Cmd+Shift+P > "TypeScript: Restart TS Server")
```

---

## 15. Próximos Passos

1. **Configurar ambiente local** seguindo este guia
2. **Ler documentação técnica** em `documentacao-tecnica.md`
3. **Revisar ADRs** em `decisoes-arquiteturais.md`
4. **Começar desenvolvimento** pela Sprint 0 (Setup)
5. **Referenciar este guia** durante desenvolvimento
