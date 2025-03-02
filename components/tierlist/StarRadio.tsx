import { Star } from "lucide-react";
import { useState } from "react";

interface StarRadioProps {
	value?: number;
	onChange?: (value: number) => void;
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	name?: string;
}

export default function StarRadio({
	value = 0,
	onChange,
	size = "md",
	disabled = false,
	name = "star-rating",
}: StarRadioProps) {
	const [hoverValue, setHoverValue] = useState<number | null>(null);
	const [isDragging, setIsDragging] = useState(false);

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
		if (disabled) return;

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
	const handleClick = () => {
		if (disabled || hoverValue === null) return;
		onChange?.(hoverValue);
	};

	// Handle keyboard events for accessibility
	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLLabelElement>,
		starIndex: number,
	) => {
		if (disabled) return;

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
		if (!disabled) {
			setIsDragging(true);
		}
	};

	// Handle mouse up to end dragging
	const handleMouseUp = () => {
		if (isDragging && hoverValue !== null) {
			onChange?.(hoverValue);
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
					className={`${sizeClasses[size]} stroke-yellow-400 transition-all duration-200`}
					fill="transparent"
					strokeWidth={strokeWidth[size]}
				/>

				{/* Filled portion of the star */}
				<div
					className="absolute inset-0 overflow-hidden transition-all duration-200 ease-out"
					style={{ width: `${fillPercentage}%` }}
				>
					<Star
						className={`${sizeClasses[size]} stroke-yellow-400`}
						fill="rgb(250 204 21)" // text-yellow-400 equivalent
						strokeWidth={strokeWidth[size]}
					/>
				</div>

				{/* Hover indicator - shows the potential fill amount */}
				{!disabled && (
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
			onMouseUp={handleMouseUp}
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
						onChange={() => onChange?.(starIndex + 1)}
						className="sr-only" // Visually hidden but accessible
						disabled={disabled}
					/>
					<label
						htmlFor={`${name}-${starIndex + 1}`}
						className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${
							disabled ? "opacity-60 cursor-not-allowed hover:scale-100" : ""
						}`}
						onMouseMove={(e) => handleMouseMove(e, starIndex)}
						onClick={handleClick}
						onKeyDown={(e) => handleKeyDown(e, starIndex)}
						tabIndex={disabled ? -1 : 0}
					>
						{renderStar(starIndex)}
					</label>
				</div>
			))}

			{/* Optional: Display the numeric value */}
			{displayValue > 0 && (
				<span className="ml-3 text-sm font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md transition-all duration-200">
					{displayValue.toFixed(2)}
				</span>
			)}
		</div>
	);
}
