# Arquiteture Decision Records (ADRs) - Sistema de Gerenciamento de Notas

## 1. ADR-001: Uso de Nuxt 4 como Framework Principal

### Status
Aceito

### Contexto
O projeto requer um framework full-stack que permita desenvolvimento rápido, SSR/SSG, e integração nativa com Vue.js. Nuxt v4 é requisito obrigatório definido pelo Product Owner.

### Decisão
Utilizar **Nuxt v4** como framework principal para:
- Frontend (Vue 3 components, SSR, SSG)
- Backend (API routes)
- Gerenciamento de rotas (file-based routing)
- Auto-imports e convenções

### Consequências

#### Positivas
- ✅ Integração nativa Vue.js 3
- ✅ SSR/SSG out-of-the-box
- ✅ File-based routing (convenções sobre configuração)
- ✅ Auto-imports (menos boilerplate)
- ✅ Ecossistema maduro
- ✅ Boa documentação e comunidade

#### Negativas
- ⚠️ Curva de aprendizado inicial (se equipe não conhecer)
- ⚠️ Opiniões do framework podem limitar flexibilidade
- ⚠️ Dependência de versão específica (v4)

#### Mitigações
- Treinamento da equipe em Nuxt 4
- Documentação interna de padrões
- Criação de templates e exemplos

---

## 2. ADR-002: Prisma ORM para Acesso ao Banco de Dados

### Status
Aceito

### Contexto
O projeto requer ORM para interação com banco de dados Neon (PostgreSQL). Prisma é requisito obrigatório definido pelo Product Owner. Necessário type-safety, migrations, e integração com Nuxt.

### Decisão
Utilizar **Prisma ORM** com módulo `@prisma/nuxt` para:
- Type-safe database client
- Schema definition e migrations
- Query builder intuitivo
- Integração nativa com Nuxt

### Consequências

#### Positivas
- ✅ Type safety (TypeScript-first)
- ✅ Migrations versionadas (Git-tracked)
- ✅ Auto-completion e type checking
- ✅ Proteção contra SQL injection (parameterized queries)
- ✅ Boa performance
- ✅ Maturidade e suporte da comunidade

#### Negativas
- ⚠️ Aprendizado da sintaxe Prisma
- ⚠️ Limitações em queries complexas (raras)
- ⚠️ Geração de cliente após mudanças no schema

#### Alternativas Consideradas
- **TypeORM**: Mais flexível, mas menos type-safe
- **Drizzle ORM**: Mais leve, mas menos maduro
- **Raw SQL**: Sem type safety, mais propenso a erros

#### Mitigações
- Documentação de padrões Prisma no projeto
- Training em Prisma para equipe
- Exemplos de queries comuns

---

## 3. ADR-003: Pinia para Gerenciamento de Estado

### Status
Aceito

### Contexto
O projeto precisa de gerenciamento de estado global para compartilhar dados entre componentes (marcadores, notas, estado da UI). Pinia é requisito obrigatório definido pelo Product Owner.

### Decisão
Utilizar **Pinia** com módulo `@pinia/nuxt` para:
- Gerenciamento de estado global
- Stores para marcadores, notas e UI
- DevTools integration
- TypeScript support

### Consequências

#### Positivas
- ✅ Padrão oficial Vue 3 (sucessor do Vuex)
- ✅ TypeScript support nativo
- ✅ DevTools integration
- ✅ Composition API style
- ✅ Menos boilerplate que Vuex

#### Negativas
- ⚠️ Nova API (se equipe conhece Vuex)
- ⚠️ Possível over-engineering para estado simples

#### Alternativas Consideradas
- **Vuex**: Deprecated, não recomendado para novos projetos
- **Provide/Inject**: Limitado para estado complexo
- **Composables**: Suficiente para estado local, não para global

#### Mitigações
- Documentação de quando usar Pinia vs composables
- Padrão claro de stores no projeto

---

## 4. ADR-004: shadcn ui vue para Componentes UI

### Status
Aceito

### Contexto
O projeto requer componentes UI consistentes e acessíveis. shadcn ui vue é requisito obrigatório definido pelo Product Owner. Necessário design system consistente.

### Decisão
Utilizar **shadcn ui vue** para:
- Componentes UI baseados em Radix Vue
- Design system Tailwind CSS
- Acessibilidade out-of-the-box
- Customização fácil (copia código para projeto)

### Consequências

#### Positivas
- ✅ Acessibilidade (Radix Vue)
- ✅ Design system consistente
- ✅ Customizável (não é um framework, copia código)
- ✅ Tailwind CSS (utility-first)
- ✅ Componentes modernos

#### Negativas
- ⚠️ Requer configuração inicial
- ⚠️ Compatibilidade com Nuxt v4 precisa validação
- ⚠️ Curva de aprendizado Tailwind CSS (se equipe não conhece)

#### Alternativas Consideradas
- **Vuetify**: Mais pesado, menos customizável
- **PrimeVue**: Boa opção, mas não foi requisitado
- **Quasar**: Framework completo, pode ser overkill

