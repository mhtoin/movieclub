import prisma from './prisma'

export async function getSiteConfig() {
  const siteConfig = await prisma.siteConfig.findUnique({
    where: {
      id: process.env.SITE_CONFIG_ID,
    },
  })

  return siteConfig
}
