import type { H3Error } from 'h3'

export const handleApiError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'statusMessage' in error) {
    const h3Error = error as H3Error
    return h3Error.statusMessage || 'Erro desconhecido'
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'Erro desconhecido'
}
