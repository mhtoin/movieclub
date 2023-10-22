import { Fragment } from "react";
import { range } from "@/lib/utils";
import ItemSkeleton from "../edit/components/ItemSkeleton";

export default function ShortlistSkeleton({ index }: { index: number }) {
  return (
    <Fragment key={`fragment-${index}`}>
      <div
        className="flex flex-row justify-center place-items-center"
        key={`name-container-${index}`}
      >
        <div
          className={`avatar mr-5 flex justify-center ${"hover:opacity-70"}`}
          key={`avatar-${index}`}
        >
          <div
            className={`w-12 rounded-full ring ring-offset-base-200 ring-offset-2`}
            key={`avatar-ring ${index}`}
          >
            <span className="loading loading-spinner m-3"></span>
          </div>
        </div>
      </div>

      <div
        key={index + "-container"}
        className="flex flex-row gap-5 w-2/3 sm:w-auto"
      >
        {range(3).map((arrIndex: number) => {
          return <ItemSkeleton key={arrIndex} />;
        })}
      </div>
    </Fragment>
  );
}
