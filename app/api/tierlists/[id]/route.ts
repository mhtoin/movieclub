import { NextRequest, NextResponse } from "next/server";
import { addMovieToShortlist, getShortList, removeMovieFromShortlist } from "@/lib/shortlist";
import { getServerSession } from "@/lib/getServerSession";
import { revalidatePath } from "next/cache";
import { updateTierlist } from "@/lib/tierlists";
import { TierlistsTier } from "@prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  let tierlist: Tierlist = await request.json()
    
  const tiers = tierlist.tiers.map((tier) => {
        const movieIds = tier.movies.map(movie => movie.id)

        return {
            ...tier,
            movies: movieIds
        }
    }) as Array<TierlistsTier>
  //console.log('updating', tiers, params.id)
  try {
    let res = await updateTierlist(params.id, tiers)
    return NextResponse.json({ ok: true })
  } catch (e) {
    let error = e as Error
    return NextResponse.json({ok: false, message: error}, { status: 500})
  }
}
