import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const siteConfig = await prisma.siteConfig.findUnique({
    where: {
      id: process.env.SITE_CONFIG_ID,
    },
  })

  return NextResponse.json(siteConfig)
}
