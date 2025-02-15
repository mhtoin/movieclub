"use client";

import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { recreateTierlist } from "../../actions/actions";

export default function CreateForm() {
	const [tiers, _setTiers] = useState(
		[...new Array(5)].map((_value, index) => {
			return { value: index + 1, label: "" };
		}),
	);
	const { register } = useForm();

	return (
		<>
			<dialog id="createModal" className="modal modal-bottom sm:modal-middle">
				<div className="flex flex-col items center">
					<form
						method="POST"
						className="flex flex-col items-center gap-4"
						action={recreateTierlist}
					>
						{tiers?.map((tier) => {
							return (
								<Fragment key={tier.value}>
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
									/>
								</Fragment>
							);
						})}
						<button className="btn btn-success" type="submit">
							Create
						</button>
					</form>
				</div>
			</dialog>
		</>
	);
}
