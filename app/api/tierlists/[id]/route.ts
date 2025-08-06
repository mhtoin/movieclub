import { removeRecommended, updateRecommended } from "@/lib/recommended"
import {
  getTierlist,
  rankMovie,
  updateTierMove,
  updateTierlist,
} from "@/lib/tierlists"
import { TierMovieWithMovieData } from "@/types/tierlist.type"
import { waitUntil } from "@vercel/functions"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params
  const tierlist = await getTierlist(params.id)

  return NextResponse.json(tierlist)
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params
  const {
    data,
  }: {
    data: {
      sourceData: TierMovieWithMovieData
      destinationData: TierMovieWithMovieData
      updatedSourceData: TierMovieWithMovieData
      sourceTierId: string
      destinationTierId: string
      items: TierMovieWithMovieData[]
    }
  } = await request.json()
  const {
    sourceData,
    updatedSourceData,
    sourceTierId,
    destinationTierId,
    items,
  } = data
  const operation = request.nextUrl.searchParams.get("operation")

  if (operation === "reorder") {
    try {
      if (items) {
        const res = await updateTierlist(params.id, items)
        return NextResponse.json({ ok: true, data: res })
      }
    } catch (e) {
      const error = e as Error
      console.error("error updating tierlist", error)
      return NextResponse.json({ ok: false, message: error }, { status: 500 })
    }
  }

  if (operation === "move") {
    try {
      if (
        sourceData &&
        updatedSourceData &&
        sourceTierId &&
        destinationTierId
      ) {
        console.log("Moving movie:", {
          movieId: sourceData.movieId,
          fromTier: sourceTierId,
          toTier: destinationTierId,
          fromPosition: sourceData.position,
          toPosition: updatedSourceData.position,
        })

        const res = await updateTierMove({
          sourceData,
          updatedSourceData,
          sourceTierId,
          destinationTierId,
        })

        if ((res.source === 1 || res.source === 2) && res.destination > 2) {
          // remove recommended for this movie for the user
          if (res.user) {
            waitUntil(removeRecommended(res.movie.id, res.user))
          }
        }

        if (res.destination <= 2 && res.source && res.source > 2) {
          // add recommended for this movie for the user
          if (res.user) {
            waitUntil(updateRecommended(res.movie, res.user))
          }
        }

        return NextResponse.json({ ok: true, data: res })
      } else {
        console.error("Missing required data for move operation:", {
          sourceData: !!sourceData,
          updatedSourceData: !!updatedSourceData,
          sourceTierId: !!sourceTierId,
          destinationTierId: !!destinationTierId,
        })
        return NextResponse.json(
          { ok: false, message: "Missing required data for move operation" },
          { status: 400 },
        )
      }
    } catch (e) {
      const error = e as Error
      console.error("error moving movie", error)
      return NextResponse.json({ ok: false, message: error }, { status: 500 })
    }
  }

  if (operation === "rank") {
    try {
      if (sourceData && destinationTierId) {
        console.log("Ranking movie:", {
          movieId: sourceData.movieId,
          sourceTierId,
          destinationTierId,
          position: sourceData.position,
        })

        const res = await rankMovie({
          sourceData,
          sourceTierId,
          destinationTierId,
        })

        if (
          res.tier?.tierlist.user &&
          (res.tier.value === 1 || res.tier.value === 2)
        ) {
          // update recommended for the user
          waitUntil(updateRecommended(res.movie, res.tier.tierlist.user))
        }
        return NextResponse.json({ ok: true, data: res })
      } else {
        console.error("Missing required data for rank operation:", {
          sourceData: !!sourceData,
          destinationTierId: !!destinationTierId,
        })
        return NextResponse.json(
          { ok: false, message: "Missing required data for rank operation" },
          { status: 400 },
        )
      }
    } catch (e) {
      const error = e as Error
      console.error("error ranking movie", error)
      return NextResponse.json({ ok: false, message: error }, { status: 500 })
    }
  }
}
