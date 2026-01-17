# Critérios de Aceitação - Sistema de Gerenciamento de Notas

## Epic 1: Gestão de Estrutura Hierárquica

### US-001: Criar Marcador

#### Cenários de Sucesso
✅ Usuário pode criar um marcador através de um formulário  
✅ Marcador é salvo no banco de dados Neon  
✅ Marcador aparece na lista de marcadores após criação  
✅ Data de criação é registrada automaticamente  

#### Casos Extremos
⚠️ Tentativa de criar marcador sem nome: Sistema deve exibir mensagem de erro  
⚠️ Nome de marcador muito longo (>255 caracteres): Sistema deve limitar ou validar  
⚠️ Criar múltiplos marcadores com mesmo nome: Deve ser permitido (não há restrição de unicidade)  

#### Validações Necessárias
- Campo nome obrigatório
- Nome não pode ser vazio ou apenas espaços
- Sanitização de entrada para prevenir XSS

---

### US-002: Listar Marcadores

#### Cenários de Sucesso
✅ Todos os marcadores do usuário são exibidos em uma lista  
✅ Lista está ordenada (ex: por data de criação ou alfabeticamente)  
✅ Interface carrega rapidamente (< 2 segundos)  

#### Casos Extremos
⚠️ Usuário sem marcadores: Exibir mensagem "Nenhum marcador criado ainda"  
⚠️ Grande quantidade de marcadores (>100): Implementar paginação ou scroll infinito  

#### Validações Necessárias
- Dados devem ser carregados do banco de dados via Prisma
- Tratamento de erros de conexão com banco

---

### US-003: Editar Marcador

#### Cenários de Sucesso
✅ Usuário pode editar o nome do marcador  
✅ Alteração é salva no banco de dados  
✅ Data de atualização é registrada automaticamente  
✅ Interface atualiza após salvamento  

#### Casos Extremos
⚠️ Tentativa de salvar nome vazio: Exibir erro de validação  
⚠️ Edição simultânea: Sistema deve lidar com conflitos (last-write-wins aceitável)  

#### Validações Necessárias
- Mesmas validações de criação (nome obrigatório, não vazio)
- Verificação de permissão (usuário só edita seus próprios marcadores)

---

### US-004: Excluir Marcador

#### Cenários de Sucesso
✅ Sistema solicita confirmação antes de excluir  
✅ Ao confirmar, marcador e todos os sub-marcadores e notas são excluídos (cascata)  
✅ Interface atualiza após exclusão  
✅ Exclusão é permanente (não há lixeira)  

#### Casos Extremos
⚠️ Marcador com muitos sub-marcadores (>50): Exclusão deve ser eficiente  
⚠️ Exclusão acidental: Confirmação deve ser clara e destacada  

#### Validações Necessárias
- Confirmar exclusão em cascata de sub-marcadores e notas
- Exibir contagem de itens que serão excluídos na confirmação
- Tratamento de erros durante exclusão (rollback se necessário)

---

### US-005: Criar Sub-marcador

#### Cenários de Sucesso
✅ Usuário pode criar um sub-marcador dentro de um marcador  
✅ Sub-marcador é associado ao marcador pai  
✅ Sub-marcador aparece na lista do marcador após criação  
✅ Data de criação é registrada automaticamente  

#### Casos Extremos
⚠️ Tentativa de criar sub-marcador sem selecionar marcador: Sistema deve exigir seleção  
⚠️ Nome de sub-marcador muito longo: Validação de limite de caracteres  

#### Validações Necessárias
- Marcador pai obrigatório
- Validações de nome (mesmas de marcador)

---

### US-006: Listar Sub-marcadores

#### Cenários de Sucesso
✅ Sub-marcadores de um marcador são exibidos  
✅ Interface mostra claramente a hierarquia (marcador → sub-marcadores)  
✅ Lista é carregada rapidamente  

#### Casos Extremos
⚠️ Marcador sem sub-marcadores: Exibir mensagem apropriada  
⚠️ Muitos sub-marcadores: Considerar paginação  

#### Validações Necessárias
- Filtragem correta por marcador pai

---

### US-007: Editar Sub-marcador

#### Cenários de Sucesso
✅ Usuário pode editar o nome do sub-marcador  
✅ Alteração é salva e interface atualiza  
✅ Data de atualização é registrada  

#### Casos Extremos e Validações
⚠️ Mesmos critérios de US-003 (Editar Marcador)

---

### US-008: Excluir Sub-marcador

#### Cenários de Sucesso
✅ Sistema solicita confirmação  
✅ Ao confirmar, sub-marcador e todas as notas são excluídos (cascata)  
✅ Interface atualiza após exclusão  

#### Casos Extremos e Validações
⚠️ Similar a US-004, mas em cascata apenas de notas (não de outros sub-marcadores)

