import { prisma } from '~~/server/utils/prisma'
import { handleApiError } from '~~/server/utils/errorHandler'
import { markerSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID is required' })
    const body = await readBody(event)
    const validatedData = markerSchema.parse(body)
    return await prisma.marker.update({ where: { id }, data: validatedData })
  } catch (error) {
    throw handleApiError(error)
  }
})
