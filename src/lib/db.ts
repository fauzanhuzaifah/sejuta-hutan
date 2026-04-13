import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = new PrismaClient({
  log: ['query'],
})

// Only cache in production to avoid stale schema in development
if (process.env.NODE_ENV === 'production') {
  globalForPrisma.prisma = db
}