/*
import prisma from '../lib/prisma'

async function main() {
  const tierlists = await prisma.tierlist.findMany()

  for (const tierlist of tierlists) {
    await prisma.user.update({
      where: {
        id: tierlist.userId,
      },
      data: {
        tierlistId: tierlist.id,
      },
    })
  }
}

main()
*/
