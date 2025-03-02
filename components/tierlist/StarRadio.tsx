import { useMutation } from "@tanstack/react-query";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StarRadioProps {
	value?: number;
	onChange?: (value: number) => void;
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	name?: string;
	id: string;
}

export default function StarRadio({
	value = 0,
	onChange,
	size = "md",
	disabled = false,
	name = "star-rating",
	id,
}: StarRadioProps) {
	const [hoverValue, setHoverValue] = useState<number | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const saveRatingMutation = useMutation({
		mutationFn: async (rating: number) => {
			const res = await fetch(`/api/ratings?id=${id}`, {
				method: "POST",
				body: JSON.stringify({ rating }),
			});
			return res.json();
		},
		onSuccess: () => {
			toast.success("Rating saved");
		},
		onError: () => {
			toast.error("Failed to save rating");
		},
	});

	// Size classes for the stars
	const sizeClasses = {
		sm: "w-5 h-5",
		md: "w-8 h-8",
		lg: "w-10 h-10",
	};

	// Stroke width based on size
	const strokeWidth = {
		sm: 2,
		md: 2.5,
		lg: 3,
	};

	// Calculate the display value (either the hover value or the actual value)
	const displayValue = hoverValue !== null ? hoverValue : value;

	// Handle mouse movement over a star to determine quarter increments
	const handleMouseMove = (
		event: React.MouseEvent<HTMLLabelElement>,
		starIndex: number,
	) => {
		if (disabled || saveRatingMutation.isPending) return;

		const { left, width } = event.currentTarget.getBoundingClientRect();
		const position = (event.clientX - left) / width;

		// Calculate quarter increments (0, 0.25, 0.5, 0.75, 1)
		let quarterValue = 0;
		if (position <= 0.25) quarterValue = 0.25;
		else if (position <= 0.5) quarterValue = 0.5;
		else if (position <= 0.75) quarterValue = 0.75;
		else quarterValue = 1;

		setHoverValue(starIndex + quarterValue);
	};

	// Handle click on a star
	const handleClick = (event: React.MouseEvent) => {
		if (disabled || hoverValue === null || saveRatingMutation.isPending) return;

		// Prevent the event from triggering the radio input's default behavior
		event.preventDefault();

		onChange?.(hoverValue);
		saveRatingMutation.mutate(hoverValue);
	};

	// Handle keyboard events for accessibility
	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLLabelElement>,
		starIndex: number,
	) => {
		if (disabled || saveRatingMutation.isPending) return;

		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onChange?.(starIndex + 1);
		}
	};

	// Handle mouse leaving the star rating component
	const handleMouseLeave = () => {
		if (!isDragging) {
			setHoverValue(null);
		}
	};

	// Handle mouse down for drag functionality
	const handleMouseDown = () => {
		if (!disabled && !saveRatingMutation.isPending) {
			setIsDragging(true);
		}
	};

	// Handle mouse up to end dragging
	const handleMouseUp = (event: React.MouseEvent) => {
		if (isDragging && hoverValue !== null && !saveRatingMutation.isPending) {
			// Only call onChange if this is not a click event (which is handled separately)
			// Check if the event target is not a label element
			if (!(event.target instanceof HTMLLabelElement)) {
				onChange?.(hoverValue);
			}
			setIsDragging(false);
		}
	};

	// Render a star with the appropriate fill level
	const renderStar = (starIndex: number) => {
		const difference = displayValue - starIndex;
		let fillPercentage = 0;

		if (difference >= 1) {
			fillPercentage = 100;
		} else if (difference > 0) {
			// Convert the difference to a percentage (0-100)
			fillPercentage = Math.min(Math.round(difference * 100), 100);
		}

		return (
			<div className="relative group">
				{/* Base star (outline) */}
				<Star
					className={`${sizeClasses[size]} stroke-yellow-400 transition-all duration-200 ${
						saveRatingMutation.isPending ? "opacity-50" : ""
					}`}
					fill="transparent"
					strokeWidth={strokeWidth[size]}
				/>

				{/* Filled portion of the star */}
				<div
					className="absolute inset-0 overflow-hidden transition-all duration-200 ease-out"
					style={{ width: `${fillPercentage}%` }}
				>
					<Star
						className={`${sizeClasses[size]} stroke-yellow-400 ${
							saveRatingMutation.isPending ? "opacity-50" : ""
						}`}
						fill="rgb(250 204 21)" // text-yellow-400 equivalent
						strokeWidth={strokeWidth[size]}
					/>
				</div>

				{/* Hover indicator - shows the potential fill amount */}
				{!disabled && !saveRatingMutation.isPending && (
					<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<div className="bg-yellow-400/20 rounded-full w-1/2 h-1/2 flex items-center justify-center">
							{fillPercentage > 0 && (
								<span
									className={`text-[8px] font-bold ${fillPercentage > 25 ? "text-background" : "text-white"}`}
								>
									{Math.round(fillPercentage)}%
								</span>
							)}
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<div
			className="flex items-center gap-2"
			onMouseLeave={handleMouseLeave}
			onMouseUp={(e) => handleMouseUp(e)}
			onMouseDown={handleMouseDown}
		>
			{[0, 1, 2, 3, 4].map((starIndex) => (
				<div key={starIndex} className="relative">
					<input
						type="radio"
						id={`${name}-${starIndex + 1}`}
						name={name}
						value={starIndex + 1}
						checked={Math.floor(displayValue) === starIndex + 1}
						className="sr-only" // Visually hidden but accessible
						disabled={disabled || saveRatingMutation.isPending}
					/>
					<label
						htmlFor={`${name}-${starIndex + 1}`}
						className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${
							disabled || saveRatingMutation.isPending
								? "opacity-60 cursor-not-allowed hover:scale-100"
								: ""
						}`}
						onMouseMove={(e) => handleMouseMove(e, starIndex)}
						onClick={(e) => handleClick(e)}
						onKeyDown={(e) => handleKeyDown(e, starIndex)}
						tabIndex={disabled || saveRatingMutation.isPending ? -1 : 0}
					>
						{renderStar(starIndex)}
					</label>
				</div>
			))}

			{/* Display the numeric value or loading spinner */}
			{saveRatingMutation.isPending ? (
				<span className="ml-3 flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md">
					<Loader2 className="w-4 h-4 mr-1 animate-spin" />
					<span className="text-sm font-medium">Saving...</span>
				</span>
			) : displayValue > 0 ? (
				<span className="ml-3 text-sm font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md transition-all duration-200">
					{displayValue.toFixed(2)}
				</span>
			) : null}
		</div>
	);
}
