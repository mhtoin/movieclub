import { getChosenMovie } from "@/lib/shortlist";
import NavBar from "./components/NavBar";

export default async function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const movieOfTheWeek = await getChosenMovie();
  const backgroundPath = movieOfTheWeek?.backdrop_path
    ? `http://image.tmdb.org/t/p/original${movieOfTheWeek["backdrop_path"]}`
    : "";

    console.log('chosen movie', movieOfTheWeek, backgroundPath)
  return (
    <section>
      <div
      className="h-full bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${backgroundPath})`,
        }}
      >
        <div className="backdrop-blur-xl">
        {/* Include shared UI here e.g. a header or sidebar */}
        <NavBar />
        {children}
        </div>
      </div>
    </section>
  );
}
