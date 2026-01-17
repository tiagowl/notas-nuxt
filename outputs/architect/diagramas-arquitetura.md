# Diagramas de Arquitetura - Sistema de Gerenciamento de Notas

## 1. Visão Geral da Arquitetura

### Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Usuário (Browser)                           │
│                    (Chrome, Firefox, Safari, Edge)                   │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                      Nuxt 4 Application                              │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Frontend (Vue 3 + Composition API)                            │ │
│  │  • shadcn ui vue components                                    │ │
│  │  • Pinia state management (@pinia/nuxt)                        │ │
│  │  • Client-side routing                                         │ │
│  │  • Server-side rendering (SSR)                                 │ │
│  └────────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Backend (Nuxt Server Routes)                                  │ │
│  │  • API Routes (/api/*)                                         │ │
│  │  • Server Middleware                                           │ │
│  │  • Request Validation                                          │ │
│  │  • Error Handling                                              │ │
│  └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Prisma     │    │  Hugging     │    │   Neon       │
│   ORM        │    │  Face API    │    │  PostgreSQL  │
│              │    │              │    │              │
│ (@prisma/    │    │ (External)   │    │ (Database)   │
│  nuxt)       │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 2. Arquitetura de Camadas Detalhada

### Camada de Apresentação (Presentation Layer)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Presentation Layer                              │
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   Components     │  │   Composables    │  │   Store (Pinia)  │  │
│  │                  │  │                  │  │                  │  │
│  │ • MarkerCard     │  │ • useMarkers     │  │ • markersStore   │  │
│  │ • SubMarkerList  │  │ • useSubMarkers  │  │ • notesStore     │  │
│  │ • NoteEditor     │  │ • useNotes       │  │ • uiStore        │  │
│  │ • RichTextEditor │  │ • useAI          │  │                  │  │
│  │ • Navigation     │  │                  │  │                  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                       │
│  Framework: Vue 3 (Composition API) + Nuxt 4                        │
│  UI Library: shadcn ui vue                                          │
│  State Management: Pinia (@pinia/nuxt)                              │
└─────────────────────────────────────────────────────────────────────┘
```

### Camada de Aplicação (Application Layer)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Application Layer (API Routes)                  │
│                                                                       │
│  /api/markers/          /api/sub-markers/     /api/notes/           │
│  ├── GET (list)         ├── GET (list)        ├── GET (list)        │
│  ├── GET (by id)        ├── GET (by id)       ├── GET (by id)       │
│  ├── POST (create)      ├── POST (create)     ├── POST (create)     │
│  ├── PUT (update)       ├── PUT (update)      ├── PUT (update)      │
│  └── DELETE (remove)    └── DELETE (remove)   └── DELETE (remove)   │
│                                                                       │
│  /api/ai/                                                             │
│  └── POST (generate-content)                                         │
│                                                                       │
│  Features:                                                            │
│  • Request Validation (Zod ou similar)                               │
│  • Error Handling                                                     │
│  • Response Formatting                                                │
│  • Authentication/Authorization (futuro)                              │
└─────────────────────────────────────────────────────────────────────┘
```

### Camada de Domínio (Domain Layer)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Domain Layer                                 │
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   Entities       │  │   Services       │  │   Repositories   │  │
│  │                  │  │                  │  │                  │  │
│  │ • Marker         │  │ • MarkerService  │  │ • MarkerRepo     │  │
│  │ • SubMarker      │  │ • SubMarkerSvc   │  │ • SubMarkerRepo  │  │
│  │ • Note           │  │ • NoteService    │  │ • NoteRepo       │  │
│  │                  │  │ • AIService      │  │                  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                       │
│  Business Logic:                                                     │
│  • Validation rules                                                  │
│  • Cascade delete logic                                              │
│  • Rich text sanitization                                            │
└─────────────────────────────────────────────────────────────────────┘
```

### Camada de Dados (Data Layer)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Data Layer                                   │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                     Prisma ORM (@prisma/nuxt)                  │ │
│  │                                                                │ │
│  │  • Type-safe database client                                  │ │
│  │  • Schema definition (schema.prisma)                          │ │
│  │  • Migrations                                                  │ │
│  │  • Query builder                                               │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                           │                                           │
│                           ▼                                           │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                  Neon PostgreSQL Database                      │ │
│  │                                                                │ │
│  │  Tables:                                                       │ │
│  │  • markers                                                     │ │
│  │  • sub_markers                                                 │ │
│  │  • notes                                                       │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Fluxo de Dados (Data Flow)

### Fluxo: Criar Marcador

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌─────────┐
│  User   │────▶│ Component│────▶│ Composable│────▶│  Store  │
│         │     │ (Form)   │     │ (useMarkers)│   │ (Pinia) │
└─────────┘     └──────────┘     └──────────┘     └─────────┘
                                                  │
                                                  ▼
                                          ┌─────────────┐
                                          │ API Route   │
                                          │ POST /api/  │
                                          │ markers     │
                                          └─────────────┘
                                                  │
                                                  ▼
                                          ┌─────────────┐
                                          │ Service     │
                                          │ (Validate,  │
                                          │  Business)  │
                                          └─────────────┘
                                                  │
                                                  ▼
                                          ┌─────────────┐
                                          │ Prisma      │
                                          │ (Database)  │
                                          └─────────────┘
                                                  │
                                                  ▼
                                          ┌─────────────┐
                                          │ Neon        │
                                          │ PostgreSQL  │
                                          └─────────────┘
```

### Fluxo: Gerar Conteúdo com IA

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌─────────┐
│  User   │────▶│ Component│────▶│ Composable│────▶│  Store  │
│         │     │ (Modal)  │     │ (useAI)  │     │ (Pinia) │
└─────────┘     └──────────┘     └──────────┘     └─────────┘
                                                  │
                                                  ▼
                                          ┌─────────────┐
                                          │ API Route   │
                                          │ POST /api/  │
                                          │ ai/generate │
                                          └─────────────┘
                                                  │
                                                  ▼
                                          ┌─────────────┐
                                          │ AIService   │
                                          │ (Validate,  │
                                          │  Format)    │
                                          └─────────────┘
                                                  │
                                                  ▼
                                          ┌─────────────┐
                                          │ Hugging     │
                                          │ Face API    │
                                          │ (External)  │
                                          └─────────────┘
                                                  │
                                                  ▼
                                          ┌─────────────┐
                                          │ Response    │
                                          │ (Generated  │
                                          │  Content)   │
                                          └─────────────┘
```

---

## 4. Arquitetura de Componentes (Frontend)

### Hierarquia de Componentes

```
App.vue
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   └── UserMenu
│   ├── Navigation (Desktop)
│   │   ├── MarkerList
│   │   └── SubMarkerList
│   ├── Navigation (Mobile)
│   │   └── HamburgerMenu
│   └── Main
│       ├── Breadcrumb
│       ├── MarkerListPage
│       │   └── MarkerCard
│       ├── SubMarkerListPage
│       │   └── SubMarkerCard
│       ├── NoteListPage
│       │   └── NoteCard
│       ├── NoteViewPage
│       │   └── NoteViewer
│       └── NoteEditPage
│           ├── NoteForm
│           ├── RichTextEditor
│           └── AIModal
└── Toaster (Toast notifications)
```

### Componentes Principais

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Component Architecture                          │
│                                                                       │
│  Layout Components:                                                  │
│  • AppLayout.vue         - Main layout wrapper                      │
│  • Header.vue            - Top navigation                           │
│  • Sidebar.vue           - Desktop sidebar                          │
│  • MobileMenu.vue        - Mobile hamburger menu                    │
│  • Breadcrumb.vue        - Navigation breadcrumbs                   │
│                                                                       │
│  Feature Components:                                                 │
│  • MarkerCard.vue        - Marker list item                         │
│  • SubMarkerCard.vue     - Sub-marker list item                     │
│  • NoteCard.vue          - Note list item                           │
│  • NoteViewer.vue        - Note display                             │
│  • NoteForm.vue          - Note create/edit form                    │
│                                                                       │
│  UI Components (shadcn ui vue):                                     │
│  • Button, Input, Textarea, Dialog, Toast, etc.                     │
│                                                                       │
│  Rich Text Editor:                                                  │
│  • RichTextEditor.vue    - Wrapper for rich text editor             │
│                           (TipTap ou similar)                        │
│                                                                       │
│  AI Components:                                                      │
│  • AIModal.vue           - Modal for IA generation                  │
│  • AIGenerateButton.vue  - Trigger button                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Estrutura de Diretórios

```
notas-nuxt/
├── .nuxt/                    # Nuxt build output (generated)
├── prisma/                   # Prisma schema and migrations
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration files
├── public/                   # Static assets
├── server/                   # Server-side code
│   ├── api/                  # API routes
│   │   ├── markers/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── sub-markers/
│   │   │   └── [similar structure]
│   │   ├── notes/
│   │   │   └── [similar structure]
│   │   └── ai/
│   │       └── generate.post.ts
│   └── middleware/           # Server middleware
├── src/                      # Source code (or root if using srcDir)
│   ├── components/           # Vue components
│   │   ├── ui/               # shadcn ui components
│   │   ├── layout/           # Layout components
│   │   ├── markers/          # Marker components
│   │   ├── sub-markers/      # Sub-marker components
│   │   ├── notes/            # Note components
│   │   └── ai/               # AI components
│   ├── composables/          # Vue composables
│   │   ├── useMarkers.ts
│   │   ├── useSubMarkers.ts
│   │   ├── useNotes.ts
│   │   └── useAI.ts
│   ├── stores/               # Pinia stores
│   │   ├── markers.ts
│   │   ├── notes.ts
│   │   └── ui.ts
│   ├── utils/                # Utility functions
│   │   ├── validation.ts
│   │   ├── sanitize.ts
│   │   └── format.ts
│   ├── pages/                # Nuxt pages (auto-routes)
│   │   ├── index.vue         # Home/Marker list
│   │   ├── markers/
│   │   │   └── [id]/
│   │   │       ├── index.vue # Sub-marker list
│   │   │       └── sub-markers/
│   │   │           └── [subId]/
│   │   │               ├── index.vue # Note list
│   │   │               └── notes/
│   │   │                   └── [noteId].vue # Note view/edit
│   └── app.vue               # Root component
├── nuxt.config.ts            # Nuxt configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

---

## 6. Arquitetura de Segurança

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Security Architecture                           │
│                                                                       │
│  Input Validation:                                                   │
│  • Client-side: Vue form validation                                  │
│  • Server-side: Zod schema validation                                │
│  • Sanitization: DOMPurify for rich text                             │
│                                                                       │
│  SQL Injection Protection:                                           │
│  • Prisma ORM (parameterized queries)                                │
│  • No raw SQL queries                                                │
│                                                                       │
│  XSS Protection:                                                     │
│  • Rich text sanitization (DOMPurify)                                │
│  • Vue's automatic escaping                                          │
│                                                                       │
│  CSRF Protection:                                                    │
│  • Nuxt built-in CSRF tokens                                         │
│  • SameSite cookies (future)                                         │
│                                                                       │
│  API Security:                                                       │
│  • Rate limiting (future)                                            │
│  • Authentication/Authorization (future)                             │
│  • API key for Hugging Face (env variable)                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Integrações Externas

### Integração com Hugging Face API

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Hugging Face Integration                          │
│                                                                       │
│  Nuxt Server Route                                                   │
│  /api/ai/generate.post.ts                                            │
│         │                                                             │
│         ├──► Validate request                                        │
│         ├──► Format prompt                                           │
│         ├──► Call Hugging Face API                                   │
│         │    │                                                        │
│         │    ├──► Model endpoint                                     │
│         │    ├──► API Key (env)                                      │
│         │    ├──► Request payload                                    │
│         │    └──► Timeout (30s)                                      │
│         │                                                             │
│         ├──► Handle response                                         │
│         ├──► Error handling                                          │
│         └──► Return formatted content                                │
│                                                                       │
│  Error Scenarios:                                                    │
│  • Timeout (>30s)                                                    │
│  • API unavailable                                                   │
│  • Rate limit exceeded                                               │
│  • Invalid API key                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### Integração com Neon Database

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Neon Database Integration                       │
│                                                                       │
│  Prisma Client                                                        │
│         │                                                             │
│         ├──► Connection String (env)                                 │
│         ├──► Connection Pooling                                      │
│         ├──► Query Optimization                                      │
│         └──► Migration Management                                    │
│                                                                       │
│  Connection Flow:                                                    │
│  1. Prisma reads DATABASE_URL from .env                              │
│  2. Establishes connection to Neon                                   │
│  3. Connection pooling (reuse connections)                           │
│  4. Query execution (type-safe)                                      │
│                                                                       │
│  Features:                                                           │
│  • Serverless PostgreSQL                                             │
│  • Auto-scaling                                                      │
│  • Point-in-time recovery                                            │
│  • Automated backups                                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Fluxo de Deploy

### Arquitetura de Deploy (Futuro)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Deployment Architecture                         │
│                                                                       │
│  Development:                                                        │
│  • Local development (npm run dev)                                   │
│  • Neon dev database                                                 │
│                                                                       │
│  Production (Future):                                                │
│  ┌──────────┐                                                        │
│  │   Git    │                                                        │
│  │ (GitHub) │                                                        │
│  └────┬─────┘                                                        │
│       │                                                               │
│       ▼                                                               │
│  ┌──────────────┐                                                    │
│  │ CI/CD Pipeline│                                                   │
│  │ (GitHub Actions)│                                                 │
│  └────┬──────────┘                                                   │
│       │                                                               │
│       ├──► Build                                                     │
│       ├──► Test                                                      │
│       └──► Deploy                                                    │
│            │                                                          │
│            ▼                                                          │
│  ┌──────────────────┐                                                │
│  │  Hosting Platform │                                               │
│  │  (Vercel/Netlify) │                                               │
│  └──────────────────┘                                                │
│                                                                       │
│  Environment:                                                        │
│  • Production Nuxt app                                               │
│  • Production Neon database                                          │
│  • Production Hugging Face API key                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Escalabilidade e Performance

### Estratégias de Performance

```
┌─────────────────────────────────────────────────────────────────────┐
│                   Performance & Scalability                          │
│                                                                       │
│  Frontend:                                                           │
│  • Server-Side Rendering (SSR) - Initial load                       │
│  • Static Site Generation (SSG) - Where possible                    │
│  • Code splitting - Route-based                                     │
│  • Lazy loading - Components                                        │
│  • Image optimization - Nuxt Image                                  │
│                                                                       │
│  Backend:                                                            │
│  • API route caching (where applicable)                             │
│  • Database query optimization                                       │
│  • Connection pooling (Prisma)                                      │
│                                                                       │
│  Database:                                                           │
│  • Indexes on foreign keys                                          │
│  • Query optimization                                               │
│  • Neon auto-scaling                                                │
│                                                                       │
│  Future Optimizations:                                              │
│  • CDN for static assets                                            │
│  • Redis caching                                                    │
│  • Database read replicas                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 10. Observabilidade (Futuro)

### Logging e Monitoramento

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Observability Architecture                      │
│                                                                       │
│  Logging:                                                            │
│  • Console logging (development)                                     │
│  • Structured logging (production)                                   │
│  • Error tracking (Sentry - future)                                 │
│                                                                       │
│  Metrics:                                                            │
│  • API response times                                                │
│  • Database query performance                                        │
│  • Hugging Face API latency                                          │
│                                                                       │
│  Health Checks:                                                      │
│  • /api/health - Application health                                 │
│  • /api/health/db - Database connectivity                           │
│  • /api/health/ai - Hugging Face API status                         │
└─────────────────────────────────────────────────────────────────────┘
```
