import Search from "./components/Search";
import Shortlist from "./components/Shortlist";

export default function ShortListEdit() {
  return (
    <div className="flex min-h-screen flex-col items-center p-24 gap-5">
      <Shortlist />
      <Search />
    </div>
  );
}
