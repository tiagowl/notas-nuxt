# Instruções de Setup - Sistema de Gerenciamento de Notas

## ✅ Checklist de Instalação

### 1. Pré-requisitos Instalados
- [ ] Node.js v18.x ou superior
- [ ] npm v9.x ou superior (ou yarn/pnpm)
- [ ] Git instalado
- [ ] Editor de código (VS Code recomendado)

### 2. Configuração do Projeto
- [ ] Repositório clonado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` criado a partir de `.env.example`
- [ ] Variáveis de ambiente configuradas

### 3. Banco de Dados
- [ ] Conta Neon criada
- [ ] Database criado no Neon
- [ ] `DATABASE_URL` configurado no `.env`
- [ ] Prisma Client gerado (`npx prisma generate`)
- [ ] Migrations rodadas (`npx prisma migrate dev`)

### 4. API de IA
- [ ] Conta Hugging Face criada
- [ ] API Key obtida
- [ ] `HUGGING_FACE_API_KEY` configurado no `.env`

### 5. Teste Local
- [ ] Servidor de desenvolvimento iniciado (`npm run dev`)
- [ ] Aplicação acessível em `http://localhost:3000`
- [ ] Criar primeiro marcador funcionando
- [ ] Criar primeiro sub-marcador funcionando
- [ ] Criar primeira nota funcionando

## 🐛 Troubleshooting

### Erro: Cannot find module '@prisma/client'
**Solução**: Execute `npx prisma generate`

### Erro: Database connection failed
**Solução**: 
1. Verifique a `DATABASE_URL` no `.env`
2. Certifique-se que o banco Neon está acessível
3. Verifique o SSL mode (use `?sslmode=require`)

### Erro: Module not found '~/...'
**Solução**: 
1. Reinicie o servidor de desenvolvimento
2. Execute `npm install` novamente
3. Limpe o cache: `rm -rf .nuxt node_modules/.cache`

### Erro: TypeScript errors
**Solução**:
1. Execute `npx prisma generate`
2. Reinicie o TypeScript server no VS Code (Cmd+Shift+P > "TypeScript: Restart TS Server")

### Erro: API Hugging Face timeout
**Solução**:
- Verifique se a API key está correta
- Verifique sua conexão com internet
- Tente novamente (pode ser instabilidade temporária da API)

## 📚 Próximos Passos

1. Explore a aplicação criando marcadores, sub-marcadores e notas
2. Teste a funcionalidade de geração com IA
3. Teste em dispositivos móveis (responsividade)
4. Consulte a documentação em `outputs/` para entender melhor o sistema

## 🔗 Links Úteis

- [Documentação Nuxt 4](https://nuxt.com/)
- [Documentação Prisma](https://www.prisma.io/docs/)
- [Documentação TipTap](https://tiptap.dev/)
- [Hugging Face API](https://huggingface.co/docs/api-inference/index)
