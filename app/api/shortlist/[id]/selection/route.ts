
import { updateShortlistSelection } from "@/lib/shortlist";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
  ) {

    const { selectedIndex } = await request.json();
    const res = await updateShortlistSelection(selectedIndex, params.id);
  
    return NextResponse.json(res);
  }
  