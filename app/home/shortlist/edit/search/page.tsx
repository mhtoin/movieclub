"use client";

import { Fragment, Suspense, useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import MoviePosterCard from "@/app/components/MoviePosterCard";
import FiltersModal from "./components/FiltersModal";
import { useSession } from "next-auth/react";
import ShortListItem from "../components/ShortListItem";
import { removeFromShortList } from "../actions/actions";
import ShortlistMovieItem from "./components/ShortlistMovieItem";
import ShortlistContainer from "./components/ShortlistContainer";
import MovieCard from "./components/MovieCard";

export const revalidate = 5

const fetchMovies = async (page: number, searchValue: string) => {
  console.log("token", process.env.NEXT_PUBLIC_TMDB_TOKEN)
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
  const [genreSelections, setGenreSelections] = useState<Array<number>>([]);
  const [yearRange, setYearRange] = useState({ min: "", max: "" });
  const [ratingRange, setRatingRange] = useState({ min: "", max: "" });
  const [onlyNetflix, setOnlyNeflix] = useState(true);
  const [titleSearch, setTitleSearch] = useState("");
  const { data: session } = useSession();
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);
  const baseUrl = `discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc${
    onlyNetflix && "&watch_region=FI&with_watch_providers=8"
  }`;
  const searchBaseUrl = `search/movie?query`;

  const { data: shortlist, status: shortlistStatus, fetchStatus } = useQuery({
    queryKey: ["shortlist", session?.user?.userId],
    queryFn: async () => {
      let res = await fetch(`/api/shortlist/${session?.user.userId}`, {
        next: {
          tags: ['shortlist'],
          revalidate: 1
        }
      });
      return await res.json();
    },
    enabled: !!session,
  });
  
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
      queryStringArr.push(`with_genres=${genreSelections.join("|")}`);
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

  const handleGenreSelection = (
    genre: number
  ) => {
    setGenreSelections(
      [...genreSelections, genre]
    );
  };

  const handleYearRangeSelect = (label: string, value: string) => {
    setYearRange({ ...yearRange, [label]: value });
  };

  const handleRatingRangeSelect = (label: string, value: string) => {
    setRatingRange({ ...ratingRange, [label]: value });
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

  const shortlistMovieIds = shortlist ? shortlist?.movies?.map(
    (movie: Movie) => movie.tmdbId
  ) : [];

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
          handleGenreSelection={handleGenreSelection}
          genreSelections={genreSelections}
          handleSearchSubmit={handleSearchSubmit}
          handleYearRangeSelect={handleYearRangeSelect}
          handleRatingRangeSelect={handleRatingRangeSelect}
          handleProviderToggle={setOnlyNeflix}
        />
        <button className="btn" onClick={() => setSearchValue("")}>
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-center gap-10 z-30">
        {data ? data?.pages?.map((page) => (
          <Fragment key={page.page}>
            {page.results.map((movie: TMDBMovie) => {
              return (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  added={shortlistMovieIds?.includes(movie.id)}
                />
              );
            })}
          </Fragment>
        )) : []}
      </div>
      {hasNextPage && (
        <button ref={loadMoreButtonRef} onClick={() => fetchNextPage()}>
          Load More
        </button>
      )}
    </div>
  );
}
