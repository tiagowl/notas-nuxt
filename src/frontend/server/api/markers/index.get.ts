import { prisma } from '~~/server/utils/prisma'
import { handleApiError } from '~~/server/utils/errorHandler'

export default defineEventHandler(async () => {
  try {
    const markers = await prisma.marker.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        subMarkers: {
          include: {
            _count: { select: { notes: true } }
          }
        }
      }
    })
    return markers.map(marker => ({
      ...marker,
      subMarkers: undefined,
      _count: {
        subMarkers: marker.subMarkers.length,
        notes: marker.subMarkers.reduce((acc, sm) => acc + (sm._count?.notes || 0), 0)
      }
    }))
  } catch (error) {
    throw handleApiError(error)
  }
})
