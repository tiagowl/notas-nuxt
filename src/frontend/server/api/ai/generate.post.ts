import { handleApiError } from '~~/server/utils/errorHandler'
import { aiGenerateSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const apiKey = config.huggingFaceApiKey
    if (!apiKey) throw createError({ statusCode: 500, statusMessage: 'Hugging Face API key not configured' })

    const body = await readBody(event)
    const validatedData = aiGenerateSchema.parse(body)

    const modelName = 'gpt2'
    const apiUrl = `https://api-inference.huggingface.co/models/${modelName}`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: validatedData.description,
        parameters: { max_new_tokens: 500, temperature: 0.7 }
      }),
      signal: AbortSignal.timeout(30000)
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw createError({
        statusCode: response.status,
        statusMessage: `Hugging Face API error: ${response.statusText}`,
        data: errorData
      })
    }

    const data = await response.json()
    let generatedContent = ''
    if (Array.isArray(data) && data.length > 0) {
      generatedContent = data[0].generated_text || data[0].text || JSON.stringify(data)
    } else if (data.generated_text) {
      generatedContent = data.generated_text
    } else if (data.text) {
      generatedContent = data.text
    } else {
      generatedContent = JSON.stringify(data)
    }

    if (generatedContent.includes(validatedData.description)) {
      generatedContent = generatedContent.replace(validatedData.description, '').trim()
    }

    return { content: generatedContent || validatedData.description }
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw createError({ statusCode: 504, statusMessage: 'AI generation timeout - the request took too long' })
    }
    throw handleApiError(error)
  }
})
