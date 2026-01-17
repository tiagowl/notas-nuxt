# Protótipos Interativos - Sistema de Gerenciamento de Notas

## 1. Visão Geral dos Protótipos

### Níveis de Fidelidade
- **Baixa Fidelidade**: Wireframes (já documentados)
- **Média Fidelidade**: Protótipos estáticos com interações básicas
- **Alta Fidelidade**: Protótipos funcionais (implementação final)

Este documento descreve **protótipos de média/alta fidelidade** com foco em interações e estados.

---

## 2. Protótipo 1: Fluxo de Criação Completa

### Cenário: Usuário cria primeiro marcador, sub-marcador e nota

#### Etapa 1: Tela Inicial (Estado Vazio)
**Estado inicial:**
```
┌─────────────────────────────────────┐
│ [Logo] Notas              [Config]  │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │         📁                     │  │
│  │                               │  │
│  │   Nenhum marcador criado      │  │
│  │   ainda.                      │  │
│  │                               │  │
│  │   [+ Criar Primeiro Marcador] │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

**Interação:**
- Botão "+ Criar Primeiro Marcador" pulsa levemente (animação sutil)
- Hover: Botão eleva e muda de cor
- Click: Abre modal de criação

---

#### Etapa 2: Modal Criar Marcador

**Estado inicial do modal:**
```
┌─────────────────────────────────────┐
│  Criar Novo Marcador          [×]   │
├─────────────────────────────────────┤
│                                     │
│  Nome do marcador:                 │
│  ┌───────────────────────────────┐  │
│  │ [Campo vazio com placeholder] │  │
│  └───────────────────────────────┘  │
│                                     │
│  [Cancelar]        [Criar Marcador] │
│                     (desabilitado)  │
└─────────────────────────────────────┘
```

**Interações:**
1. **Digitação no campo:**
   - Placeholder desaparece
   - Botão "Criar" habilita (após 1 caractere válido)
   - Validação em tempo real (verde ✓ se válido)

2. **Botão Criar (clique):**
   - Botão desabilita (previne duplo clique)
   - Spinner aparece no botão: "Criando..."
   - Modal fecha após 500ms (animação fade out)
   - Toast aparece: "✅ Marcador 'Estudos' criado com sucesso!"

3. **Botão Cancelar ou [×]:**
   - Modal fecha (animação fade out)
   - Confirmação se houver texto digitado: "Descartar alterações?"

---

#### Etapa 3: Lista de Marcadores (com novo marcador)

**Estado após criação:**
```
┌─────────────────────────────────────┐
│  Marcadores              [+ Novo]   │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 📁 Estudos      [⋮] [Editar] │  │
│  │ 0 sub-marcadores • 0 notas    │  │
│  │ Criado em: 20/01/2024         │  │
│  └───────────────────────────────┘  │
│        ↑                            │
│   Animação de entrada (slide + fade)│
└─────────────────────────────────────┘
```

**Interações:**
- **Hover no card**: Shadow aumenta, cursor pointer
- **Click no card**: Transição suave para lista de sub-marcadores
- **Click em [⋮]**: Menu dropdown com "Editar" e "Excluir"

---

#### Etapa 4: Lista de Sub-marcadores (Estado Vazio)

**Estado após clicar no marcador:**
```
┌─────────────────────────────────────┐
│ [←] Estudos > Sub-marcadores  [+]   │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │         📂                     │  │
│  │                               │  │
│  │   Nenhum sub-marcador criado  │  │
│  │   ainda.                      │  │
│  │                               │  │
│  │   [+ Criar Sub-marcador]      │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

**Interações:**
- Similar ao fluxo de criar marcador
- Breadcrumb mostra navegação: "Estudos > Sub-marcadores"

---

#### Etapa 5: Criação de Nota com IA

