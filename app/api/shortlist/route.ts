import clientPromise from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAllShortLists } from "@/lib/shortlist";

export async function GET(
  request: NextRequest,
) {
  try {
    console.log('getting shortlists')
    const shortlists = await getAllShortLists();
    console.log('got response', shortlists)
    return NextResponse.json(shortlists, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 401 }
      );
    }
  }

  return NextResponse.json({ ok: false, message: "Something went wrong!" }, { status: 500 });
}

