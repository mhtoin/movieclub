export default function HamburgerMenu({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`w-6 h-1 bg-foreground rounded origin-top-left transition-all ease-in-out duration-200 ${
          open ? "rotate-45 " : ""
        }`}
      />
      <div
        className={`w-6 h-1 bg-foreground rounded origin-center transition-transform ease-in-out duration-200 ${
          open ? "max-w-0" : ""
        }`}
      ></div>
      <div
        className={`w-6 h-1 bg-foreground rounded origin-bottom-left transition-all ease-in-out duration-200 ${
          open ? "-rotate-45 " : ""
        }`}
      ></div>
    </div>
  );
}
