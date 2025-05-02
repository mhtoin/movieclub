/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-namespace */
import { PrismaClient } from '@prisma/client'

declare global {
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient
    }
  }
  var prisma: PrismaClient | undefined
}

const client = global.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client

export default client
