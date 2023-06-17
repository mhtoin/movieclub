import { getChosenMovie } from "@/lib/shortlist";
import NavBar from "./components/NavBar";
import { getColours } from "./shortlist/edit/actions/actions";
import Navigation from "./components/Navigation";

export default async function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const movieOfTheWeek = await getChosenMovie();
  const backgroundPath = movieOfTheWeek?.backdrop_path
    ? `http://image.tmdb.org/t/p/original${movieOfTheWeek["backdrop_path"]}`
    : "";

  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
    
      {children}
   
    </section>
  );
}
