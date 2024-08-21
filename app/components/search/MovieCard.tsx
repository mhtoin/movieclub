"use client";

import { useSession } from "next-auth/react";
import { omit } from "@/lib/utils";
import {
  useAddToShortlistMutation,
  useAddToWatchlistMutation,
  useRemoveFromShortlistMutation,
  useUpdateSelectionMutation,
} from "@/lib/hooks";
import { useState } from "react";
import BookmarkButton from "./BookmarkButton";
import AddButton from "./AddButton";
import Link from "next/link";
import MovieCardButton from "./MovieCardButton";
import CheckMark from "./CheckMark";
import { Button } from "../ui/Button";
import { ListPlus, ListCheck, ListX, ExternalLink } from "lucide-react";

export default function MovieCard({
  movie,
  added,
  inWatchlist,
}: {
  movie: TMDBMovie;
  added: boolean;
  inWatchlist: boolean;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const watchlistMutation = useAddToWatchlistMutation();
  const removeMutation = useRemoveFromShortlistMutation();
  const selectionMutation = useUpdateSelectionMutation();
  const addMutation = useAddToShortlistMutation();
  const { data: session } = useSession();
  return (
    <div className={`card`}>
      <img
        src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
        alt=""
        width={"150"}
        className={`primary-img w-[150px] h-auto 2xl:w-[150px]`}
      />
      <img
        src={`http://image.tmdb.org/t/p/original/${movie["backdrop_path"]}`}
        alt=""
        height={"220"}
        className={`secondary-img`}
      />
      <div className="card__content">
        <div className="card__title-container">
          <h2 className="card__title line-clamp-2">{movie.title}</h2>
        </div>
        <div className="card__description">
          <div className="description-actions">
            <div className="flex flex-col items-center">
              <span className="text-xs">Add</span>
              <Button variant={"ghost"} size={"icon"}>
                <ListPlus />
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs">Select</span>
              <Button variant="ghost" size="icon">
                <ListCheck />
              </Button>
            </div>
            {
              <div className="flex flex-col items-center">
                <span className="text-xs">Remove</span>
                <Button variant="ghost" size="icon">
                  <ListX />
                </Button>
              </div>
            }
          </div>
          <div className="description-links">
            <div className="flex flex-col items-center">
              <span className="text-xs">TMDb</span>
              <Link
                href={`https://www.themoviedb.org/movie/${movie.id}`}
                target="_blank"
              >
                <Button variant="ghost" size="icon">
                  <ExternalLink />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
