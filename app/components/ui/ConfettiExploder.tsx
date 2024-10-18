import ReactCanvasConfetti from "react-canvas-confetti";
import Explosion from "react-canvas-confetti/dist/presets/explosion";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

export default function ConfettiExploder() {
  return (
    <Fireworks
      autorun={{ speed: 3 }}
      className="absolute top-0 left-0 z-[9999]"
    />
  );
}
