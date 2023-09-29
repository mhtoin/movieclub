import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MobileNavbarButton({
  children,
  destination,
  pathname,
}: {
  children: any;
  pathname: string;
  destination: string;
}) {
    const [effect, setEffect] = useState(false);
    const router = useRouter();
  return (
    <button
      className={`${effect && "animate-button-press"} ${
        pathname === destination ? "text-secondary" : ""
      }`}
      onClick={() => {
        setEffect(true);
        router.push(destination);
      }}
      onAnimationEnd={() => {
        console.log('animation ended')
        setEffect(false)}}
    >
      {children}
    </button>
  );
}
