import { useState } from "react";

interface ButtonProps {
	mutationFn: () => void;
	icon: JSX.Element;
	hoverIcon: JSX.Element;
}

export default function MovieCardButton({
	mutationFn,
	icon,
	hoverIcon,
}: ButtonProps) {
	const [isHovering, setIsHovering] = useState(false);

	return (
		<div
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			onPointerEnter={() => setIsHovering(true)}
			onPointerLeave={() => setIsHovering(false)}
			onClick={() => {
				mutationFn();
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					mutationFn();
				}
			}}
		>
			{isHovering ? hoverIcon : icon}
		</div>
	);
}
