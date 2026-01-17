import { prisma } from '~~/server/utils/prisma'
import { handleApiError } from '~~/server/utils/errorHandler'

export default defineEventHandler(async (event) => {
  try {
    const markerId = getQuery(event).markerId as string
    if (!markerId) throw createError({ statusCode: 400, statusMessage: 'markerId is required' })
    return await prisma.subMarker.findMany({
      where: { markerId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { notes: true } } }
    })
  } catch (error) {
    throw handleApiError(error)
  }
})
