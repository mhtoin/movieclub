"use client";
import { Checkbox, VisuallyHidden } from "@ariakit/react";
import { type ComponentPropsWithoutRef, type ReactNode, useState } from "react";

interface CheckboxProps extends ComponentPropsWithoutRef<"input"> {
	children?: ReactNode;
	label?: string;
}

export const ParticipationButton = function ParticipationButton(
    {
        ref,
        ...props
    }: CheckboxProps & {
        ref: React.RefObject<HTMLInputElement>;
    }
) {
    const [focusVisible, setFocusVisible] = useState(false);

    return (
        <label
            className={`flex select-none items-center gap-2 border rounded-md p-3 hover:bg-accent/20 transition-all duration-500 ${
                props.checked ? "border-accent" : "border-border"
            }`}
            data-checked={props.checked}
            data-focus-visible={focusVisible || undefined}
            title="Participate in the raffle"
            aria-label="Participate in the raffle"
            htmlFor={props.id}
        >
            <VisuallyHidden>
                <Checkbox
                    {...props}
                    id={props.id}
                    ref={ref}
                    clickOnEnter
                    checked={props.checked}
                    onFocusVisible={() => setFocusVisible(true)}
                    onBlur={() => setFocusVisible(false)}
                    onChange={(event) => {
                        props.onChange?.(event);
                    }}
                />
            </VisuallyHidden>

            <div className="check" data-checked={props.checked}>
                <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 16 16"
                    height="1em"
                    width="1em"
                >
                    <title>Participate in the raffle</title>
                    <polyline points="4,8 7,12 12,4" />
                </svg>
            </div>
        </label>
    );
};
