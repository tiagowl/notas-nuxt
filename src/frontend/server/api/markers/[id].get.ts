import { prisma } from '~~/server/utils/prisma'
import { handleApiError } from '~~/server/utils/errorHandler'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID is required' })
    const marker = await prisma.marker.findUnique({
      where: { id },
      include: {
        subMarkers: { include: { _count: { select: { notes: true } } } }
      }
    })
    if (!marker) throw createError({ statusCode: 404, statusMessage: 'Marker not found' })
    return marker
  } catch (error) {
    throw handleApiError(error)
  }
})
