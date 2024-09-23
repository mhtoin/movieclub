import ReactCanvasConfetti from "react-canvas-confetti";

export default function ConfettiExploder() {
  return (
    <ReactCanvasConfetti
      onInit={(confetti) => {
        return confetti;
      }}
    />
  );
}
