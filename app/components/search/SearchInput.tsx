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
    console.log("keywordArr", keywordArr);
    keywordArr?.forEach(async (keyword) => {
      console.log("keyword", keyword);
      const data = await queryClient.ensureQueryData({
        queryKey: ["keywordSearch", keyword],
        queryFn: () => getKeyWord(keyword),
      });
      console.log("search data", data);

      if (data) {
        console.log("keyword data", data);
        console.log("keywords", keywords);
        if (keywords.find((kw) => kw.id === data?.id)) return;
        const updatedKeywords = keywords.concat(data);
        console.log("updatedKeywords", updatedKeywords);
        setKeywords(updatedKeywords);
      }
    });
  }, [keywordArr, keywords, queryClient]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("submit");
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

    console.log("queryString", queryString);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form
      className="py-7 relative h-12 flex gap-2 border rounded-lg items-center px-2 group focus-visible:ring-offset-2 bg-background"
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
          className="border-none ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
              console.log("keyword", keyword);
              const params = new URLSearchParams(searchParams.toString());
              const currentKeywords =
                searchParams.get("with_keywords")?.split(",") ?? [];

              const updatedKeywords = currentKeywords.filter(
                (kw) => kw !== keyword?.id.toString()
              );
              console.log("updatedKeywords", updatedKeywords);
              params.set("with_keywords", updatedKeywords.join(","));
              const updatedState = keywords.filter(
                (kw) => kw.id !== keyword.id
              );
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
