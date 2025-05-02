import prisma from '@/lib/prisma'

export async function pruneRecommended() {
  await prisma.recommendedMovie.deleteMany()
}

pruneRecommended()
