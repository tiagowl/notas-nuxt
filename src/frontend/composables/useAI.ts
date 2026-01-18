import type { AIGenerateRequest, AIGenerateResponse } from '~/types'

export const useAI = () => {
  const isGenerating = ref(false)
  const error = ref<string | null>(null)

  const generateContent = async (request: AIGenerateRequest): Promise<string> => {
    try {
      isGenerating.value = true
      error.value = null
      
      const response = await $fetch<AIGenerateResponse>('/api/ai/generate', {
        method: 'POST',
        body: request,
        timeout: 30000 // 30 seconds timeout
      })
      
      return response.content
    } catch (err: unknown) {
      let errorMessage = 'Erro ao gerar conteúdo'
      
      if (err && typeof err === 'object') {
        const e = err as { 
          data?: { detail?: string | object }; 
          statusMessage?: string; 
          message?: string;
          statusCode?: number;
        }
        
        // Extrair mensagem de diferentes locais possíveis
        if (e.statusMessage) {
          errorMessage = e.statusMessage
        } else if (e.message) {
          errorMessage = e.message
        } else if (e.data) {
          // Se data.detail for objeto, converter para string
          if (e.data.detail) {
            errorMessage = typeof e.data.detail === 'string' 
              ? e.data.detail 
              : JSON.stringify(e.data.detail)
          }
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      // Garantir que nunca seja [object Object]
      if (errorMessage === '[object Object]' || !errorMessage || errorMessage.trim() === '') {
        errorMessage = 'Erro desconhecido ao gerar conteúdo. Verifique a configuração da API.'
      }
      
      error.value = errorMessage
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  return {
    isGenerating: readonly(isGenerating),
    error: readonly(error),
    generateContent
  }
}
