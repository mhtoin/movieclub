import { Checkbox, useCheckboxStore, useStoreState } from "@ariakit/react";
import type React from "react";
import { Button } from "./Button";

export default function CheckboxButton({ icon }: { icon: React.ReactNode }) {
	const checkbox = useCheckboxStore();
	const label = useStoreState(checkbox, (state) =>
		state.value ? "color-accent" : "color-foreground",
	);
	return (
		<Checkbox
			store={checkbox}
			className="button"
			render={<Button variant={"outline"} size={"sm"} />}
		/>
	);
}
