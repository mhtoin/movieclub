import { Button } from "components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MobileNavbarButton({
	children,
	destination,
	pathname,
}: {
	children: React.ReactNode;
	pathname: string;
	destination: string;
}) {
	const [effect, setEffect] = useState(false);
	const router = useRouter();
	return (
		<Button
			variant={"ghost"}
			className={`transform active:scale-75 transition-transform ${
				effect && "animate-button-press"
			} ${pathname === destination ? "text-mobilenav" : ""}`}
			onTouchStart={() => {
				setEffect(true);
			}}
			onClick={() => {
				router.push(destination);
			}}
			onAnimationEnd={() => {
				setEffect(false);
			}}
		>
			{children}
		</Button>
	);
}
