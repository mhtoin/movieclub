import * as Ariakit from "@ariakit/react";
import { forwardRef, useEffect, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface CheckboxProps extends ComponentPropsWithoutRef<"input"> {
	children?: ReactNode;
	isLoading?: boolean;
	provider: {
		provider_id: number;
		provider_name: string;
		logo_path: string;
	};
	handleClick?: (value: string) => void;
}

export const ProviderCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
	function ProviderCheckbox(
		{ children, provider, isLoading, handleClick, ...props },
		ref,
	) {
		const [checked, setChecked] = useState(props.defaultChecked ?? false);
		const [focusVisible, setFocusVisible] = useState(false);

		useEffect(() => {
			setChecked(props.defaultChecked ?? false);
		}, [props.defaultChecked]);

		return (
			<label
				className="flex items-center gap-1 h-10 w-10 lg:h-12 lg:w-12 aspect-square  rounded cursor-pointer hover:scale-105 transition-transform ease-in-out duration-200"
				data-checked={checked}
				data-focus-visible={focusVisible || undefined}
				htmlFor={`provider-${provider.provider_id}`}
			>
				<Ariakit.VisuallyHidden>
					<Ariakit.Checkbox
						{...props}
						id={`provider-${provider.provider_id}`}
						ref={ref}
						clickOnEnter
						onFocusVisible={() => setFocusVisible(true)}
						onBlur={() => setFocusVisible(false)}
						onChange={(event) => {
							setChecked(event.target.checked);
							props.onChange?.(event);
							handleClick?.(provider.provider_id.toString());
						}}
					/>
				</Ariakit.VisuallyHidden>
				<img
					src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
					className={`transition-all ease-in-out duration-200 object-fill aspect-square object-center rounded  ${
						checked
							? "grayscale-0  opacity-100 border border-border"
							: "opacity-20 grayscale"
					} ${isLoading ? "animate-pulse" : ""}`}
					alt={provider.provider_name}
				/>
			</label>
		);
	},
);
