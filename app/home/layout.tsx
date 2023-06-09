import { getChosenMovie } from "@/lib/shortlist";
import NavBar from "./components/NavBar";
import { getColours } from "./shortlist/edit/actions/actions";
import Navigation from "./components/Navigation";

export default async function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
    
      {children}
   
    </section>
  );
}
