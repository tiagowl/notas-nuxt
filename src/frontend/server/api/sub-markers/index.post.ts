import { prisma } from '~~/server/utils/prisma'
import { handleApiError } from '~~/server/utils/errorHandler'
import { subMarkerSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = subMarkerSchema.parse(body)
    return await prisma.subMarker.create({ data: validatedData })
  } catch (error) {
    throw handleApiError(error)
  }
})
