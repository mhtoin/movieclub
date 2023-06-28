
import Link from "next/link";
import Search from "./components/Search";
import Shortlist from "./components/Shortlist";
import ShortlistCarousel from "./components/ShortlistCarousel";

export default function ShortListEdit() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-5 overflow-hidden">
      {/* @ts-expect-error Shortlist */}
      <Shortlist />
      <Link href={'/home/shortlist/edit/watchlist'}><div className="btn">Add from watchlist</div></Link>
      <Link href={'/home/shortlist/edit/search'}><div className="btn">Search</div></Link>
     
    </div>
  );
}
