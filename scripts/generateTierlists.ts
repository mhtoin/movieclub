import prisma from "../lib/prisma";
async function generateTierlists() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    await prisma.tierlists.create({
      data: {
        userId: user.id,
        tiers: [],
      },
    });
  }
}

generateTierlists();
