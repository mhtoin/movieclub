import { getTierlist, updateTierlist } from "@/lib/tierlists";
import type { TierlistWithTiers } from "@/types/tierlist.type";
import { NextResponse } from "next/server";

export async function GET(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	const tierlist = await getTierlist(params.id);
	return NextResponse.json(tierlist);
}

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const tierlist: TierlistWithTiers = await request.json();
	console.log("received tierlist", tierlist);

	try {
		const res = await updateTierlist(params.id, tierlist);
		console.log("updated tierlist", res);
		return NextResponse.json({ ok: true, data: res });
	} catch (e) {
		const error = e as Error;
		console.error("error updating tierlist", error);
		return NextResponse.json({ ok: false, message: error }, { status: 500 });
	}
}
