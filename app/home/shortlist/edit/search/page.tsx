"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import FiltersModal from "./components/FiltersModal";
import { useSession } from "next-auth/react";
import ShortlistContainer from "./components/ShortlistContainer";
import MovieCard from "./components/MovieCard";
import { useGetWatchProvidersQuery, useShortlistQuery } from "@/lib/hooks";
import { useFilterStore } from "@/stores/useFilterStore";
import ProviderButton from "./components/ProviderButton";

export const revalidate = 5;

const fetchMovies = async (page: number, searchValue: string) => {
  const searchQuery = searchValue
    ? searchValue + `&page=${page}`
    : `discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=FI&with_watch_providers=8`;
  const initialSearch = await fetch(
    `https://api.themoviedb.org/3/${searchQuery}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
      },
    }
  );
  return initialSearch.json();
};

export default function SearchPage() {
  const [searchValue, setSearchValue] = useState("");
  const genreSelections = useFilterStore.use.genres();
  const yearRange = useFilterStore.use.yearRange();
  const ratingRange = useFilterStore.use.ratingRange();
  const [onlyNetflix, setOnlyNeflix] = useState(true);
  const [titleSearch, setTitleSearch] = useState("");
  const { data: session } = useSession();
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);
  const watchProviders = useFilterStore.use.watchProviders();

  const searchBaseUrl = `search/movie?query`;

  const {
    data: shortlist,
    status: shortlistStatus,
    fetchStatus,
  } = useShortlistQuery(session?.user?.shortlistId);
  const { data: providers, status: providersStatus } =
    useGetWatchProvidersQuery();
  const baseUrl = `discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc${
    watchProviders &&
    `&watch_region=FI&with_watch_providers=${watchProviders
      .map((provider: any) => provider.provider_id)
      .join("|")})}`
  }`;

  //console.log("providers", watchProviders);

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      [searchValue],
      ({ pageParam = 1 }) => fetchMovies(pageParam, searchValue),
      {
        getNextPageParam: (lastPage) => {
          const { page, total_pages: totalPages } = lastPage;
          return page < totalPages ? page + 1 : undefined;
        },
      }
    );

  useEffect(() => {
    if (!hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver((entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      })
    );
    const el = loadMoreButtonRef && loadMoreButtonRef.current;
    if (!el) {
      return;
    }

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [loadMoreButtonRef.current, hasNextPage]);

  const handleSearchSubmit = () => {
    //const baseUrl = `include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc${onlyNetflix && '&watch_region=FI&with_watch_providers=8'}`;
    var queryStringArr = [];
    if (genreSelections.length > 0) {
      queryStringArr.push(
        `with_genres=${genreSelections
          .map((genre: Genre) => genre.value)
          .join("|")}`
      );
    }

    if (yearRange.min) {
      queryStringArr.push(`release_date.gte=${yearRange.min}`);
    }

    if (yearRange.max) {
      queryStringArr.push(`release_date.lte=${yearRange.max}`);
    }

    if (ratingRange.min) {
      queryStringArr.push(`vote_average.gte=${ratingRange.min}`);
    }

    if (ratingRange.max) {
      queryStringArr.push(`vote_average.lte=${ratingRange.max}`);
    }

    const queryString = queryStringArr.join("&");
    setSearchValue(baseUrl + "&" + queryString);
  };

  const handleSearchByTitle = () => {
    setSearchValue(
      `${searchBaseUrl}=${titleSearch}&append_to_response=watch/providers`
    );
  };

  if (status === "loading" || shortlistStatus === "loading" || !shortlist) {
    return (
      <div className="flex flex-row items-center justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  const shortlistMovieIds = shortlist
    ? shortlist?.movies?.map((movie: Movie) => movie.tmdbId)
    : [];

  return (
    <div className="flex flex-col items-center gap-5 z-10">
      <ShortlistContainer />
      <div className="flex flex-row gap-5 items-center">
        <input
          type="text"
          placeholder="Search by title"
          className="input input-bordered w-full max-w-xs"
          value={titleSearch}
          onChange={(event) => setTitleSearch(event.target.value)}
        />
        <button className="btn" onClick={handleSearchByTitle}>
          Search
        </button>
      </div>
      <div className="flex flex-row gap-5 items-center">
        <FiltersModal
          handleSearchSubmit={handleSearchSubmit}
          handleProviderToggle={setOnlyNeflix}
        />
        <button className="btn" onClick={() => setSearchValue("")}>
          Reset
        </button>
      </div>
      <div className="flex flex-row gap-5 items-center">
        {providers?.map((provider: any) => {
          return (
            <ProviderButton
              key={provider.provider_id}
              provider={provider}
              isToggled={watchProviders.includes(provider.provider_id)}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-center gap-10 z-30">
        {data
          ? data?.pages?.map((page) => (
              <Fragment key={page.page}>
                {page.results.map((movie: TMDBMovie) => {
                  console.log(movie)
                  return (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      added={shortlistMovieIds?.includes(movie.id)}
                    />
                  );
                })}
              </Fragment>
            ))
          : []}
      </div>
      {hasNextPage && (
        <button ref={loadMoreButtonRef} onClick={() => fetchNextPage()}>
          Load More
        </button>
      )}
    </div>
  );
}
