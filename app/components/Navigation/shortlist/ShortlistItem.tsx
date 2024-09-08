import Image from "next/image";

interface SearchResultCardProps {
  movie: Movie;
  shortlistId: string;
  removeFromShortList?: boolean;
  highlight?: boolean;
  requiresSelection?: boolean;
  index?: number;
}

export default function ShortlistItem({
  movie,
  shortlistId,
  removeFromShortList,
  highlight,
  requiresSelection,
  index,
}: SearchResultCardProps) {
  return (
    <article className="shortlist__card">
      <Image
        src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
        alt="Movie poster"
        width={1150}
        height={180}
        className="shortlist__card__background"
        priority={true}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
        quality={100}
        loading="eager"
        style={{ objectFit: "cover" }}
        placeholder="blur"
        blurDataURL={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
      />
      <div className="shortlist__card__content | flow">
        <div className="shortlist__card__content--container | flow">
          <h2 className="shortlist__card__title">{movie["title"]}</h2>
          <p className="shortlist__card__description">Description</p>
        </div>
        <button className="shortlist__card__button">Button</button>
      </div>
    </article>
  );
}
