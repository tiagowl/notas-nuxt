# User Stories - Sistema de Gerenciamento de Notas

## Epic 1: Gestão de Estrutura Hierárquica

### US-001: Criar Marcador
**Como** usuário do sistema  
**Eu quero** criar um marcador  
**Para que** eu possa organizar minhas notas em categorias principais

**Prioridade**: Alta  
**Estimativa**: 2 story points

---

### US-002: Listar Marcadores
**Como** usuário do sistema  
**Eu quero** visualizar todos os meus marcadores  
**Para que** eu possa navegar e escolher onde organizar minhas notas

**Prioridade**: Alta  
**Estimativa**: 1 story point

---

### US-003: Editar Marcador
**Como** usuário do sistema  
**Eu quero** editar o nome de um marcador  
**Para que** eu possa corrigir ou atualizar a organização quando necessário

**Prioridade**: Média  
**Estimativa**: 1 story point

---

### US-004: Excluir Marcador
**Como** usuário do sistema  
**Eu quero** excluir um marcador e todo seu conteúdo  
**Para que** eu possa remover categorias que não uso mais

**Prioridade**: Média  
**Estimativa**: 3 story points

**Notas**: Deve excluir em cascata sub-marcadores e notas associadas

---

### US-005: Criar Sub-marcador
**Como** usuário do sistema  
**Eu quero** criar um sub-marcador dentro de um marcador  
**Para que** eu possa ter uma organização mais granular das minhas notas

**Prioridade**: Alta  
**Estimativa**: 2 story points

**Notas**: Sub-marcador deve pertencer obrigatoriamente a um marcador

---

### US-006: Listar Sub-marcadores
**Como** usuário do sistema  
**Eu quero** visualizar todos os sub-marcadores de um marcador  
**Para que** eu possa navegar pela estrutura hierárquica

**Prioridade**: Alta  
**Estimativa**: 1 story point

---

### US-007: Editar Sub-marcador
**Como** usuário do sistema  
**Eu quero** editar o nome de um sub-marcador  
**Para que** eu possa atualizar a organização quando necessário

**Prioridade**: Média  
**Estimativa**: 1 story point

---

### US-008: Excluir Sub-marcador
**Como** usuário do sistema  
**Eu quero** excluir um sub-marcador e todas as suas notas  
**Para que** eu possa remover categorias que não uso mais

**Prioridade**: Média  
**Estimativa**: 2 story points

**Notas**: Deve excluir em cascata todas as notas associadas

---

## Epic 2: Gestão de Notas

### US-009: Criar Nota
**Como** usuário do sistema  
**Eu quero** criar uma nova nota com título e conteúdo  
**Para que** eu possa armazenar informações importantes

**Prioridade**: Crítica  
**Estimativa**: 3 story points

**Notas**: Nota deve pertencer obrigatoriamente a um sub-marcador. Deve ter título, conteúdo (rich text) e data de criação automática.

---

### US-010: Listar Notas
**Como** usuário do sistema  
**Eu quero** visualizar todas as notas de um sub-marcador  
**Para que** eu possa encontrar rapidamente as informações que preciso

**Prioridade**: Crítica  
**Estimativa**: 2 story points

---

### US-011: Visualizar Nota
**Como** usuário do sistema  
**Eu quero** visualizar o conteúdo completo de uma nota  
**Para que** eu possa ler todas as informações armazenadas

**Prioridade**: Crítica  
**Estimativa**: 1 story point

**Notas**: Deve exibir título, conteúdo formatado (rich text) e data de criação

---

### US-012: Editar Nota
**Como** usuário do sistema  
**Eu quero** editar uma nota existente  
**Para que** eu possa atualizar ou corrigir informações quando necessário

**Prioridade**: Crítica  
**Estimativa**: 3 story points

**Notas**: Deve permitir edição de título e conteúdo (rich text). Data de atualização deve ser registrada automaticamente.

---

### US-013: Excluir Nota
**Como** usuário do sistema  
**Eu quero** excluir uma nota  
**Para que** eu possa remover informações que não são mais relevantes

**Prioridade**: Alta  
**Estimativa**: 1 story point

**Notas**: Deve solicitar confirmação antes de excluir

---

## Epic 3: Geração de Conteúdo com IA

### US-014: Descrever Conteúdo Desejado
**Como** usuário do sistema  
**Eu quero** digitar uma descrição do conteúdo que desejo criar em um textarea  
**Para que** o sistema possa gerar o conteúdo apropriado usando IA

**Prioridade**: Alta  
**Estimativa**: 1 story point

**Notas**: Textarea deve ser intuitivo e permitir descrições detalhadas

---

### US-015: Gerar Conteúdo com IA
**Como** usuário do sistema  
**Eu quero** clicar em um botão "Gerar" para acionar a API de IA  
**Para que** o conteúdo seja gerado automaticamente baseado na minha descrição

**Prioridade**: Alta  
**Estimativa**: 5 story points

**Notas**: 
- Integração com API Hugging Face
- Feedback visual durante o processamento
- Tratamento de erros da API

---

### US-016: Visualizar Conteúdo Gerado
**Como** usuário do sistema  
**Eu quero** visualizar o conteúdo gerado pela IA no editor rich text  
**Para que** eu possa revisar e ajustar antes de salvar

**Prioridade**: Alta  
**Estimativa**: 2 story points

**Notas**: Conteúdo deve aparecer formatado no editor rich text para permitir edição

---

### US-017: Salvar Nota Após Geração
**Como** usuário do sistema  
**Eu quero** salvar a nota após revisar o conteúdo gerado  
**Para que** o conteúdo seja armazenado permanentemente

**Prioridade**: Alta  
**Estimativa**: 1 story point

**Notas**: Integrado com US-009, mas com fluxo específico pós-geração

---

## Epic 4: Interface Responsiva

### US-018: Layout Desktop
**Como** usuário do sistema  
**Eu quero** usar o sistema em um computador desktop  
**Para que** eu tenha uma experiência otimizada com mais espaço de tela

**Prioridade**: Alta  
**Estimativa**: 3 story points

**Notas**: Layout deve aproveitar espaço horizontal e vertical disponível

---

### US-019: Layout Mobile
**Como** usuário do sistema  
**Eu quero** usar o sistema em um dispositivo móvel  
**Para que** eu possa acessar minhas notas em qualquer lugar

**Prioridade**: Alta  
**Estimativa**: 5 story points

**Notas**: 
- Navegação adaptada para toque
- Menu responsivo
- Editor rich text funcional em telas pequenas

---

### US-020: Navegação Responsiva
**Como** usuário do sistema  
**Eu quero** navegar pela estrutura hierárquica de forma intuitiva em qualquer dispositivo  
**Para que** eu possa encontrar minhas notas facilmente

**Prioridade**: Alta  
**Estimativa**: 3 story points

**Notas**: Menu deve se adaptar ao tamanho da tela (hamburger menu em mobile, menu lateral em desktop)

---

## Epic 5: Editor Rich Text

### US-021: Editor Rich Text Funcional
**Como** usuário do sistema  
**Eu quero** criar e editar conteúdo com formatação (negrito, itálico, listas, etc.)  
**Para que** eu possa estruturar melhor minhas notas

**Prioridade**: Alta  
**Estimativa**: 5 story points

**Notas**: Integração com editor rich text compatível com shadcn ui vue

---

## Resumo de User Stories

- **Total de User Stories**: 21
- **Críticas**: 4 (US-009, US-010, US-011, US-012)
- **Altas**: 13
- **Médias**: 4
- **Total de Story Points**: 45 pontos
