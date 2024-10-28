import { range } from "@/lib/utils";
import ItemSkeleton from "./ItemSkeleton";

export default function ListSkeleton() {
  return (
    <div className="flex flex-col justify-center m-5 p-10 place-items-center pt-20">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {range(30).map((index) => {
          return <ItemSkeleton key={index} />;
        })}
      </div>
    </div>
  );
}
