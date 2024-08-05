import { searchKeywords } from "@/lib/movies/queries";
import * as Ariakit from "@ariakit/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { startTransition, useState } from "react";

export default function KeywordCombobox({
  handleSelect,
}: {
  handleSelect: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const { data: keywords, status } = useInfiniteQuery({
    queryKey: ["keywords", value],
    enabled: value.length > 2,
    queryFn: () => searchKeywords(value),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
    },
    initialPageParam: 1,
  });

  return (
    <Ariakit.ComboboxProvider
      setValue={(value) => {
        startTransition(() => {
          setValue(value);
        });
      }}
      setSelectedValue={(value) => {
        startTransition(() => {
          handleSelect(value.toString());
          setValue("");
        });
      }}
    >
      <Ariakit.Combobox
        placeholder="Search for a keyword"
        className=" h-10 w-full rounded-md border border-input bg-input px-3 py-2 text-xs lg:text-sm border-none ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
      />
      <Ariakit.ComboboxPopover
        gutter={4}
        sameWidth
        className="popover bg-background z-50 max-h-[min(var(--popover-available-height, 300px), 300px)] flex flex-col items-start gap-2 overscroll-contain rounded-lg border border-solid p-2 overflow-auto text-foreground [box-shadow:0_10px_15px_-3px_rgb(0_0_0_/_0.25),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)]"
      >
        {keywords?.pages.map((page) =>
          page.results.map((keyword: { id: number; name: string }) => (
            <Ariakit.ComboboxItem
              key={keyword.id}
              value={keyword.id.toString()}
              className="flex cursor-default items-center gap-2 rounded p-2 !outline-[none] hover:bg-secondary"
            >
              {keyword.name}
            </Ariakit.ComboboxItem>
          ))
        ) ?? "No results"}
      </Ariakit.ComboboxPopover>
    </Ariakit.ComboboxProvider>
  );
}
