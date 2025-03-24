import { removeRecommended, updateRecommended } from "@/lib/recommended";
import {
	getTierlist,
	rankMovie,
	updateTierMove,
	updateTierlist,
} from "@/lib/tierlists";
import type { TierMovie } from "@prisma/client";
import { waitUntil } from "@vercel/functions";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	const tierlist = await getTierlist(params.id);
	return NextResponse.json(tierlist);
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const {
		data,
	}: {
		data: {
			sourceData: TierMovie;
			destinationData: TierMovie;
			updatedSourceData: TierMovie;
			sourceTierId: string;
			destinationTierId: string;
		};
	} = await request.json();
	const {
		sourceData,
		destinationData,
		updatedSourceData,
		sourceTierId,
		destinationTierId,
	} = data;
	const operation = request.nextUrl.searchParams.get("operation");

	if (operation === "reorder") {
		try {
			if (sourceData && destinationData) {
				const res = await updateTierlist(params.id, sourceData, destinationData);
				return NextResponse.json({ ok: true, data: res });
			}
		} catch (e) {
			const error = e as Error;
			console.error("error updating tierlist", error);
			return NextResponse.json({ ok: false, message: error }, { status: 500 });
		}
	}

	if (operation === "move") {
		try {
			if (sourceData && updatedSourceData && sourceTierId && destinationTierId) {
				const res = await updateTierMove({
					sourceData,
					updatedSourceData,
					sourceTierId,
					destinationTierId,
				});

				if ((res.source === 1 || res.source === 2) && res.destination > 2) {
					// remove recommended for this movie for the user
					if (res.user) {
						waitUntil(removeRecommended(res.movie.id, res.user));
					}
				}

				if (res.destination <= 2 && res.source && res.source > 2) {
					// add recommended for this movie for the user
					console.log("adding recommended for this movie for the user", res);
					if (res.user) {
						waitUntil(updateRecommended(res.movie, res.user));
					}
				}

				return NextResponse.json({ ok: true, data: res });
			}
		} catch (e) {
			const error = e as Error;
			console.error("error updating tierlist", error);
			return NextResponse.json({ ok: false, message: error }, { status: 500 });
		}
	}

	if (operation === "rank") {
		try {
			if (sourceData && destinationTierId) {
				const res = await rankMovie({
					sourceData,
					sourceTierId,
					destinationTierId,
				});

				if (
					res.tier?.tierlist.user &&
					(res.tier.value === 1 || res.tier.value === 2)
				) {
					// update recommended for the user
					waitUntil(updateRecommended(res.movie, res.tier.tierlist.user));
				}
				return NextResponse.json({ ok: true, data: res });
			}
		} catch (e) {
			const error = e as Error;
			console.error("error updating tierlist", error);
			return NextResponse.json({ ok: false, message: error }, { status: 500 });
		}
	}
}
