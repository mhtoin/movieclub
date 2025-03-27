"use client";
import FilterSelect from "@/components/search/FilterSelect";
import { getFilters } from "@/lib/movies/queries";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function GenreFilters() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const { data: genreOptions } = useQuery({
		queryKey: ["genres"],
		queryFn: getFilters,
	});

	const createQueryString = useCallback(
		(name: string, value: string[] | string | number[], isRange = false) => {
			const params = new URLSearchParams(searchParams.toString());
			params.delete("query");
			if (isRange) {
				const min = `${name}.gte`;
				const max = `${name}.lte`;
				params.set(min, value[0].toString());
				params.set(max, value[1].toString());
				return params.toString();
			}

			if (Array.isArray(value)) {
				if (value.length === 0) {
					params.delete(name);
					return params.toString();
				}
				params.set(name, value.join(","));
				return params.toString();
			}
			if (value === "") {
				params.delete(name);
				return params.toString();
			}
			params.set(name, value);
			return params.toString();
		},
		[searchParams],
	);

	const handleGenreSelect = (value: string[]) => {
		const query = createQueryString("with_genres", value);
		router.push(`${pathname}?${query}`, {
			scroll: false,
		});
	};

	return (
		<FilterSelect
			label="Genres"
			options={genreOptions}
			onChange={handleGenreSelect}
		/>
	);
}
