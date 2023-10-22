import { useState } from "react";

interface ButtonProps {
  mutationFn: any;
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
    >
      {isHovering ? hoverIcon : icon}
    </div>
  );
}
