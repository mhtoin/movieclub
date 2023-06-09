import clientPromise from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { ObjectId } from "mongodb";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const collection = client.db("movieclub").collection("shortlist");
    const id = params.id
    const res = await collection.deleteOne({ _id: new ObjectId(id)})

    return NextResponse.json({ message: "Deleted succesfully"})
  } catch (e) {
    console.log(e);
  }
}