#### Mitigações
- Validar compatibilidade com Nuxt v4 antes do desenvolvimento
- Documentação de componentes usados
- Treinamento em Tailwind CSS se necessário

---

## 5. ADR-005: Neon PostgreSQL como Banco de Dados

### Status
Aceito

### Contexto
O projeto requer banco de dados PostgreSQL serverless. Neon é requisito obrigatório definido pelo Product Owner. Necessário escalabilidade e gerenciamento facilitado.

### Decisão
Utilizar **Neon PostgreSQL** para:
- Banco de dados PostgreSQL serverless
- Auto-scaling
- Point-in-time recovery
- Integração com Prisma

### Consequências

#### Positivas
- ✅ Serverless (sem gerenciamento de infra)
- ✅ Auto-scaling
- ✅ PostgreSQL (SQL relacional)
- ✅ Point-in-time recovery
- ✅ Boa integração com Prisma

#### Negativas
- ⚠️ Vendor lock-in (Neon específico)
- ⚠️ Limitações de conexões (planos gratuitos)
- ⚠️ Cold starts possíveis (serverless)

#### Alternativas Consideradas
- **Supabase**: Similar, mas stack mais amplo
- **Railway PostgreSQL**: Bom, mas não foi requisitado
- **Self-hosted PostgreSQL**: Mais controle, mas mais manutenção

#### Mitigações
- Monitorar conexões e performance
- Documentar configurações de connection pooling
- Planejar migração se necessário (Prisma facilita)

---

## 6. ADR-006: Hugging Face API para Geração de Conteúdo

### Status
Aceito

### Contexto
O projeto requer geração de conteúdo com IA. Hugging Face API é requisito obrigatório definido pelo Product Owner. Necessário integração externa.

### Decisão
Utilizar **Hugging Face Inference API** para:
- Geração de conteúdo com IA
- Integração via API REST
- Modelos pré-treinados

### Consequências

#### Positivas
- ✅ Múltiplos modelos disponíveis
- ✅ API simples (REST)
- ✅ Sem necessidade de infra própria de IA

#### Negativas
- ⚠️ Dependência externa (disponibilidade)
- ⚠️ Latência (pode demorar >10s)
- ⚠️ Limites de taxa (planos gratuitos)
- ⚠️ Custo pode aumentar com uso
- ⚠️ Privacy (dados enviados para API externa)

#### Alternativas Consideradas
- **OpenAI API**: Mais caro, mas mais rápido
- **Self-hosted LLM**: Mais controle, mas complexo
- **Gemini API**: Alternativa, mas não foi requisitado

#### Mitigações
- Tratamento robusto de erros e timeouts
- Feedback claro ao usuário durante geração
- Rate limiting no frontend (se necessário)
- Considerar alternativas futuras se problemas persistirem

---

## 7. ADR-007: TipTap para Editor Rich Text

### Status
Aceito

### Contexto
O projeto requer editor rich text para criação de notas. Necessário editor moderno, extensível e compatível com Vue 3.

### Decisão
Utilizar **TipTap** para:
- Editor rich text extensível
- Compatibilidade com Vue 3
- Customização de toolbar
- Suporte a extensões

### Consequências

#### Positivas
- ✅ Extensível (módulos)
- ✅ Boa integração Vue 3
- ✅ Controle total sobre funcionalidades
- ✅ Bom suporte e documentação
- ✅ TypeScript support

#### Negativas
- ⚠️ Configuração inicial mais complexa
- ⚠️ Bundle size maior que editores mais simples
- ⚠️ Curva de aprendizado

#### Alternativas Consideradas
- **Quill**: Mais simples, mas menos extensível
- **Trix**: Bom, mas menos integração Vue 3
- **ContentEditable nativo**: Muito manual, propenso a bugs

#### Mitigações
- Documentação de configuração do editor
- Exemplos de uso no projeto
- Considerar simplificação se não for necessário muito recursos

---

## 8. ADR-008: Zod para Validação de Schema

### Status
Aceito

### Contexto
O projeto requer validação robusta de dados em API routes. Necessário validação type-safe e integração com TypeScript.

### Decisão
Utilizar **Zod** para:
- Validação de schemas em API routes
- Type inference automático
- Mensagens de erro claras

### Consequências

#### Positivas
- ✅ TypeScript-first (type inference)
- ✅ Runtime validation
- ✅ Mensagens de erro claras
- ✅ Boa performance
- ✅ Comunidade ativa

#### Negativas
- ⚠️ Aprendizado da sintaxe Zod
- ⚠️ Duplicação de types (se usar interfaces também)

#### Alternativas Consideradas
- **Joi**: Maduro, mas sem type inference nativo
- **Yup**: Similar ao Zod, mas menos TypeScript-friendly
- **Valibot**: Mais leve, mas menos maduro

#### Mitigações
- Documentação de padrões de validação
- Criar schemas reutilizáveis
- Exemplos de validação comum

---

## 9. ADR-009: DOMPurify para Sanitização de Rich Text

### Status
Aceito

### Contexto
O projeto requer sanitização de conteúdo rich text antes de salvar no banco de dados para prevenir XSS attacks.

