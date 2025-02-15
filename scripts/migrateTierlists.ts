// migration-script.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateTierlists() {
	// 1. Get all existing tierlists
	const existingTierlists = await prisma.tierlists.findMany({
		include: {
			tierlistTiers: {
				include: {
					movies: true,
				},
			},
		},
	});
	console.dir(existingTierlists, { depth: null });
	/*
	for (const tierlist of existingTierlists) {
		console.dir(tierlist, { depth: null });
		const tierIds = [];

		for (const tier of tierlist.tiers) {
			console.dir(tier, { depth: null });
			const newTier = await prisma.tier.create({
				data: {
					label: tier.label,
					value: tier.value,
					tierlist: {
						connect: { id: tierlist.id },
					},
					movies: {
						connect: tier.movies.map((movie) => ({ id: movie })),
					},
				},
			});
			tierIds.push(newTier.id);
		}
	}*/
	/*
	for (const tierlist of existingTierlists) {
		// 2. For each tierlist, create new Tier records
		// Assuming your old structure had tiers as an object/array directly in Tierlists
		if (tierlist.tiers) {
			// Create new Tier records
			await Promise.all(
				Object.entries(tierlist.tiers).map(([label, value]) => {
					return prisma.tier.create({
						data: {
							label,
							value: typeof value === "number" ? value : Number.parseInt(value),
							movieIds: [], // Initialize with empty array or existing movie IDs if you had them
							tierlistId: tierlist.id,
						},
					});
				}),
			);
		}
	}*/
}

async function main() {
	try {
		await migrateTierlists();
		console.log("Migration completed successfully");
	} catch (error) {
		console.error("Migration failed:", error);
	} finally {
		await prisma.$disconnect();
	}
}

main();