**Tela de criar nota:**
```
┌─────────────────────────────────────┐
│ [←] Estudos > Matemática      [×]   │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Título: [________________]    │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [B] [I] [U] [H1] [•]          │  │
│  ├───────────────────────────────┤  │
│  │                               │  │
│  │ [Editor vazio]                │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [✨ Gerar com IA]             │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

**Interação - Clicar em "Gerar com IA":**

1. **Abertura do Modal:**
   - Modal desliza de baixo para cima (mobile) ou fade in (desktop)
   - Overlay escurece o fundo

2. **Modal aberto:**
```
┌─────────────────────────────────────┐
│  Gerar Conteúdo com IA        [×]   │
├─────────────────────────────────────┤
│                                     │
│  Descreva o conteúdo desejado:     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │ [Digite aqui...]              │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  [Cancelar]     [Gerar Conteúdo]    │
│                   (desabilitado)    │
└─────────────────────────────────────┘
```

3. **Digitação na descrição:**
   - Validação: mínimo 10 caracteres
   - Botão habilita quando válido
   - Contador de caracteres (opcional): "X/500"

4. **Clicar em "Gerar":**
   - Modal muda para estado de loading:
```
┌─────────────────────────────────────┐
│  Gerando Conteúdo...          [×]   │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │      [🔄 Spinner animado]     │  │
│  │                               │  │
│  │  Gerando seu conteúdo...      │  │
│  │  Isso pode levar alguns       │  │
│  │  segundos.                    │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  [Cancelar]                         │
└─────────────────────────────────────┘
```
   - Botão "Cancelar" desabilita (processo iniciado)
   - Feedback de progresso (opcional): "Processando... 50%"

5. **Conteúdo gerado (sucesso):**
   - Modal fecha (fade out)
   - Conteúdo aparece no editor com animação:
     - Editor expande suavemente
     - Texto aparece letra por letra (typing effect) OU fade in instantâneo
   - Toast: "✅ Conteúdo gerado com sucesso!"

6. **Erro na geração:**
   - Modal mantém conteúdo digitado
   - Mensagem de erro:
```
┌─────────────────────────────────────┐
│  ❌ Erro ao Gerar Conteúdo          │
├─────────────────────────────────────┤
│                                     │
│  Não foi possível gerar o conteúdo.│
│  Possíveis causas:                  │
│  • API temporariamente indisponível │
│  • Descrição muito curta            │
│                                     │
│  [Fechar]    [Tentar Novamente]     │
└─────────────────────────────────────┘
```

---

#### Etapa 6: Salvar Nota

**Interação - Clicar em "Salvar" (ou Ctrl+S):**

1. **Validação:**
   - Título obrigatório (mostra erro se vazio)
   - Sub-marcador deve estar selecionado

2. **Salvamento:**
   - Botão "Salvar" muda para "Salvando..." com spinner
   - Botões desabilitam (prevenir ações durante salvamento)

3. **Sucesso:**
   - Toast: "✅ Nota salva com sucesso!"
   - Redireciona para lista de notas (com animação de transição)
   - Nova nota aparece na lista (animação de entrada)

---

## 3. Protótipo 2: Edição e Exclusão

### Edição de Nota Existente

**Interação - Editar Nota:**

1. **Na lista de notas:**
   - Hover: Botões "Editar" e "Excluir" aparecem
   - Click em "Editar": Transição para tela de edição

2. **Tela de edição (carregada):**
   - Título preenchido
   - Editor com conteúdo existente (preservando formatação)
   - Botão "Salvar" habilitado

3. **Modificações:**
   - Indicador de "modificações não salvas" (se houver mudanças)
   - Warning ao tentar sair: "Há alterações não salvas. Descartar?"

4. **Salvamento:**
   - Mesmo fluxo de criação
   - Toast: "✅ Nota atualizada com sucesso!"
   - Data de atualização atualiza automaticamente

---

### Exclusão de Nota

**Interação - Excluir Nota:**

1. **Click em "Excluir":**
   - Modal de confirmação aparece:
```
┌─────────────────────────────────────┐
│  Confirmar Exclusão           [×]   │
├─────────────────────────────────────┤
│                                     │
│  ⚠️  Atenção                        │
│                                     │
│  Você está prestes a excluir:       │
│                                     │
│  "Derivadas e Integrais"            │
│                                     │
│  Esta ação não pode ser desfeita.  │
│                                     │
│  [Cancelar]  [Excluir Definitivamente] │
│              (botão vermelho)      │
└─────────────────────────────────────┘
```

2. **Confirmação:**
   - Botão "Excluir" tem cor de destaque (vermelho/warning)
   - Hover: Botão pulsa levemente (atenção)
   - Click: Modal fecha, nota some da lista (animação fade out + slide)

3. **Feedback:**
   - Toast: "🗑️ Nota excluída"
   - Lista atualiza (se vazia, mostra estado vazio)

---

## 4. Protótipo 3: Navegação Mobile

### Menu Hamburger

**Interação - Abrir Menu:**

1. **Click no ícone [☰]:**
   - Menu desliza da esquerda (slide in)
   - Overlay escurece conteúdo de fundo
   - Animação: 300ms ease-out

2. **Menu aberto:**
   - Items com animação de entrada escalonada (stagger)
   - Highlight no item da seção atual

3. **Click em item:**
   - Menu fecha (slide out)
   - Navegação para nova tela (transição fade)

4. **Click no overlay ou [✕]:**
   - Menu fecha (slide out)

---

### Editor Rich Text Mobile

**Adaptações mobile:**

1. **Barra de ferramentas:**
   - Horizontal scrollável (deslize para ver mais opções)
   - Indicadores visuais de scroll (fade nas bordas)

2. **Keyboard virtual:**
   - Editor ajusta quando teclado aparece
   - Botões de ação ficam acessíveis acima do teclado

3. **Gestos:**
   - Swipe left/right: Navegar entre notas (futuro)
   - Pull to refresh: Recarregar lista (futuro)

---

## 5. Protótipo 4: Estados de Erro e Feedback

### Erro de Conexão

**Estado quando API falha:**

1. **Detecção:**
   - Toast de erro: "❌ Erro de conexão. Verifique sua internet."
   - Botão de retry aparece na ação que falhou

2. **Retry:**
   - Click em "Tentar novamente"
   - Ação tenta novamente (com feedback de loading)

---

### Timeout da IA

**Quando geração demora >30s:**

1. **Timeout ativado:**
   - Modal muda para estado de erro:
```
┌─────────────────────────────────────┐
│  ⏱️  Tempo Esgotado            [×]   │
├─────────────────────────────────────┤
│                                     │
│  A geração está demorando mais     │
│  que o esperado.                   │
│                                     │
│  [Fechar]  [Tentar Novamente]      │
└─────────────────────────────────────┘
```

2. **Opções:**
   - Tentar novamente (reinicia processo)
   - Fechar e digitar manualmente

---

## 6. Animações e Transições

### Animações de Entrada

**Cards de lista:**
- Fade in + slide up
- Duração: 300ms
- Easing: ease-out
- Delay escalonado (stagger) para múltiplos cards

**Modais:**
- Desktop: Fade in + scale (0.95 → 1.0)
- Mobile: Slide up from bottom
- Duração: 250ms

### Animações de Saída

**Modais:**
- Fade out + scale (1.0 → 0.95)
- Duração: 200ms (mais rápido que entrada)

**Cards removidos:**
- Fade out + slide left/right
- Duração: 300ms

### Micro-interações

**Botões:**
- Hover: Elevação (transform: translateY(-2px))
- Click: Scale (0.98)
- Duração: 150ms

**Loading spinners:**
- Rotação contínua (360deg)
- Duração: 1s linear
- Loop infinito

---

## 7. Feedback Tátil (Mobile)

### Vibração Sutil
- Ao salvar com sucesso: Vibração curta (1 pulse)
- Ao excluir: Vibração dupla (2 pulses)
- Ao erro: Vibração longa (3 pulses)

**Nota**: Vibração opcional (respeitar preferências do sistema)

---

## 8. Protótipos de Alta Fidelidade

### Ferramentas Recomendadas
- **Figma**: Para protótipos de média/alta fidelidade
- **Framer**: Para protótipos mais interativos
- **Nuxt + shadcn ui vue**: Implementação final (protótipo funcional)

### Checklist de Protótipos
- [ ] Fluxo completo de criação
- [ ] Edição e exclusão
- [ ] Geração com IA (sucesso e erro)
- [ ] Estados vazios
- [ ] Estados de loading
- [ ] Erros e retry
- [ ] Navegação mobile
- [ ] Menu hamburger
- [ ] Breadcrumbs
- [ ] Modais e confirmações

---

## 9. Testes de Usabilidade dos Protótipos

### Cenários de Teste

1. **Criar primeira nota completa** (novo usuário)
   - Tempo esperado: <5 minutos
   - Taxa de sucesso: >90%

2. **Gerar conteúdo com IA** (usuário existente)
   - Tempo esperado: <2 minutos (incluindo geração)
   - Taxa de sucesso: >80%

3. **Editar nota existente** (usuário experiente)
   - Tempo esperado: <1 minuto
   - Taxa de sucesso: >95%

4. **Navegação mobile** (diferentes dispositivos)
   - Taxa de conclusão: >85%
   - Satisfação: >4.0/5.0

---

## 10. Notas para Implementação

### Bibliotecas de Animação Recomendadas
- **Vue transitions**: Para transições de componentes
- **Framer Motion** (se compatível) ou **@vueuse/motion**: Para animações complexas
- **CSS Transitions**: Para micro-interações simples

### Performance
- Animações com `transform` e `opacity` (mais performáticas)
- Evitar animar `width`, `height`, `top`, `left`
- Usar `will-change` com cuidado
- Reduzir animações em dispositivos com preferência de movimento reduzida

### Acessibilidade em Animações
- Respeitar `prefers-reduced-motion` (CSS media query)
- Desabilitar animações se usuário preferir
- Manter transições funcionais mesmo sem animação
