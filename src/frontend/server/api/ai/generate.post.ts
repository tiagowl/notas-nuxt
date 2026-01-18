import { handleApiError } from '~~/server/utils/errorHandler'
import { aiGenerateSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const apiKey = config.huggingFaceApiKey
    if (!apiKey || apiKey.trim() === '') {
      throw createError({
        statusCode: 503,
        statusMessage: 'Serviço de IA não configurado. Defina HUGGING_FACE_API_KEY no .env'
      })
    }

    const body = await readBody(event)
    const validatedData = aiGenerateSchema.parse(body)

    const modelId = config.huggingFaceModel || 'mistralai/Mistral-7B-Instruct-v0.2'
    
    // Formatar prompt - usar diretamente a descrição do usuário como instrução principal
    // Para modelos instruct/chat, a descrição já contém as instruções completas
    const userInstruction = validatedData.description.trim()

    // Detectar se o modelo provavelmente suporta chat (por nome)
    const isChatModel = modelId.toLowerCase().includes('instruct') || 
                       modelId.toLowerCase().includes('chat') ||
                       modelId.toLowerCase().includes('llama') ||
                       modelId.toLowerCase().includes('mistral')

    let apiUrl: string
    let requestBody: string
    let usingChatFormat = false

    if (isChatModel) {
      // Tentar chat completions primeiro para modelos instruction
      // Usar formato de mensagens com system prompt para melhor controle
      apiUrl = 'https://router.huggingface.co/v1/chat/completions'
      requestBody = JSON.stringify({
        model: modelId,
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente de escrita útil e preciso. Gere conteúdo formatado em Markdown conforme as instruções fornecidas pelo usuário. Use formatação Markdown: # para títulos principais, ## para subtítulos, **negrito**, *itálico*, listas com - ou 1., e parágrafos separados por linha em branco. Siga exatamente o que foi solicitado.'
          },
          {
            role: 'user',
            content: `${userInstruction}\n\nGere o conteúdo formatado em Markdown, usando títulos, parágrafos e listas quando apropriado.`
          }
        ],
        max_tokens: 2000, // Aumentado para permitir textos mais longos
        temperature: 0.7, // Reduzido para ser mais determinístico e seguir melhor as instruções
        top_p: 0.95
      })
      usingChatFormat = true
    } else {
      // Para modelos não-chat, formatar prompt instrucional com instrução de formatação
      const prompt = `Instrução: ${userInstruction}

Formato: Gere o conteúdo em Markdown com formatação adequada (títulos com #, **negrito**, listas com -, parágrafos separados).

Responda seguindo exatamente as instruções acima, formatado em Markdown.`
      apiUrl = `https://router.huggingface.co/hf-inference/models/${modelId}`
      requestBody = JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 2000, // Aumentado para permitir textos mais longos
          temperature: 0.7, // Reduzido para seguir melhor instruções
          top_p: 0.95,
          repetition_penalty: 1.2,
          do_sample: true
        }
      })
      usingChatFormat = false
    }

    let response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: requestBody,
      signal: AbortSignal.timeout(30000)
    })
    
    // Se der erro 400 ao usar chat, tentar formato text generation
    if (response.status === 400 && usingChatFormat) {
      // Fallback: usar formato instrucional para text generation com instrução de formatação
      const fallbackPrompt = `Instrução: ${userInstruction}

Formato: Gere o conteúdo em Markdown com formatação adequada (títulos com #, **negrito**, listas com -, parágrafos separados).

Responda seguindo exatamente as instruções acima, formatado em Markdown.`
      apiUrl = `https://router.huggingface.co/hf-inference/models/${modelId}`
      requestBody = JSON.stringify({
        inputs: fallbackPrompt,
        parameters: {
          max_new_tokens: 2000, // Aumentado para permitir textos mais longos
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.2,
          do_sample: true
        }
      })
      
      usingChatFormat = false
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: requestBody,
        signal: AbortSignal.timeout(30000)
      })
    }

    const responseText = await response.text()

    if (!response.ok) {
      let errorDetail = responseText
      let errorMessage = ''
      
      try {
        const parsed = JSON.parse(responseText)
        
        // Extrair mensagem de erro de diferentes formatos possíveis
        if (typeof parsed === 'string') {
          errorMessage = parsed
        } else if (parsed.error) {
          // Pode ser string ou objeto
          errorMessage = typeof parsed.error === 'string' ? parsed.error : (parsed.error.message || JSON.stringify(parsed.error))
        } else if (parsed.message) {
          errorMessage = typeof parsed.message === 'string' ? parsed.message : JSON.stringify(parsed.message)
        } else if (parsed.detail) {
          errorMessage = typeof parsed.detail === 'string' ? parsed.detail : JSON.stringify(parsed.detail)
        } else {
          errorMessage = JSON.stringify(parsed)
        }
        
        errorDetail = errorMessage || responseText
      } catch { 
        // Se não conseguir parsear, usar o texto direto
        errorDetail = responseText || 'Erro desconhecido'
      }
      
      // Mensagens mais úteis para erros comuns
      if (response.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: `Modelo "${modelId}" não encontrado ou não está disponível via Inference Providers do Hugging Face. Alguns modelos não estão implantados para inferência pública. Tente usar modelos que estão disponíveis, como: 'mistralai/Mistral-7B-Instruct-v0.2', 'meta-llama/Llama-3.1-8B-Instruct', ou verifique na página do modelo no Hugging Face Hub se ele está marcado como "Deployed by Inference Provider".`,
          data: { detail: errorDetail, modelId }
        })
      }
      
      if (response.status === 400) {
        throw createError({
          statusCode: 400,
          statusMessage: `Erro na requisição para a API Hugging Face: ${errorDetail}. Verifique se o modelo "${modelId}" suporta o formato chat completions.`,
          data: { detail: errorDetail, modelId }
        })
      }
      
      if (response.status === 401 || response.status === 403) {
        throw createError({
          statusCode: response.status,
          statusMessage: `Erro de autenticação na API Hugging Face. Verifique se HUGGING_FACE_API_KEY está configurado corretamente e se o token tem permissões de "Make calls to Inference Providers".`,
          data: { detail: errorDetail }
        })
      }
      
      throw createError({
        statusCode: response.status >= 400 && response.status < 600 ? response.status : 502,
        statusMessage: `Erro na API Hugging Face (${response.status}): ${errorDetail}`,
        data: { detail: errorDetail }
      })
    }

    let data: unknown
    try {
      data = responseText ? JSON.parse(responseText) : null
    } catch {
      throw createError({
        statusCode: 502,
        statusMessage: 'Resposta inválida da API de IA'
      })
    }

    // Verificar se a API retornou um objeto de erro mesmo com status 200
    if (data && typeof data === 'object' && 'error' in data && typeof (data as { error?: string }).error === 'string') {
      throw createError({
        statusCode: 503,
        statusMessage: (data as { error: string }).error
      })
    }

    let generatedContent = ''
    
    // Extrair conteúdo do formato OpenAI-compatible (chat completions)
    if (data && typeof data === 'object') {
      const d = data as { 
        choices?: Array<{ 
          message?: { content?: string; role?: string }; 
          text?: string;
          delta?: { content?: string };
          finish_reason?: string;
        }>; 
        content?: string; 
        text?: string;
        generated_text?: string;
      }
      
      // Formato OpenAI chat completions
      if (d.choices && Array.isArray(d.choices) && d.choices.length > 0) {
        // Concatenar todas as choices para garantir que pegamos todo o conteúdo
        const contents: string[] = []
        for (const choice of d.choices) {
          if (choice.message?.content) {
            contents.push(choice.message.content)
          } else if (choice.text) {
            contents.push(choice.text)
          } else if (choice.delta?.content) {
            // Se for streaming, concatenar deltas
            contents.push(choice.delta.content)
          }
        }
        if (contents.length > 0) {
          generatedContent = contents.join('')
        }
      }
      
      // Fallback para outros formatos possíveis
      if (!generatedContent) {
        generatedContent = d.content || d.text || d.generated_text || ''
      }
      
      // Se ainda não encontrou, tentar encontrar qualquer campo string que pareça ser conteúdo
      if (!generatedContent) {
        for (const [key, value] of Object.entries(d)) {
          if (typeof value === 'string' && value.length > 10 && !key.includes('error') && !key.includes('id')) {
            generatedContent = value
            break
          }
        }
      }
    } else if (Array.isArray(data) && data.length > 0) {
      // Formato array (legado) - concatenar todos os itens
      const contents: string[] = []
      for (const item of data) {
        if (item && typeof item === 'object') {
          const content = (item as { generated_text?: string; text?: string; content?: string }).generated_text
            || (item as { generated_text?: string; text?: string; content?: string }).text
            || (item as { generated_text?: string; text?: string; content?: string }).content
          if (content) {
            contents.push(content)
          }
        } else if (typeof item === 'string') {
          contents.push(item)
        }
      }
      if (contents.length > 0) {
        generatedContent = contents.join('\n')
      }
    } else if (typeof data === 'string') {
      generatedContent = data
    } else {
      generatedContent = String(data ?? '')
    }

    // Limpar apenas instruções/prompts que aparecem no INÍCIO do texto (não em qualquer lugar)
    // Isso evita remover conteúdo útil que possa conter palavras similares
    
    // Verificar se o texto começa com prefixo de instrução
    const instructionPrefix = `Instrução: ${userInstruction}`
    if (generatedContent.startsWith(instructionPrefix)) {
      generatedContent = generatedContent.substring(instructionPrefix.length)
      // Remover texto de instrução que pode seguir ("Responda seguindo...")
      generatedContent = generatedContent.replace(/^\s*Responda seguindo.*?\n\n/ims, '').trim()
    }
    
    // Remover apenas se a descrição estiver literalmente no início (não usar includes)
    if (generatedContent.startsWith(userInstruction)) {
      generatedContent = generatedContent.substring(userInstruction.length).trim()
    }
    
    // Limpar apenas prefixos muito específicos no INÍCIO do texto
    generatedContent = generatedContent
      .replace(/^Texto:\s*/i, '')
      .replace(/^Conteúdo:\s*/i, '')
      .replace(/^Resumo:\s*/i, '')
      .replace(/^Markdown:\s*/i, '')
      .trim()
    
    // Garantir que o conteúdo não foi truncado acidentalmente
    // Se ainda estiver vazio após limpeza, preservar o original
    if (!generatedContent || generatedContent.trim() === '') {
      // Se a limpeza removeu tudo, usar o conteúdo original (pode ser que o modelo incluiu instruções no meio)
      generatedContent = String(data && typeof data === 'object' 
        ? (data as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]?.message?.content 
          || (data as { generated_text?: string; text?: string; content?: string }).generated_text
          || (data as { generated_text?: string; text?: string; content?: string }).text
          || (data as { generated_text?: string; text?: string; content?: string }).content
          : '')
    }

    // Se não gerou conteúdo válido, retornar mensagem de erro
    if (!generatedContent || generatedContent.trim() === '' || generatedContent.startsWith('{')) {
      throw createError({
        statusCode: 502,
        statusMessage: 'A API não retornou conteúdo válido. Tente novamente com uma descrição mais específica.'
      })
    }

    return { content: generatedContent }
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw createError({ statusCode: 504, statusMessage: 'Tempo esgotado. Tente novamente.' })
    }
    throw handleApiError(error)
  }
})
