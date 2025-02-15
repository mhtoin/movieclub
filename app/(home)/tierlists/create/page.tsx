"use client";

import { Button } from "components/ui/Button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createNewTierlist } from "../actions/actions";

export default function Page() {
	const [tiers, _setTiers] = useState(
		[...new Array(5)].map((_value, index) => {
			return { value: index + 1, label: "" };
		}),
	);
	const { register } = useForm();

	return (
		<div className="flex flex-col items center">
			<form
				className="flex flex-col items-center gap-4"
				action={createNewTierlist}
			>
				{tiers?.map((tier) => {
					return (
						<>
							<label
								htmlFor={`tier${tier.value}`}
								key={`tier-label-${tier.value}`}
							>
								{`Tier${tier.value}`}
							</label>
							<input
								type="text"
								placeholder="Label your tier"
								className="input input-bordered w-full max-w-xs"
								{...register(`${tier.value}`)}
								key={`tier-input-${tier.value}`}
							/>
						</>
					);
				})}
				<Button type="submit">Create</Button>
			</form>
		</div>
	);
}
