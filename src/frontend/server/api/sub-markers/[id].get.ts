import { prisma } from '~~/server/utils/prisma'
import { handleApiError } from '~~/server/utils/errorHandler'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID is required' })
    const subMarker = await prisma.subMarker.findUnique({
      where: { id },
      include: { marker: true, _count: { select: { notes: true } } }
    })
    if (!subMarker) throw createError({ statusCode: 404, statusMessage: 'SubMarker not found' })
    return subMarker
  } catch (error) {
    throw handleApiError(error)
  }
})
