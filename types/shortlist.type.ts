import type { Prisma } from '@prisma/client'

export type ShortlistWithMovies = Prisma.ShortlistGetPayload<{
  include: { movies: { include: { user: true } }; user: true }
}>

export interface ShortlistWithMoviesById
  extends Record<string, ShortlistWithMovies> {}

export type UserShortlist = Prisma.ShortlistGetPayload<{
  include: { user: true }
}>
