import ShortListItem from "@/app/(home)/home/shortlist/edit/components/ShortListItem";
import { useValidateSession } from "@/lib/hooks";
import Image from "next/image";

export default function Items({
  shortlist,
  skeletons,
}: {
  shortlist: Shortlist | null;
  skeletons: React.ReactNode[];
}) {
  const { data: user } = useValidateSession();
  return (
    <div
      key={shortlist?.id + "-container"}
      className="flex flex-row flex-wrap gap-1 lg:gap-3 h-full sm:w-auto items-center justify-center p-2 lg:p-3 border rounded-xl bg-background"
    >
      {shortlist?.movies.map((movie: Movie, index: number) => {
        return (
          <Image
            src={`https://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
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
            blurDataURL={`https://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
            key={movie.id}
          />
        );
      })}
      {skeletons.map((skeleton) => {
        return skeleton;
      })}
    </div>
  );
}
