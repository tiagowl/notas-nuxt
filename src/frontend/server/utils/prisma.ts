import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare global {
  var __prisma: PrismaClient | undefined
}

if (import.meta.server) {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    })
  }
  prisma = global.__prisma
}

export { prisma }
