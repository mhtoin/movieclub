import prisma from "./prisma";

export async function updateUser(user: User, id: string) {
  let res = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      sessionId: user.sessionId,
      accountId: user.accountId,
    },
  });

  return res;
}

export async function updateUserImage(id: string, url: string) {
  let res = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      image: url,
    },
  });

  return res;
}

export async function getUsers() {
  return await prisma.user.findMany();
}
