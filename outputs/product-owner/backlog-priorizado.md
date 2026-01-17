# Backlog Priorizado - Sistema de Gerenciamento de Notas

## Metodologia de Priorização

A priorização foi realizada utilizando a técnica **Value vs Effort** (Valor vs Esforço), considerando:
- **Valor de Negócio**: Impacto no objetivo principal do produto
- **Esforço de Desenvolvimento**: Complexidade e tempo estimado (Story Points)
- **Dependências**: Features que bloqueiam outras
- **Riscos**: Potencial impacto de problemas

## Sprint 0: Setup e Fundação

**Objetivo**: Preparar ambiente e infraestrutura base

| ID | User Story | Prioridade | SP | Dependências |
|----|-----------|------------|----|--------------| 
| SETUP-001 | Configurar projeto Nuxt v4 | Crítica | 3 | - |
| SETUP-002 | Configurar Prisma ORM com Neon | Crítica | 3 | SETUP-001 |
| SETUP-003 | Configurar shadcn ui vue | Crítica | 2 | SETUP-001 |
| SETUP-004 | Criar schema de banco de dados (Marcador, Sub-marcador, Nota) | Crítica | 3 | SETUP-002 |
| SETUP-005 | Configurar API routes do Nuxt | Crítica | 2 | SETUP-001 |

**Total Sprint 0**: 13 story points

---

## Sprint 1: Estrutura Hierárquica Base (Must Have)

**Objetivo**: Implementar estrutura hierárquica essencial para organização

| ID | User Story | Prioridade | SP | Dependências | Valor | Motivo |
|----|-----------|------------|----|--------------|-------|--------|
| US-001 | Criar Marcador | Alta | 2 | SETUP-004 | Alto | Base para toda estrutura |
| US-002 | Listar Marcadores | Alta | 1 | US-001 | Alto | Necessário para navegação |
| US-005 | Criar Sub-marcador | Alta | 2 | US-001 | Alto | Segundo nível da hierarquia |
| US-006 | Listar Sub-marcadores | Alta | 1 | US-005 | Alto | Navegação da hierarquia |

**Total Sprint 1**: 6 story points

**Justificativa**: Sem estrutura hierárquica, não há como organizar notas. Estas são as features mínimas viáveis para começar a usar o sistema.

---

## Sprint 2: Gestão Básica de Notas (Must Have)

**Objetivo**: Permitir criação e visualização de notas

| ID | User Story | Prioridade | SP | Dependências | Valor | Motivo |
|----|-----------|------------|----|--------------|-------|--------|
| US-009 | Criar Nota | Crítica | 3 | US-006, SETUP-004 | Crítico | Funcionalidade principal |
| US-010 | Listar Notas | Crítica | 2 | US-009 | Crítico | Necessário para encontrar notas |
| US-011 | Visualizar Nota | Crítica | 1 | US-009 | Crítico | Leitura de conteúdo |
| US-021 | Editor Rich Text Funcional | Alta | 5 | US-009 | Alto | Requisito obrigatório de conteúdo |

**Total Sprint 2**: 11 story points

**Justificativa**: Após a estrutura hierárquica, a criação e visualização de notas é o próximo passo crítico. Editor rich text é fundamental para o requisito de conteúdo formatado.

---

## Sprint 3: Edição e Exclusão (Must Have)

**Objetivo**: Completar operações CRUD básicas

| ID | User Story | Prioridade | SP | Dependências | Valor | Motivo |
|----|-----------|------------|----|--------------|-------|--------|
| US-012 | Editar Nota | Crítica | 3 | US-009 | Crítico | Necessário para atualizar conteúdo |
| US-013 | Excluir Nota | Alta | 1 | US-009 | Alto | Necessário para limpeza |
| US-003 | Editar Marcador | Média | 1 | US-001 | Médio | Melhora experiência |
| US-004 | Excluir Marcador | Média | 3 | US-001 | Médio | Limpeza de estrutura |

**Total Sprint 3**: 8 story points

**Justificativa**: Completar CRUD básico permite uso completo do sistema para casos básicos. Edição e exclusão são essenciais para manutenção de conteúdo.

---

## Sprint 4: Geração de Conteúdo com IA (High Value)

**Objetivo**: Implementar diferencial competitivo - geração de conteúdo com IA

| ID | User Story | Prioridade | SP | Dependências | Valor | Motivo |
|----|-----------|------------|----|--------------|-------|--------|
| US-014 | Descrever Conteúdo Desejado | Alta | 1 | US-009 | Alto | Interface de entrada |
| US-015 | Gerar Conteúdo com IA | Alta | 5 | US-014, SETUP-001 | Alto | Diferencial do produto |
| US-016 | Visualizar Conteúdo Gerado | Alta | 2 | US-015, US-021 | Alto | Revisão antes de salvar |
| US-017 | Salvar Nota Após Geração | Alta | 1 | US-015, US-009 | Alto | Fluxo completo |

**Total Sprint 4**: 9 story points

**Justificativa**: Geração de conteúdo com IA é um diferencial competitivo e agregador de valor. Requer integração externa (Hugging Face), mas é feature chave do produto.

**Riscos Identificados**:
- Dependência de API externa (Hugging Face)
- Pode haver atrasos por problemas de integração
- Necessário tratamento robusto de erros

