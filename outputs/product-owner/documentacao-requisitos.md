# Documentação de Requisitos - Sistema de Gerenciamento de Notas

## 1. Análise dos Requisitos

### 1.1 Objetivos de Negócio
- Fornecer uma plataforma para organização pessoal e profissional de informações através de notas hierárquicas
- Facilitar a criação de conteúdo usando Inteligência Artificial
- Permitir estruturação de conhecimento através de marcadores e sub-marcadores
- Oferecer experiência responsiva em diferentes dispositivos

### 1.2 Usuários-Alvo (Personas)

#### Persona 1: Estudante Universitário
- **Idade**: 18-25 anos
- **Perfil**: Utiliza notas para estudos, pesquisas e trabalhos acadêmicos
- **Necessidades**: Organizar conteúdo por disciplinas, gerar resumos automáticos
- **Habilidades Técnicas**: Intermediárias

#### Persona 2: Profissional Conhecimento
- **Idade**: 25-45 anos
- **Perfil**: Trabalha com gestão de conhecimento, precisa organizar informações complexas
- **Necessidades**: Estrutura hierárquica, busca eficiente, edição rápida
- **Habilidades Técnicas**: Intermediárias a Avançadas

#### Persona 3: Criador de Conteúdo
- **Idade**: 20-40 anos
- **Perfil**: Bloggers, escritores, criadores digitais
- **Necessidades**: Rich text, geração de conteúdo com IA, organização por temas
- **Habilidades Técnicas**: Básicas a Intermediárias

### 1.3 Funcionalidades Principais

#### 1.3.1 Gestão de Estrutura Hierárquica
- Criação de Marcadores (nível 1)
- Criação de Sub-marcadores (nível 2, pertencentes a marcadores)
- Criação de Notas (nível 3, pertencentes a sub-marcadores)

#### 1.3.2 Gestão de Notas
- Criar nota com título, conteúdo e data de criação
- Editar nota existente
- Excluir nota
- Visualizar nota com conteúdo em rich text

#### 1.3.3 Geração de Conteúdo com IA
- Interface de entrada (textarea) para descrição do conteúdo desejado
- Integração com API Hugging Face para geração de conteúdo
- Processo: Descrever → Gerar → Revisar → Salvar

#### 1.3.4 Interface Responsiva
- Layout adaptável para dispositivos móveis
- Layout otimizado para desktop
- Navegação intuitiva em diferentes tamanhos de tela

### 1.4 Restrições e Limitações

#### 1.4.1 Restrições Técnicas
- **Framework**: Nuxt v4 e seu ecossistema (obrigatório)
- **UI Components**: shadcn ui vue e seu design system
- **ORM**: Prisma ORM com API routes do Nuxt (usar o módulo @prisma/nuxt)
- **Banco de Dados**: Neon (PostgreSQL)
- **API de IA**: Hugging Face
- **Gerenciamento de estado**: Pinia (usar o modulo @pinia/nuxt)

#### 1.4.2 Restrições Funcionais
- Estrutura hierárquica fixa: Marcador → Sub-marcador → Nota
- Não há níveis adicionais de hierarquia
- Rich text obrigatório para conteúdo de notas

#### 1.4.3 Limitações de Negócio
- Dependência de API externa (Hugging Face) para geração de conteúdo
- Necessidade de conexão com internet para funcionalidade de IA
- Limitações de taxa da API de IA (dependem do plano contratado)

### 1.5 Requisitos Não-Funcionais

#### 1.5.1 Performance
- Carregamento inicial da aplicação < 3 segundos
- Geração de conteúdo via IA com timeout máximo de 30 segundos
- Interface responsiva em dispositivos móveis

#### 1.5.2 Usabilidade
- Interface intuitiva seguindo design system do shadcn ui vue
- Feedback visual para todas as ações do usuário
- Validação de formulários em tempo real

