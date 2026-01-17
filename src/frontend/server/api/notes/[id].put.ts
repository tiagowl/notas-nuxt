import { prisma } from '~~/server/utils/prisma'
import { handleApiError } from '~~/server/utils/errorHandler'
import { noteSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID is required' })
    const body = await readBody(event)
    const { subMarkerId, ...rest } = body
    const validatedData = noteSchema.omit({ subMarkerId: true }).parse(rest)
    return await prisma.note.update({ where: { id }, data: validatedData })
  } catch (error) {
    throw handleApiError(error)
  }
})
