import prisma from "./prisma";


export async function updateUser(user: User, id: string) {
    let res = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            sessionId: user.sessionId,
            accountId: user.accountId
        }
    })

    return res
}