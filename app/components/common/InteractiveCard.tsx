import Link from "next/link";
import { Button } from "../ui/Button";
import { ExternalLink } from "lucide-react";

export default function InteractiveCard({
  children,
  highlight,
  movie,
}: {
  children: React.ReactNode;
  highlight: boolean;
  movie: Movie;
}) {
  return (
    <div
      className={`card ${
        highlight ? "border-accent border-b-4 transition-all duration-700" : ""
      }`}
    >
      <img
        src={`https://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
        alt=""
        width={"150"}
        className={`primary-img w-[150px] h-auto 2xl:w-[150px]`}
      />
      {/*<img
            src={`http://image.tmdb.org/t/p/original/${movie["backdrop_path"]}`}
            alt=""
            width={"150"}
            height={"220"}
            className={`w-auto h-[220px] 2xl:w-auto 2xl:h-[220px] secondary-img`}
          />*/}
      <div className="card__content">
        <div className="card__title-container">
          <h2 className="card__title line-clamp-2">{movie.title}</h2>
        </div>
        <div className="card__description">
          <div className="description-actions">{children}</div>
          <div className="description-links">
            <div className="flex flex-col items-center">
              <span className="text-xs">TMDb</span>
              <Link
                href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
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
