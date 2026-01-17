import { prisma } from '~~/server/utils/prisma'
import { handleApiError } from '~~/server/utils/errorHandler'
import { markerSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = markerSchema.parse(body)
    return await prisma.marker.create({ data: validatedData })
  } catch (error) {
    throw handleApiError(error)
  }
})
