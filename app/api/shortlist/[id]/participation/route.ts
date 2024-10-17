import {
  updateShortlistParticipationState,
  updateShortlistState,
} from "@/lib/shortlist";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  let { participating } = await request.json();
  let res = await updateShortlistParticipationState(participating, params.id);

  return NextResponse.json(res);
}