### Decisão
Utilizar **DOMPurify** para:
- Sanitização de HTML
- Prevenção de XSS
- Configuração de tags permitidas

### Consequências

#### Positivas
- ✅ Proteção robusta contra XSS
- ✅ Configurável (tags permitidas)
- ✅ Bem testado e maduro
- ✅ Performance razoável

#### Negativas
- ⚠️ Processamento adicional (overhead mínimo)
- ⚠️ Pode remover formatação válida se configurado incorretamente

#### Alternativas Consideradas
- **sanitize-html**: Similar, mas menos usado
- **xss**: Mais leve, mas menos configurável
- **Sem sanitização**: Inseguro, não recomendado

#### Mitigações
- Configurar tags permitidas cuidadosamente
- Testar sanitização em casos extremos
- Documentar configuração de segurança

---

## 10. ADR-010: Arquitetura Monolítica (Nuxt Full-Stack)

### Status
Aceito

### Contexto
O projeto é de médio porte com equipe pequena/média. Necessário desenvolvimento rápido e manutenção facilitada.

### Decisão
Utilizar **arquitetura monolítica** com Nuxt full-stack:
- Frontend e backend no mesmo repositório
- API routes dentro do projeto Nuxt
- Deploy unificado

### Consequências

#### Positivas
- ✅ Desenvolvimento mais rápido (sem separação frontend/backend)
- ✅ Compartilhamento de tipos (TypeScript)
- ✅ Deploy simplificado
- ✅ Menos complexidade operacional
- ✅ Menor custo de infraestrutura inicial

#### Negativas
- ⚠️ Acoplamento frontend/backend
- ⚠️ Escalabilidade limitada (precisa escalar tudo junto)
- ⚠️ Difícil separar equipes frontend/backend (se crescer)

#### Alternativas Consideradas
- **Microserviços**: Mais flexível, mas mais complexo
- **Separar frontend/backend**: Mais escalável, mas mais complexo operacionalmente

#### Mitigações
- Planejar migração para arquitetura separada se necessário (quando escalar)
- Manter APIs bem definidas (facilita separação futura)
- Documentar decisão e critérios para revisão

---

## 11. ADR-011: TypeScript em Todo o Projeto

### Status
Aceito

### Contexto
O projeto requer type safety e melhor DX (Developer Experience). TypeScript é padrão moderno para projetos Vue/Nuxt.

### Decisão
Utilizar **TypeScript** em todo o projeto:
- Frontend (Vue components)
- Backend (API routes)
- Utils e composables
- Strict mode ativado

### Consequências

#### Positivas
- ✅ Type safety (menos erros em runtime)
- ✅ Auto-completion melhor
- ✅ Refactoring mais seguro
- ✅ Documentação implícita (types)
- ✅ Integração melhor com Prisma e Zod

#### Negativas
- ⚠️ Curva de aprendizado (se equipe não conhece)
- ⚠️ Mais verboso (alguns casos)
- ⚠️ Build time um pouco maior

#### Alternativas Consideradas
- **JavaScript**: Mais rápido inicialmente, mas menos seguro
- **JSDoc types**: Parcialmente útil, mas não é type checking real

#### Mitigações
- Treinamento TypeScript para equipe
- Documentação de padrões TypeScript no projeto
- Linting estrito (ESLint)

---

## 12. Resumo de Decisões

### Stack Tecnológica Final
- **Frontend**: Nuxt v4 + Vue 3 + TypeScript
- **UI**: shadcn ui vue + Tailwind CSS
- **State**: Pinia
- **Backend**: Nuxt Server Routes
- **ORM**: Prisma
- **Database**: Neon PostgreSQL
- **Validation**: Zod
- **Sanitization**: DOMPurify
- **Rich Text**: TipTap
- **AI**: Hugging Face API

### Decisões Críticas
1. Nuxt 4 (requisito obrigatório)
2. Prisma ORM (requisito obrigatório)
3. Pinia (requisito obrigatório)
4. shadcn ui vue (requisito obrigatório)
5. Neon PostgreSQL (requisito obrigatório)
6. Hugging Face API (requisito obrigatório)

### Decisões Flexíveis (Poderiam Mudar)
1. TipTap (poderia ser Quill ou outro)
2. Zod (poderia ser Joi ou Yup)
3. DOMPurify (padrão, mas poderia ser outro sanitizer)

### Riscos Identificados
1. Compatibilidade shadcn ui vue com Nuxt v4 (validar)
2. Latência da Hugging Face API (monitorar)
3. Limites de taxa Hugging Face (implementar rate limiting se necessário)

---

## 13. Processo de Revisão de ADRs

### Quando Revisar
- Mudanças significativas nos requisitos
- Problemas técnicos graves identificados
- Mudanças na equipe ou orçamento
- Feedback de produção (após deploy)

### Como Revisar
1. Documentar problema/mudança
2. Reavaliar alternativas
3. Atualizar ADR com nova decisão (ou criar novo)
4. Comunicar mudança à equipe

### Versionamento
- ADRs são imutáveis após aceitos
- Novas decisões criam novos ADRs
- ADRs superseded são marcados como tal
