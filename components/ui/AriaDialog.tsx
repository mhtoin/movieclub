"use client";
import * as Ariakit from "@ariakit/react";

export interface AriaDialogProps {
	children?: React.ReactNode;
	title: string;
	onClose: () => void;
	open: boolean;
}

export default function AriaDialog({
	onClose,
	children,
	open,
}: AriaDialogProps) {
	return (
		<Ariakit.Dialog
			open={open}
			onClose={onClose}
			backdrop={
				<div className="bg-black/5 backdrop-blur-none transition-all duration-300 opacity-0 data-enter:opacity-100 data-enter:backdrop-blur-xs " />
			}
			className="fixed z-50 inset-3 flex flex-col gap-1 overflow-auto rounded-md border max-w-fit min-w-96 lg:min-w-[1000px] m-auto bg-background origin-bottom-right opacity-0 transition-all duration-300 scale-95 data-enter:opacity-100 data-enter:scale-100"
		>
			{children}
		</Ariakit.Dialog>
	);
}
