import { updateUser } from "@/lib/user";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: { userId: string } }
  ) {
    let body = await request.json();
    console.log('body, params.id', body, params)
    let res = await updateUser(body, params.userId);
  
    return NextResponse.json(res);
  }