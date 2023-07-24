
import Link from "next/link";
import Shortlist from "./components/Shortlist";
import ReadyToggle from "./components/ReadyToggle";
import { getServerSession } from "@/lib/getServerSession";
import { getShortList } from "@/lib/shortlist";
import SelectionRadio from "./components/SelectionRadio";
import SelectionAlert from "./components/SelectionAlert";
import { updateShortlistParticipation, updateShortlistReadyState } from "./actions/actions";

export default async function ShortListEdit() {
  const session = await getServerSession();
  const shortlistData = (await getShortList(session?.user.userId)) ?? [];

  const movies = (shortlistData?.movies as Movie[]) || [];

  return (
    <div className="flex min-w-fit flex-col items-center gap-5 overflow-hidden">
      {/* @ts-expect-error Shortlist */}
      {shortlistData.requiresSelection && <SelectionAlert />}
      {/* @ts-expect-error Shortlist */}
      <Shortlist />
       {/* @ts-expect-error Shortlist*/}
      {shortlistData.requiresSelection && <SelectionRadio length={movies.length} selectedIndex={shortlistData.selectedIndex}/>}
       
       <div className="flex flex-row gap-5">
       {/* @ts-expect-error Shortlist */}
      <ReadyToggle isReady={shortlistData.isReady} onToggle={updateShortlistReadyState} label="Ready"/>
      {/* @ts-expect-error Shortlist */}
      <ReadyToggle isReady={shortlistData.participating} onToggle={updateShortlistParticipation} label="Participating"/>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-5">
      <Link href={'/home/shortlist/edit/watchlist'}><div className="btn">Add from watchlist</div></Link>
      <Link href={'/home/shortlist/edit/search'}><div className="btn">Search</div></Link>
      </div>
      
     
    </div>
  );
}
