import clientPromise from "@/lib/mongo";
import { ObjectId, OptionalId } from "mongodb";

export const revalidate = 10

export async function getShortList() {
  try {
    const client = await clientPromise;
    const collection = client.db("movieclub").collection("shortlist");

    const movies =  await collection.find<Movie>({}).toArray();
    return movies
  } catch (e) {
    console.error(e);
  }
}

export async function getUserShortList(userId?: string) {
  try {
    const client = await clientPromise;
    const collection = client.db("movieclub").collection("shortlist");

    const movies =  await collection.find<Movie>({ userId: new ObjectId(userId) }).toArray();
    return movies
  } catch (e) {
    console.error(e);
  }
}

export async function addMovieToShortlist(movie: Movie) {
  try {
    const client = await clientPromise;
    const collection = client.db("movieclub").collection<Movie>("shortlist");
    
    const res = await collection.insertOne({...movie, userId: new ObjectId(movie.userId)});

    //revalidateTag("shortlist");

    //return res
  } catch (e) {
    console.error(e);
  }
}


export async function removeMovieFromShortlist(id: string) {
  try {
    const client = await clientPromise;
    const collection = client.db("movieclub").collection("shortlist");
    const res = await collection.deleteOne({ _id: new ObjectId(id) });

    //return NextResponse.json({ message: "Deleted succesfully" });
  } catch (e) {
    console.log(e);
  }
}
