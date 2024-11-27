import { NextResponse } from "next/server";
import { getTierlist, updateTierlist } from "@/lib/tierlists";
import { TierlistsTier } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tierlist = await getTierlist(params.id);
  return NextResponse.json(tierlist);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  let tierlist: Tierlist = await request.json();

  const tiers = tierlist.tiers.map((tier) => {
    const movieIds = tier.movies.map((movie) => movie.id);

    return {
      ...tier,
      movies: movieIds,
    };
  }) as Array<TierlistsTier>;
  try {
    let res = await updateTierlist(params.id, tiers);
    return NextResponse.json({ ok: true, data: res });
  } catch (e) {
    let error = e as Error;
    return NextResponse.json({ ok: false, message: error }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    let res = await updateTierlist(params.id, []);
    return NextResponse.json({ ok: true });
  } catch (e) {
    let error = e as Error;
    return NextResponse.json({ ok: false, message: error }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const tierlist = await getTierlist(params.id);
  const tierlistTiers = tierlist.tiers;
  tierlistTiers.push({
    label: body.tierName,
    value: tierlistTiers.length + 1,
    movies: [],
  });

  const formattedTiers = tierlistTiers.map((tier) => ({
    ...tier,
    movies: tier.movies.map((movie) => movie.id),
  }));

  await prisma.tierlists.update({
    where: {
      id: params.id,
    },
    data: {
      tiers: formattedTiers as Array<TierlistsTier>,
    },
  });

  return NextResponse.json({ ok: true });
}
