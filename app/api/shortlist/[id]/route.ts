import { NextRequest, NextResponse } from "next/server";
import { getShortList } from "@/lib/shortlist";
import { getServerSession } from "@/lib/getServerSession";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    
    let shortlist = await getShortList(id);
    return NextResponse.json(shortlist);
  } catch (e) {
    console.log(e);
  }
}
