export default function RaffleResultCard({
  chosenMovie,
}: {
  chosenMovie: MovieOfTheWeek;
}) {
  return (
    <div className="card bg-base-100 shadow-xl image-full">
      <figure className="rounded-2xl">
        <img
          src={`http://image.tmdb.org/t/p/original${chosenMovie?.["poster_path"]}`}
          alt="Shoes"
          className=""
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{chosenMovie?.title}</h2>
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src={chosenMovie?.user?.image} alt={"user"} />
          </div>
        </div>
        <p className="text-white overflow-scroll h-[50px] no-scrollbar">
          {chosenMovie?.overview}
        </p>
        <div className="card-actions justify-end">
          {chosenMovie?.trailers?.map((trailer) => {
            return (
              <a
                key={trailer.id + "-link"}
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  key={trailer.id}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="m20.84 2.18l-3.93.78l2.74 3.54l1.97-.4l-.78-3.92m-6.87 1.36L12 3.93l2.75 3.53l1.96-.39l-2.74-3.53m-4.9.96l-1.97.41l2.75 3.53l1.96-.39L9.07 4.5m-4.91 1l-.98.19a1.995 1.995 0 0 0-1.57 2.35L2 10l4.9-.97L4.16 5.5M20 12v8H4v-8h16m2-2H2v10a2 2 0 0 0 2 2h16c1.11 0 2-.89 2-2V10Z"
                  />
                </svg>
              </a>
            );
          })}
          <a
            href={chosenMovie?.watchProviders?.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="join">
              {chosenMovie?.watchProviders?.flatrate?.map((item) => {
                return (
                  <div className="avatar join-item" key={item.provider_id}>
                    <div className="w-10 rounded">
                      <img
                        src={`http://image.tmdb.org/t/p/original${item["logo_path"]}`}
                        alt="logo"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