---

## Epic 2: Gestão de Notas

### US-009: Criar Nota

#### Cenários de Sucesso
✅ Usuário pode criar nota com título e conteúdo  
✅ Nota é associada a um sub-marcador  
✅ Título, conteúdo (rich text) e data de criação são salvos  
✅ Nota aparece na lista após criação  

#### Casos Extremos
⚠️ Tentativa de criar nota sem título: Exibir erro de validação  
⚠️ Tentativa de criar nota sem selecionar sub-marcador: Exibir erro  
⚠️ Conteúdo muito extenso: Sistema deve suportar grandes textos (mínimo 10.000 caracteres)  

#### Validações Necessárias
- Título obrigatório
- Sub-marcador obrigatório
- Sanitização de conteúdo rich text para segurança
- Validação de tamanho máximo de conteúdo

---

### US-010: Listar Notas

#### Cenários de Sucesso
✅ Notas de um sub-marcador são exibidas em lista  
✅ Cada item da lista mostra título e data de criação  
✅ Interface permite clicar para visualizar nota completa  
✅ Lista é carregada rapidamente (< 2 segundos)  

#### Casos Extremos
⚠️ Sub-marcador sem notas: Exibir mensagem "Nenhuma nota criada ainda"  
⚠️ Muitas notas (>50): Implementar paginação ou scroll infinito  

#### Validações Necessárias
- Filtragem correta por sub-marcador
- Ordenação (ex: por data de criação, mais recente primeiro)

---

### US-011: Visualizar Nota

#### Cenários de Sucesso
✅ Título da nota é exibido claramente  
✅ Conteúdo rich text é renderizado com formatação preservada  
✅ Data de criação é exibida  
✅ Interface permite edição ou exclusão  

#### Casos Extremos
⚠️ Nota com conteúdo muito longo: Scroll deve funcionar corretamente  
⚠️ Nota com formatação complexa: Rich text deve ser renderizado corretamente  

#### Validações Necessárias
- Renderização segura de HTML (sanitização)
- Compatibilidade com diferentes tipos de conteúdo rich text

---

### US-012: Editar Nota

#### Cenários de Sucesso
✅ Usuário pode editar título e conteúdo  
✅ Alterações são salvas no banco de dados  
✅ Data de atualização é registrada automaticamente  
✅ Interface mostra estado "salvo" após atualização  

#### Casos Extremos
⚠️ Tentativa de salvar título vazio: Exibir erro de validação  
⚠️ Edição de conteúdo muito extenso: Sistema deve suportar  
⚠️ Perda de formatação: Rich text deve preservar formatação existente  

#### Validações Necessárias
- Título obrigatório (mesmas validações de criação)
- Preservação de formatação rich text
- Feedback visual de salvamento

---

### US-013: Excluir Nota

#### Cenários de Sucesso
✅ Sistema solicita confirmação antes de excluir  
✅ Nota é excluída permanentemente após confirmação  
✅ Interface atualiza (lista ou visualização)  

#### Casos Extremos
⚠️ Exclusão acidental: Confirmação deve ser clara  
⚠️ Exclusão durante edição: Deve cancelar edição e excluir  

#### Validações Necessárias
- Confirmação obrigatória
- Exclusão permanente (sem recuperação)

---

## Epic 3: Geração de Conteúdo com IA

### US-014: Descrever Conteúdo Desejado

#### Cenários de Sucesso
✅ Textarea está disponível na interface de criação de nota  
✅ Usuário pode digitar descrição livremente  
✅ Textarea permite múltiplas linhas e texto extenso  

#### Casos Extremos
⚠️ Textarea vazio ao clicar em "Gerar": Exibir erro solicitando descrição  
⚠️ Texto muito extenso: Deve suportar pelo menos 500 caracteres  

#### Validações Necessárias
- Textarea obrigatório antes de gerar
- Validação de mínimo de caracteres (ex: mínimo 10)

---

### US-015: Gerar Conteúdo com IA

#### Cenários de Sucesso
✅ Ao clicar em "Gerar", sistema chama API Hugging Face  
✅ Feedback visual é exibido durante processamento (loading/spinner)  
✅ Conteúdo é gerado e retornado com sucesso  
✅ Conteúdo aparece no editor rich text  

#### Casos Extremos
⚠️ API Hugging Face indisponível: Exibir mensagem de erro clara e sugestão de tentar novamente  
⚠️ Timeout da API (>30 segundos): Exibir mensagem de timeout e opção de retry  
⚠️ Erro de autenticação da API: Log de erro e mensagem ao usuário  
⚠️ Resposta vazia da API: Tratar graciosamente e sugerir descrição mais detalhada  
⚠️ Taxa de requisições excedida: Exibir mensagem e sugerir esperar  

