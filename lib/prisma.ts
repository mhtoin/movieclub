/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-namespace */
import { neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"

import ws from "ws"
neonConfig.webSocketConstructor = ws
neonConfig.poolQueryViaFetch = true

declare global {
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient
    }
  }
  var prisma: PrismaClient | undefined
}

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaNeon({ connectionString })
const client = global.prisma || new PrismaClient({ adapter })
if (process.env.NODE_ENV !== "production") globalThis.prisma = client

export default client
