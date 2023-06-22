import { get } from "underscore";

export async function getAdditionalInfo(tmdbId: number) {
    let tmdbDetailsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${
          tmdbId
        }?language=${"en-US"}&append_to_response=videos,watch/providers`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.MOVIEDB_TOKEN}`,
          },
        }
      );
    
      let tmdbDetails = await tmdbDetailsRes.json();
      console.log("details", tmdbDetails);
    
      let trailers = tmdbDetails.videos?.results
        .filter(
          (video: any) =>
            video.type === "Trailer" && video.official && video.site === "YouTube"
        )
        .map((trailer: any) => {
          return {
            name: trailer.name,
            id: trailer.id,
            key: trailer.key,
          };
        }) as Trailer[];
    
      let watchProviders = get(tmdbDetails["watch/providers"]?.results, "FI");

      return {
        trailers: trailers,
        watchProviders: watchProviders,
        tagline: tmdbDetails.tagline
      }
}