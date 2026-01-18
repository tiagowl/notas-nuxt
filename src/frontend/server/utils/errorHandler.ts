import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const handleApiError = (error: unknown) => {
  // Re-throw H3/Nitro createError para preservar status e mensagem
  if (error && typeof error === 'object' && 'statusCode' in error && typeof (error as { statusCode?: number }).statusCode === 'number') {
    throw error
  }

  // Zod validation error
  if (error instanceof z.ZodError) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: error.errors
    })
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Record already exists'
      })
    }
    
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Record not found'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Database Error',
      data: { code: error.code }
    })
  }

  // Generic error
  if (error instanceof Error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error'
    })
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error'
  })
}
