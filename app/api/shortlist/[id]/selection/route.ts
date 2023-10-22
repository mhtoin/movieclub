
import { updateShortlistSelection } from "@/lib/shortlist";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
  ) {

    let { selectedIndex } = await request.json();
    let res = await updateShortlistSelection(selectedIndex, params.id);
  
    return NextResponse.json(res);
  }
  