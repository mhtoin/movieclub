import prisma from "./prisma";
import { ObjectId, OptionalId } from "mongodb";
import { Prisma } from '@prisma/client'

export const revalidate = 10

export async function getShortList(id: string) {
    const shortlist = await prisma.shortlist.findFirst({
        where: {
            userId: id
        },
        include: {
            movies: true
        }
    }) 

    console.log('shortlist with id', id, shortlist)
    return shortlist as Prisma.ShortlistInclude
}

export async function getAllShortLists() {
    return await prisma.shortlist.findMany({
        include: {
            movies: true,
            user: true
        }
    })
}

export async function addMovieToShortlist(movie: Movie, userId: string) {
  try {
    // check if user has shortlist, create if absent
    console.log('trying to add movie', movie, 'for ', userId)
    let shortlist = await prisma.shortlist.findFirst({
        where: {
            userId: userId
        }
    })

    console.log('found shortlist', shortlist)
    
    if (!shortlist) {
        shortlist = await prisma.shortlist.create({
            data: {
                userId: userId
            }
        })

        console.log('created shortlist', shortlist)
    }

    
    const movieInDb = await prisma.movie.upsert({
        where: {
            id_: movie.id
        }, update: {

        },
        create: {
            ...movie,
            id: movie._id,
            id_: movie.id
        }
    })

    console.log('movie data in db', movieInDb)

    const updatedShortlist = await prisma.shortlist.update({
        where: {
            id: shortlist.id
        },
        data: {
            movies: {
                connectOrCreate: {
                    where: {
                        id_: movie.id
                    },
                    create: {
                        ...movie,
                        id: movieInDb.id,
                        id_: movie.id
                    }
                }
            }
        }

    })

    console.log('after creation', updatedShortlist)
    // now that we have the movie, insert into shortlist (or create shortlist if absent)

    //revalidateTag("shortlist");
    //return res
  } catch (e) {
    console.error(e);
  }
}


export async function removeMovieFromShortlist(id: string) {
  try {
    //const movie = await prisma.

    //return NextResponse.json({ message: "Deleted succesfully" });
  } catch (e) {
    console.log(e);
  }
}
