"use client";

import { getKeyWord } from "@/lib/movies/queries";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import KeywordCombobox from "./KeywordCombobox";
import KeywordTag from "./KeywordTag";

export default function SearchInput({
	type,
	width,
}: {
	type: "discover" | "search";
	width: number;
}) {
	const router = useRouter();
	const pathname = usePathname();

	/**
	 * Get the query params for each part of the search
	 */
	const searchParams = useSearchParams();
	const keywordArr = useMemo(
		() => searchParams.get("with_keywords")?.split(",") ?? [],
		[searchParams],
	);
	const [value, setValue] = useState("");

	/**
	 * Will contain the ids for keywords
	 */

	/**
	 * Holds the names of the keywords, mapped from the ids and used to display the selected keywords
	 */
	const [keywords, setKeywords] = useState<Array<{ id: number; name: string }>>(
		[],
	);

	const queryClient = useQueryClient();

	useEffect(() => {
		const fetchKeywords = async () => {
			for (const keyword of keywordArr) {
				const data = await queryClient.ensureQueryData({
					queryKey: ["keywordSearch", keyword],
					queryFn: () => getKeyWord(keyword),
				});

				if (data && !keywords.find((kw) => kw.id === data?.id)) {
					setKeywords((prev) => [...prev, data]);
				}
			}
		};

		fetchKeywords();
	}, [keywordArr, queryClient, keywords]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		/**
		 * Since searching by title uses a different endpoint, we need to wipe the search params clean and just provide the query
		 */
		const params = new URLSearchParams();
		if (type === "search") {
			params.set("query", value);
		}
		router.push(`${pathname}?${params.toString()}`);
	};

	const handleKeywordSelect = async (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		const currentKeywords = searchParams.get("with_keywords")?.split(",") ?? [];
		params.set("with_keywords", [...currentKeywords, value].join(","));
		const data = await queryClient.ensureQueryData({
			queryKey: ["keywordSearch", value],
			queryFn: () => getKeyWord(value),
		});

		if (data) {
			setKeywords([...keywords, data]);
		}
		//setKeywords([...keywords, value]);

		router.push(`${pathname}?${params.toString()}`);
	};

	const handleKeywordRemove = (keyword: { id: number; name: string }) => {
		const params = new URLSearchParams(searchParams.toString());
		const currentKeywords = searchParams.get("with_keywords")?.split(",") ?? [];

		const updatedKeywords = currentKeywords.filter(
			(kw) => kw !== keyword?.id.toString(),
		);

		if (updatedKeywords.length === 0) {
			params.delete("with_keywords");
		} else {
			params.set("with_keywords", updatedKeywords.join(","));
		}
		const updatedState = keywords.filter((kw) => kw.id !== keyword.id);

		setKeywords(updatedState);

		router.push(`${pathname}?${params.toString()}`);
	};

	if (type === "discover") {
		return (
			<form
				onSubmit={handleSubmit}
				className="lg:py-7 relative lg:h-12 flex gap-2 border border-border/80 lg:min-w-[400px] transition-all duration-300 w-full rounded-lg rounded-tl-none items-center group focus-visible:ring-offset-2 bg-input"
			>
				<KeywordCombobox handleSelect={handleKeywordSelect} />
				<div className="absolute top-1/2 -translate-y-1/2 right-1/4 flex gap-1">
					{keywords.map((keyword) => (
						<KeywordTag
							key={keyword.id}
							keyword={keyword}
							handleClick={handleKeywordRemove}
						/>
					))}
				</div>
			</form>
		);
	}

	return (
		<form
			className="lg:py-7 relative lg:h-12 flex gap-2 border border-border/80 rounded-lg rounded-tl-none items-center group focus-visible:ring-offset-2 bg-input"
			onSubmit={handleSubmit}
			style={{ width: `${width}px` }}
		>
			<Input
				type="text"
				placeholder="Search movies by title"
				className="border-none ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-input text-sm placeholder:text-sm w-full text-foreground"
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>

			<Button variant={"ghost"} type="submit">
				<MagnifyingGlassIcon />
			</Button>
		</form>
	);
}
