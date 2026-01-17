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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar conteúdo'
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
