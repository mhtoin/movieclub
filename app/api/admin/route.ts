import { NextResponse } from "next/server";
import { connectChosenMovies } from "@/lib/movies/movies";

export async function PUT(request: Request) {
  const data = await request.json();
  const movies = await connectChosenMovies(data);

  return NextResponse.json(movies);
}
