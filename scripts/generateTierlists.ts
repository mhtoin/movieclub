import prisma from "../lib/prisma";
async function generateTierlists() {
	await prisma.tier.deleteMany();
}

generateTierlists();
