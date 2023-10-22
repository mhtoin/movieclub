import { range } from "@/lib/utils";
import ItemSkeleton from "../components/ItemSkeleton";

export default function Loading() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {range(15).map((index) => {
        return <ItemSkeleton key={index} />;
      })}
    </div>
  );
}
