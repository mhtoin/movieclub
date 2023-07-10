
import Link from "next/link";
import Search from "./components/Search";
import Shortlist from "./components/Shortlist";
import ShortlistCarousel from "./components/ShortlistCarousel";
import ReadyToggle from "./components/ReadyToggle";

export default function ShortListEdit() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-5 overflow-hidden">
      {/* @ts-expect-error Shortlist */}
      <Shortlist />
      <ReadyToggle />
      <div className="flex flex-col sm:flex-row items-center gap-5">
      <Link href={'/home/shortlist/edit/watchlist'}><div className="btn">Add from watchlist</div></Link>
      <Link href={'/home/shortlist/edit/search'}><div className="btn">Search</div></Link>
      </div>
      
     
    </div>
  );
}
