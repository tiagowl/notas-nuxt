import { z } from 'zod'

export const markerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo')
})

export const subMarkerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  markerId: z.string().min(1, 'Marcador é obrigatório')
})

export const noteSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(255, 'Título muito longo'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  subMarkerId: z.string().min(1, 'Sub-marcador é obrigatório')
})

export const aiGenerateSchema = z.object({
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').max(500, 'Descrição muito longa')
})