#### 1.5.3 Segurança
- Validação de entrada de dados
- Sanitização de conteúdo rich text
- Proteção contra SQL injection (via Prisma ORM)

#### 1.5.4 Compatibilidade
- Navegadores modernos (Chrome, Firefox, Safari, Edge - últimas 2 versões)
- Dispositivos móveis (iOS 12+, Android 8+)
- Resoluções de tela: 320px a 4K

## 2. Jornada do Usuário

### 2.1 Fluxo Principal - Primeiro Uso
1. **Acesso ao Sistema**: Usuário acessa a aplicação
2. **Criação de Marcador**: Usuário cria seu primeiro marcador
3. **Criação de Sub-marcador**: Usuário cria um sub-marcador relacionado ao marcador
4. **Criação de Nota**: Usuário inicia a criação de uma nota
5. **Geração com IA**:
   - Usuário descreve o conteúdo desejado no textarea
   - Clica em "Gerar"
   - Sistema chama API Hugging Face
   - Conteúdo é gerado e exibido no editor rich text
6. **Revisão e Edição**: Usuário revisa e ajusta o conteúdo gerado
7. **Salvamento**: Usuário salva a nota

### 2.2 Fluxo Secundário - Edição de Nota Existente
1. Usuário visualiza lista de notas
2. Seleciona nota para editar
3. Modifica título e/ou conteúdo
4. Salva alterações

### 2.3 Fluxo Secundário - Exclusão de Nota
1. Usuário visualiza nota
2. Clica em ação de excluir
3. Sistema solicita confirmação
4. Nota é excluída

## 3. Modelo de Dados Conceitual

### 3.1 Entidades

#### Marcador
- ID (chave primária)
- Nome
- Data de criação
- Data de atualização
- Usuário (relacionamento)

#### Sub-marcador
- ID (chave primária)
- Nome
- Marcador ID (chave estrangeira)
- Data de criação
- Data de atualização

#### Nota
- ID (chave primária)
- Título
- Conteúdo (rich text)
- Data de criação
- Data de atualização
- Sub-marcador ID (chave estrangeira)

### 3.2 Relacionamentos
- 1 Marcador → N Sub-marcadores
- 1 Sub-marcador → N Notas

## 4. Dependências e Riscos

### 4.1 Dependências Técnicas
- **Nuxt v4**: Framework base (deve estar estável)
- **shadcn ui vue**: Componentes UI (compatibilidade com Nuxt v4)
- **Prisma ORM**: ORM para acesso ao banco
- **Neon Database**: Banco de dados PostgreSQL
- **Hugging Face API**: Serviço de IA (externa)

### 4.2 Riscos Identificados

#### Alto Impacto
- **API Hugging Face indisponível**: Impacta geração de conteúdo
  - *Mitigação*: Implementar fallback ou mensagem clara ao usuário
- **Incompatibilidade shadcn ui vue com Nuxt v4**: Pode requerer ajustes
  - *Mitigação*: Validar compatibilidade antes do desenvolvimento

#### Médio Impacto
- **Performance do rich text editor**: Pode impactar experiência em mobile
  - *Mitigação*: Testes de performance e otimizações
- **Limites de taxa da API Hugging Face**: Pode limitar uso intenso
  - *Mitigação*: Implementar rate limiting e feedback ao usuário

#### Baixo Impacto
- **Mudanças na estrutura do Neon Database**: Improvável, mas possível
  - *Mitigação*: Versionamento de schema via Prisma

## 5. Definições e Glossário

- **Marcador**: Categoria de nível superior para organização de conteúdo
- **Sub-marcador**: Categoria de segundo nível, pertence a um marcador
- **Nota**: Item de conteúdo individual, pertence a um sub-marcador
- **Rich Text**: Conteúdo formatado com suporte a formatação (negrito, itálico, listas, etc.)
- **Neon**: Serviço de banco de dados PostgreSQL serverless
- **Hugging Face**: Plataforma de modelos de IA para geração de conteúdo
