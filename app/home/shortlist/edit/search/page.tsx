"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import MoviePosterCard from "@/app/components/MoviePosterCard";
import FiltersModal from "./components/FiltersModal";
import { useSession } from "next-auth/react";

async function getInitialData() {
  const initialSearch = await fetch(
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&watch_region=FI&with_watch_providers=8",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.moviedbtoken}`,
      },
    }
  );
  return initialSearch.json();
}



const fetchMovies = async (page: number, searchValue: string) => {
  const searchQuery = searchValue
    ? searchValue + `&page=${page}`
    : `include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=FI&with_watch_providers=8`;
  const initialSearch = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${searchQuery}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.moviedbtoken}`,
      },
    }
  );
  return initialSearch.json();
};

export default function SearchPage() {
  const [searchValue, setSearchValue] = useState("");
  const [genreSelections, setGenreSelections] = useState([]);
  const [yearRange, setYearRange] = useState({ min: "", max: "" });
  const [ratingRange, setRatingRange] = useState({ min: "", max: "" });
  const [onlyNetflix, setOnlyNeflix] = useState(true)
  const { data: session } = useSession();
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

  const { data: shortlist, status: shortlistStatus } = useQuery({
    queryKey: ["shortlist"],
    queryFn: async () => {
      let res = await fetch(`/api/shortlist/${session?.user.userId}`)
      return await res.json()
    },
    enabled: !!session
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
    const baseUrl = `include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc${onlyNetflix && '&watch_region=FI&with_watch_providers=8'}`;
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

    console.log("query", queryStringArr);

    const queryString = queryStringArr.join("&");
    console.log('querystring', queryString);
    setSearchValue(baseUrl + "&" + queryString);
  };

  const handleGenreSelection = (
    genres: Array<{ label: string; value: number }>
  ) => {
    setGenreSelections(
      genres.map((genre: { label: string; value: number }) => genre.value)
    );
    console.log(genreSelections);
  };

  const handleYearRangeSelect = (label: string, value: string) => {
    setYearRange({ ...yearRange, [label]: value });
  };

  const handleRatingRangeSelect = (label: string, value: string) => {
    setRatingRange({ ...ratingRange, [label]: value });
  };

  if (status === "loading" || shortlistStatus === 'loading') {
    return (
      <div className="flex flex-row items-center justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  const shortlistMovieIds = shortlist.movies.map((movie: Movie) => movie.tmdbId)
  console.log('shortlist in search', shortlistMovieIds)
  return (
    <div className="flex flex-col items-center gap-5 z-10">
      <input
        type="text"
        placeholder="Search by title"
        className="input input-bordered w-full max-w-xs"
      />
      <FiltersModal
        handleGenreSelection={handleGenreSelection}
        genreSelections={genreSelections}
        handleSearchSubmit={handleSearchSubmit}
        handleYearRangeSelect={handleYearRangeSelect}
        handleRatingRangeSelect={handleRatingRangeSelect}
        handleProviderToggle={setOnlyNeflix}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-center gap-10 z-30">
        {data?.pages.map((page) => (
          <Fragment key={page.page}>
            {page.results.map((movie: TMDBMovie) => {
              return (
                <MoviePosterCard key={movie.id} movie={movie} added={shortlistMovieIds.includes(movie.id)} />
              );
            })}
          </Fragment>
        ))}
      </div>
      <button ref={loadMoreButtonRef} onClick={() => fetchNextPage()}>
        Load More
      </button>
    </div>
  );
}