#### Validações Necessárias
- Tratamento robusto de erros da API
- Timeout configurado (30 segundos)
- Retry logic (opcional, mas recomendado)
- Logging de erros para debugging
- Feedback visual durante todo o processo

---

### US-016: Visualizar Conteúdo Gerado

#### Cenários de Sucesso
✅ Conteúdo gerado aparece no editor rich text  
✅ Conteúdo é formatado corretamente  
✅ Usuário pode editar o conteúdo gerado  

#### Casos Extremos
⚠️ Conteúdo com formatação especial: Deve ser preservado no editor  
⚠️ Conteúdo muito longo: Editor deve suportar scroll  

#### Validações Necessárias
- Renderização correta no editor rich text
- Capacidade de edição após geração

---

### US-017: Salvar Nota Após Geração

#### Cenários de Sucesso
✅ Usuário pode salvar nota após revisar conteúdo gerado  
✅ Mesmos critérios de US-009 (Criar Nota) se aplicam  
✅ Fluxo é intuitivo (Gerar → Revisar → Salvar)  

#### Casos Extremos e Validações
⚠️ Mesmos critérios de US-009

---

## Epic 4: Interface Responsiva

### US-018: Layout Desktop

#### Cenários de Sucesso
✅ Interface utiliza espaço horizontal e vertical eficientemente  
✅ Menu lateral ou superior está sempre visível  
✅ Editor rich text tem área confortável para edição  
✅ Todas as funcionalidades são acessíveis e usáveis  

#### Casos Extremos
⚠️ Janela muito estreita (< 1024px): Deve transicionar para layout mobile  
⚠️ Resoluções muito altas (4K): Interface deve escalar apropriadamente  

#### Validações Necessárias
- Breakpoint de desktop: mínimo 1024px de largura
- Teste em diferentes resoluções comuns

---

### US-019: Layout Mobile

#### Cenários de Sucesso
✅ Interface se adapta a telas pequenas (< 768px)  
✅ Menu hamburguer funciona corretamente  
✅ Editor rich text é usável em tela pequena  
✅ Botões e elementos interativos têm tamanho adequado para toque (mínimo 44x44px)  
✅ Navegação é intuitiva em dispositivos móveis  

#### Casos Extremos
⚠️ Telas muito pequenas (< 320px): Interface deve ser minimamente funcional  
⚠️ Orientação landscape: Layout deve se adaptar  
⚠️ Teclado virtual aberto: Interface não deve quebrar  

#### Validações Necessárias
- Breakpoint de mobile: máximo 767px de largura
- Teste em dispositivos iOS e Android reais
- Touch targets mínimos de 44x44px
- Suporte a orientação portrait e landscape

---

### US-020: Navegação Responsiva

#### Cenários de Sucesso
✅ Menu se adapta ao tamanho da tela (hamburger em mobile, menu lateral em desktop)  
✅ Navegação hierárquica funciona em ambos os layouts  
✅ Breadcrumbs ou navegação contextual indicam localização atual  

#### Casos Extremos
⚠️ Navegação profunda (marcador → sub-marcador → nota): Deve ser clara em mobile  
⚠️ Retorno à lista: Botão/breadcrumb deve estar sempre acessível  

#### Validações Necessárias
- Navegação consistente entre mobile e desktop
- Indicadores de localização (breadcrumbs)

---

## Epic 5: Editor Rich Text

### US-021: Editor Rich Text Funcional

#### Cenários de Sucesso
✅ Editor permite formatação básica (negrito, itálico, sublinhado)  
✅ Editor suporta listas (ordenadas e não-ordenadas)  
✅ Editor suporta cabeçalhos (H1, H2, H3)  
✅ Formatação é preservada ao salvar e carregar  
✅ Editor é compatível com shadcn ui vue  

#### Casos Extremos
⚠️ Colar conteúdo de fontes externas: Deve sanitizar e preservar formatação relevante  
⚠️ Formatação complexa (tabelas, imagens): Pode ser feature futura, mas básico deve funcionar  

#### Validações Necessárias
- Sanitização de HTML para segurança
- Compatibilidade com componentes shadcn ui vue
- Suporte mínimo: negrito, itálico, listas, parágrafos

---

## Critérios Gerais de Aceitação

### Performance
- Carregamento inicial < 3 segundos
- Operações CRUD < 1 segundo
- Geração de IA com timeout de 30 segundos

### Segurança
- Validação de entrada em todos os formulários
- Sanitização de conteúdo rich text
- Proteção CSRF nas API routes

### Usabilidade
- Feedback visual para todas as ações
- Mensagens de erro claras e acionáveis
- Interface intuitiva seguindo design system

### Compatibilidade
- Navegadores: Chrome, Firefox, Safari, Edge (últimas 2 versões)
- Dispositivos: iOS 12+, Android 8+