---

## Sprint 5: Responsividade Mobile (Must Have)

**Objetivo**: Suportar acesso em dispositivos móveis

| ID | User Story | Prioridade | SP | Dependências | Valor | Motivo |
|----|-----------|------------|----|--------------|-------|--------|
| US-019 | Layout Mobile | Alta | 5 | Todas anteriores | Alto | Requisito obrigatório |
| US-020 | Navegação Responsiva | Alta | 3 | US-019 | Alto | Usabilidade mobile |
| US-018 | Layout Desktop | Alta | 3 | - | Alto | Otimização desktop |

**Total Sprint 5**: 11 story points

**Justificativa**: Responsividade é requisito obrigatório mencionado nos requisitos. Mobile-first pode ser considerado, mas desktop também precisa ser otimizado.

**Nota**: US-019 e US-020 podem ser desenvolvidos em paralelo com outras sprints, mas devem ser testados com features completas.

---

## Sprint 6: Refinamentos e Melhorias (Nice to Have)

**Objetivo**: Melhorar experiência e completar funcionalidades secundárias

| ID | User Story | Prioridade | SP | Dependências | Valor | Motivo |
|----|-----------|------------|----|--------------|-------|--------|
| US-007 | Editar Sub-marcador | Média | 1 | US-005 | Médio | Conveniência |
| US-008 | Excluir Sub-marcador | Média | 2 | US-005 | Médio | Limpeza |

**Total Sprint 6**: 3 story points

**Justificativa**: Funcionalidades de edição/exclusão de sub-marcadores são menos críticas e podem ser desenvolvidas após funcionalidades principais.

---

## Resumo do Backlog

### Priorização por Valor de Negócio

#### 🔴 Críticas (Must Have - MVP)
- US-009: Criar Nota
- US-010: Listar Notas
- US-011: Visualizar Nota
- US-012: Editar Nota

#### 🟠 Altas (High Value - MVP Completo)
- US-001: Criar Marcador
- US-002: Listar Marcadores
- US-005: Criar Sub-marcador
- US-006: Listar Sub-marcadores
- US-013: Excluir Nota
- US-014: Descrever Conteúdo Desejado
- US-015: Gerar Conteúdo com IA
- US-016: Visualizar Conteúdo Gerado
- US-017: Salvar Nota Após Geração
- US-018: Layout Desktop
- US-019: Layout Mobile
- US-020: Navegação Responsiva
- US-021: Editor Rich Text Funcional

#### 🟡 Médias (Nice to Have)
- US-003: Editar Marcador
- US-004: Excluir Marcador
- US-007: Editar Sub-marcador
- US-008: Excluir Sub-marcador

### Roadmap Visual

```
Sprint 0: [█████████████] Setup (13 SP)
Sprint 1: [██████] Estrutura Hierárquica (6 SP)
Sprint 2: [███████████] Gestão de Notas (11 SP)
Sprint 3: [████████] CRUD Completo (8 SP)
Sprint 4: [█████████] IA (9 SP)
Sprint 5: [███████████] Responsividade (11 SP)
Sprint 6: [███] Refinamentos (3 SP)
```

**Total MVP (Sprints 0-4)**: 47 story points  
**Total Completo (Sprints 0-6)**: 61 story points

### Dependências Críticas

1. **Infraestrutura → Funcionalidades**
   - SETUP precisa estar completo antes de todas as features

2. **Hierarquia → Notas**
   - Estrutura hierárquica (Sprint 1) deve estar pronta antes de notas (Sprint 2)

3. **Editor → IA**
   - Editor rich text (Sprint 2) necessário para exibir conteúdo gerado (Sprint 4)

4. **Features → Responsividade**
   - Responsividade (Sprint 5) pode ser desenvolvida em paralelo, mas testada após features principais

### Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| API Hugging Face indisponível | Alto | Implementar fallback, tratamento robusto de erros, considerar alternativa |
| Incompatibilidade shadcn ui vue com Nuxt v4 | Alto | Validar compatibilidade em SETUP-003, ter plano B |
| Performance do rich text em mobile | Médio | Testes de performance, otimizações específicas |
| Limites de taxa da API Hugging Face | Médio | Rate limiting, feedback ao usuário, plano de contingência |

### Definição de Pronto (Definition of Done)

Uma user story está pronta quando:
- ✅ Código desenvolvido e revisado
- ✅ Critérios de aceitação atendidos
- ✅ Testes unitários (quando aplicável)
- ✅ Testes manuais realizados
- ✅ Documentação atualizada (se necessário)
- ✅ Responsivo em mobile e desktop
- ✅ Sem erros críticos
- ✅ Integração com API routes funcionando

### Considerações para Planejamento

1. **Velocidade da Equipe**: Assumindo velocidade inicial de 8-10 SP por sprint, MVP pode ser concluído em 5-6 sprints (incluindo setup)

2. **Buffer para Imprevistos**: Adicionar 20% de buffer para:
   - Problemas de integração com APIs externas
   - Ajustes de UI/UX
   - Bugs descobertos em testes

3. **Deploy Incremental**: Considerar deploy após Sprint 2 (MVP básico funcional) para validação com usuários

4. **Testes**: Implementar testes automatizados desde Sprint 1 para evitar débito técnico
