import prisma from "../lib/prisma";

async function main() {
	const tierlists = await prisma.tierlists.findMany();

	console.log(`Found ${tierlists.length} tierlists`);
	console.log(tierlists);

	for (const tierlist of tierlists) {
		await prisma.user.update({
			where: {
				id: tierlist.userId,
			},
			data: {
				tierlistId: tierlist.id,
			},
		});
	}
}

main();
