import { prisma } from '~~/server/utils/prisma'
import { handleApiError } from '~~/server/utils/errorHandler'

export default defineEventHandler(async (event) => {
  try {
    const subMarkerId = getQuery(event).subMarkerId as string
    if (!subMarkerId) throw createError({ statusCode: 400, statusMessage: 'subMarkerId is required' })
    return await prisma.note.findMany({
      where: { subMarkerId },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    throw handleApiError(error)
  }
})
