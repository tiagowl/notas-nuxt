import { prisma } from '~~/server/utils/prisma'
import { handleApiError } from '~~/server/utils/errorHandler'
import { noteSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = noteSchema.parse(body)
    return await prisma.note.create({ data: validatedData })
  } catch (error) {
    throw handleApiError(error)
  }
})
