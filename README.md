# MovieClub

This is an app used to host a remote movie club. It allows each user to maintain a shortlist of movie candidates for the group to watch, raffle a movie of the week out of the candidates as well as maintain a tierlist of watched movies.

Users can search for movies in the app, or add them from an external watchlist. Currently only The MovieDB integration is included.

## Getting Started
To run the current version of the app, you will need these things:

- A MonggoDB database. You can run one loaclly or, for example, use [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- A Discord Application to use for authentication. You can create one [here](https://discord.com/developers)
- Access to TMDB API. You can read how to get one [here](https://developer.themoviedb.org/docs)

Copy the .env.sample file and name it .env and insert all the values. Then install all the dependencies:

```bash
npm i
# or
pnpm i
```

## Running locally

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
