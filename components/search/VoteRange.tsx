"use client";
import RangeSlider from "@/components/ui/RangeSlider";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
export default function VoteRange() {
	const [value, setValue] = useState([0, 10]);
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
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
	const handleRangeSelect = (value: number[]) => {
		const query = createQueryString("vote_average", value, true);
		router.push(`${pathname}?${query}`, {
			scroll: false,
		});
	};
	return (
		<div className="block">
			<RangeSlider
				label="Rating"
				value={value}
				onChange={setValue}
				step={0.1}
				minValue={0}
				maxValue={10}
				thumbLabels={["from", "to"]}
				onChangeEnd={handleRangeSelect}
			/>
		</div>
	);
}
