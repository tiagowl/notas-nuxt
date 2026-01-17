import { prisma } from '~~/server/utils/prisma'
import { handleApiError } from '~~/server/utils/errorHandler'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID is required' })
    const note = await prisma.note.findUnique({
      where: { id },
      include: { subMarker: { include: { marker: true } } }
    })
    if (!note) throw createError({ statusCode: 404, statusMessage: 'Note not found' })
    return note
  } catch (error) {
    throw handleApiError(error)
  }
})
