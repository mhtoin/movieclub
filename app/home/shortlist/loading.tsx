import { range } from "@/lib/utils";
import ShortlistSkeleton from "./components/ShortlistSkeleton";

export default function Loading() {
  return (
    <div className="flex max-h-screen flex-col items-center overflow-hidden">
      <div className="flex flex-col place-items-center m-5 p-5 gap-5 overflow-scroll max-h-[calc(100% - 100px)]">
        {range(5).map((index) => {
            return <ShortlistSkeleton key={index} index={index} />;
        })}
      </div>
    </div>
  );
}
