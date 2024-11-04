import Image from "next/image";
import { Card, CardContent } from "components/ui/Card";
import { Star, Users } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Button } from "components/ui/Button";
import Link from "next/link";
import { SiThemoviedatabase } from "react-icons/si";
import { FaImdb } from "react-icons/fa";

export default function PosterCard({ movie }: { movie: MovieOfTheWeek }) {
  return (
    <Card className="postercard">
      <CardContent className="flex aspect-square items-center justify-center p-0">
        <Image
          src={`https://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
          width={500}
          height={900}
          alt="movie poster"
          priority={true}
          className="object-cover"
        />
      </CardContent>
      <div className="cardInfo">
        <h1 className="title line-clamp-2">{movie.title}</h1>
        <div className="flex flex-row gap-2 flex-wrap">
          <span className="text-xs flex flex-row items-center gap-1">
            <Star className="w-4 h-4" />
            {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-xs flex flex-row items-center gap-1">
            <Users className="w-4 h-4" />
            {movie.vote_count}
          </span>
          <span className="text-xs flex flex-row items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {movie.popularity.toFixed(1)}
          </span>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <div className="flex flex-row gap-2"></div>
          <div className="description-links">
            <div className="flex flex-row items-center gap-2">
              <Link
                href={`https://www.themoviedb.org/movie/${movie.id}`}
                target="_blank"
              >
                <Button variant="ghost" size="icon">
                  <SiThemoviedatabase className="w-6 h-6" />
                </Button>
              </Link>
              <Link href={`https://www.imdb.com/title/${movie?.imdbId}`}>
                <Button variant="ghost" size="icon">
                  <FaImdb className="w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
