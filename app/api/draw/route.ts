// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { simulateRaffle } from "@/lib/movies";


export async function POST(request: NextRequest, response: NextResponse) {
  try {
    // get all shortlists and check that everyone is ready
    const body = await request.json()
    const repetitions = body.repetitions ? body.repetitions : 1
    const movies = await simulateRaffle(repetitions)

    //console.log('movies', movies)
    return NextResponse.json({ ok: true, data: movies }, { status: 200 });
  } catch (e) {
    console.error("error", e);
    if (e instanceof Error) {
      return NextResponse.json({ ok: false, message: e.message}, { status: 401 });
    } else {
      return NextResponse.json({ ok: false, message: 'Something went wrong!' }, { status: 500 });
    }
  }
}
