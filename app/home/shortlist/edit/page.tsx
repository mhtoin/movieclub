
import Search from "./components/Search";
import Shortlist from "./components/Shortlist";
import ShortlistCarousel from "./components/ShortlistCarousel";

export default function ShortListEdit() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-5 overflow-hidden">
      {/* @ts-expect-error Shortlist */}
      <Shortlist />
      <Search />
    </div>
  );
}
