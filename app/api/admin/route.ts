import { NextRequest, NextResponse } from "next/server";
import {
  addMovieToShortlist,
  getShortList,
  removeMovieFromShortlist,
} from "@/lib/shortlist";
import { getServerSession } from "@/lib/getServerSession";
import { revalidatePath } from "next/cache";
import { updateTierlist } from "@/lib/tierlists";
import { TierlistsTier } from "@prisma/client";
import { connectChosenMovies } from "@/lib/movies";

export async function PUT(request: Request) {
  const data = await request.json();
  const movies = await connectChosenMovies(data);

  return NextResponse.json(movies);
}
