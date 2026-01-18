export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

export const formatDateShort = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d)
}

/**
 * Escapa caracteres HTML especiais
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Processa Markdown inline (negrito, itálico)
 */
function processInlineMarkdown(text: string): string {
  // Escapar HTML primeiro
  let html = escapeHtml(text)
  
  // Negrito (**texto** ou __texto__) - processar antes de itálico
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  
  // Itálico (*texto* ou _texto_) - mas não se já foi processado como negrito
  // Usar lookahead/lookbehind para não conflitar com negrito
  html = html.replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
  html = html.replace(/(?<!_)_(?!_)([^_]+?)(?<!_)_(?!_)/g, '<em>$1</em>')
  
  return html
}

/**
 * Converte Markdown ou texto plano em HTML adequado para o TipTap editor
 * Suporta títulos, negrito, itálico, listas e parágrafos
 */
export const formatTextToHtml = (text: string): string => {
  if (!text || !text.trim()) {
    return '<p></p>'
  }

  // Se já é HTML válido completo (contém tags de fechamento), retorna como está
  const htmlRegex = /<\/?[a-z][\s\S]*>/i
  if (htmlRegex.test(text) && text.includes('</') && !text.match(/^#+\s/m)) {
    return text
  }

  // Processar linha por linha para manter estrutura
  const lines = text.split(/\n/)
  const processedBlocks: string[] = []
  let currentList: string[] = []
  let inList = false
  let listType: 'ul' | 'ol' | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (!line) {
      // Linha vazia: fechar lista se estiver aberta
      if (inList && currentList.length > 0) {
        const tag = listType === 'ol' ? 'ol' : 'ul'
        processedBlocks.push(`<${tag}>${currentList.join('')}</${tag}>`)
        currentList = []
        inList = false
        listType = null
      }
      continue
    }

    // Títulos H3 (###)
    if (line.startsWith('### ')) {
      if (inList) {
        const tag = listType === 'ol' ? 'ol' : 'ul'
        processedBlocks.push(`<${tag}>${currentList.join('')}</${tag}>`)
        currentList = []
        inList = false
        listType = null
      }
      const title = processInlineMarkdown(line.substring(4).trim())
      processedBlocks.push(`<h3>${title}</h3>`)
      continue
    }
    
    // Títulos H2 (##)
    if (line.startsWith('## ')) {
      if (inList) {
        const tag = listType === 'ol' ? 'ol' : 'ul'
        processedBlocks.push(`<${tag}>${currentList.join('')}</${tag}>`)
        currentList = []
        inList = false
        listType = null
      }
      const title = processInlineMarkdown(line.substring(3).trim())
      processedBlocks.push(`<h2>${title}</h2>`)
      continue
    }
    
    // Títulos H1 (#)
    if (line.startsWith('# ')) {
      if (inList) {
        const tag = listType === 'ol' ? 'ol' : 'ul'
        processedBlocks.push(`<${tag}>${currentList.join('')}</${tag}>`)
        currentList = []
        inList = false
        listType = null
      }
      const title = processInlineMarkdown(line.substring(2).trim())
      processedBlocks.push(`<h1>${title}</h1>`)
      continue
    }

    // Listas ordenadas (1. item)
    const orderedMatch = line.match(/^(\d+)\.\s+(.+)$/)
    if (orderedMatch) {
      if (!inList || listType !== 'ol') {
        if (inList && currentList.length > 0) {
          const tag = listType === 'ol' ? 'ol' : 'ul'
          processedBlocks.push(`<${tag}>${currentList.join('')}</${tag}>`)
          currentList = []
        }
        inList = true
        listType = 'ol'
      }
      const itemText = processInlineMarkdown(orderedMatch[2])
      currentList.push(`<li>${itemText}</li>`)
      continue
    }

    // Listas não ordenadas (- item ou * item)
    const unorderedMatch = line.match(/^[-*]\s+(.+)$/)
    if (unorderedMatch) {
      if (!inList || listType !== 'ul') {
        if (inList && currentList.length > 0) {
          const tag = listType === 'ol' ? 'ol' : 'ul'
          processedBlocks.push(`<${tag}>${currentList.join('')}</${tag}>`)
          currentList = []
        }
        inList = true
        listType = 'ul'
      }
      const itemText = processInlineMarkdown(unorderedMatch[1])
      currentList.push(`<li>${itemText}</li>`)
      continue
    }

    // Parágrafo normal
    if (inList && currentList.length > 0) {
      const tag = listType === 'ol' ? 'ol' : 'ul'
      processedBlocks.push(`<${tag}>${currentList.join('')}</${tag}>`)
      currentList = []
      inList = false
      listType = null
    }

    const processedLine = processInlineMarkdown(line)
    processedBlocks.push(`<p>${processedLine}</p>`)
  }

  // Fechar lista se ainda estiver aberta
  if (inList && currentList.length > 0) {
    const tag = listType === 'ol' ? 'ol' : 'ul'
    processedBlocks.push(`<${tag}>${currentList.join('')}</${tag}>`)
  }

  return processedBlocks.length > 0 ? processedBlocks.join('') : '<p></p>'
}
