"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import KeywordCombobox from "./KeywordCombobox";
import router from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getKeyWord, searchKeywords } from "@/lib/movies/queries";
import { set } from "date-fns";

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const keywordArr = searchParams.get("with_keywords")?.split(",") ?? [];
  const [value, setValue] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [type, setType] = useState<"title" | "keyword">("title");
  const queryClient = useQueryClient();

  useEffect(() => {
    const arr = keywordArr?.map(async (keyword) => {
      const data = await queryClient.ensureQueryData({
        queryKey: ["keywords", keyword],
        queryFn: () => getKeyWord(keyword),
      });
      console.log("search data", data);

      if (data) {
        console.log("keyword data", data);
        setKeywords([...keywords, data?.name]);
        return data?.name;
      }
    });
    console.log("array", arr);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (type === "title") {
      params.set("query", value);
    }
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
    <form className="relative h-12 flex gap-2 border rounded-lg items-center px-2 group focus-visible:ring-offset-2">
      <div className="flex gap-2">
        <Button
          variant={"secondary"}
          size={"xs"}
          className={`transition-opacity ${
            type === "title" ? "opacity-100" : "opacity-40"
          }`}
          onClick={() => setType("title")}
        >
          Title
        </Button>
        <Button
          variant={"secondary"}
          size={"xs"}
          className={`transition-opacity ${
            type === "keyword" ? "opacity-100" : "opacity-40"
          }`}
          onClick={() => setType("keyword")}
        >
          Keyword
        </Button>
      </div>
      {type === "title" ? (
        <Input
          type="text"
          placeholder={`Search movies by ${type}`}
          className="border-none ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      ) : (
        <KeywordCombobox handleSelect={handleKeywordSelect} />
      )}
      <Button variant={"ghost"}>
        <MagnifyingGlassIcon />
      </Button>
      <div className="absolute -top-5 left-0 flex gap-1">
        {keywords.map((keyword) => (
          <div
            className="flex items-center border rounded h-5 text-[0.7rem] bg-secondary px-2"
            key={keyword}
          >
            {keyword}
            <Button variant={"ghost"} size={"xs"}>
              x
            </Button>
          </div>
        ))}
      </div>
    </form>
  );
}
