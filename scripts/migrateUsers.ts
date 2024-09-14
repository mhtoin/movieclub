import prisma from "../lib/prisma";

async function migrateUsers() {
  const users = await prisma.user.findMany();
  const shortlists = await prisma.shortlist.findMany();

  console.log(users);

  for (const shortlist of shortlists) {
    let updated = await prisma.user.update({
      where: { id: shortlist.userId },
      data: {
        shortlistId: shortlist.id,
        shortlist: {
          connect: {
            id: shortlist.id,
          },
        },
      },
    });
  }
  //console.log(users);
  //console.log(shortlists);
}

migrateUsers();
