"use client";

import { MagnifyingGlassIcon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import KeywordCombobox from "./KeywordCombobox";
import router from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getKeyWord, searchKeywords } from "@/lib/movies/queries";
import { set } from "date-fns";

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Get the query params for each part of the search
   */
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const keywordArr = useMemo(
    () => searchParams.get("with_keywords")?.split(",") ?? [],
    [searchParams]
  );
  const [value, setValue] = useState("");

  /**
   * Will contain the ids for keywords
   */

  /**
   * Holds the names of the keywords, mapped from the ids and used to display the selected keywords
   */
  const [keywords, setKeywords] = useState<Array<{ id: number; name: string }>>(
    []
  );

  const [type, setType] = useState<"title" | "keyword">(
    query ? "title" : "keyword"
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("running", keywordArr);

    keywordArr?.forEach(async (keyword) => {
      const data = await queryClient.ensureQueryData({
        queryKey: ["keywordSearch", keyword],
        queryFn: () => getKeyWord(keyword),
      });

      if (data) {
        if (keywords.find((kw) => kw.id === data?.id)) return;
        const updatedKeywords = keywords.concat(data);
        setKeywords(updatedKeywords);
      }
    });
  }, [keywordArr, queryClient, keywords]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /**
     * Since searching by title uses a different endpoint, we need to wipe the search params clean and just provide the query
     */
    const params = new URLSearchParams();
    if (type === "title") {
      params.set("query", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleKeywordSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentKeywords = searchParams.get("with_keywords")?.split(",") ?? [];
    params.set("with_keywords", [...currentKeywords, value].join(","));
    const queryString = params.toString();
    //setKeywords([...keywords, value]);

    router.push(`${pathname}?${params.toString()}`);
  };

  console.log("keywords", keywords);

  return (
    <form
      className="lg:py-7 relative lg:h-12 flex gap-2 border rounded-lg items-center px-2 group focus-visible:ring-offset-2 bg-input"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-2">
        <Button
          variant={"secondary"}
          size={"xs"}
          className={`hover:bg-accent transition-opacity ${
            type === "keyword" ? "opacity-100" : "opacity-40"
          }`}
          onClick={() => setType("keyword")}
        >
          Keyword
        </Button>
        <Button
          variant={"secondary"}
          size={"xs"}
          className={`hover:bg-accent transition-opacity ${
            type === "title" ? "opacity-100" : "opacity-40"
          }`}
          onClick={() => setType("title")}
        >
          Title
        </Button>
      </div>
      {type === "title" ? (
        <Input
          type="text"
          placeholder={`Search movies by ${type}`}
          className="border-none ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-input text-xs placeholder:text-xs"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <KeywordCombobox handleSelect={handleKeywordSelect} />
      )}
      <Button variant={"ghost"} type="submit">
        <MagnifyingGlassIcon />
      </Button>
      <div className="absolute -top-3 left-2 flex gap-1 max-w-80 hover:max-w-fit">
        {keywords.map((keyword) => (
          <Button
            variant={"outline"}
            size={"xxs"}
            className="text-[0.7rem] group/badge min-w-12"
            key={keyword?.id}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              const currentKeywords =
                searchParams.get("with_keywords")?.split(",") ?? [];

              const updatedKeywords = currentKeywords.filter(
                (kw) => kw !== keyword?.id.toString()
              );

              if (updatedKeywords.length === 0) {
                params.delete("with_keywords");
              } else {
                params.set("with_keywords", updatedKeywords.join(","));
              }
              const updatedState = keywords.filter(
                (kw) => kw.id !== keyword.id
              );
              console.log("updatedState", updatedState);
              setKeywords(updatedState);

              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            <span className="group-hover/badge:hidden">{keyword?.name}</span>
            <TrashIcon className="hidden group-hover/badge:block" />
          </Button>
        ))}
      </div>
    </form>
  );
}