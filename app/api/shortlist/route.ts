import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllShortLists } from "@/lib/shortlist";
export const dynamic = 'force-dynamic'
export async function GET(
  request: NextRequest,
) {
  try {
    console.log('getting shortlists')
    const shortlists = await getAllShortLists();
    console.log('got response', shortlists)
    revalidatePath("/home/shortlist");
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

