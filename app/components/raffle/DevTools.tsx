import { createDevCookie } from "@/lib/actions/setDevCookie";
import { Input } from "../ui/Input";
import { useTransition } from "react";
import { cookies } from "next/headers";

interface DevToolsProps {
  noSave: boolean;
  setNoSave: (noSave: boolean) => void;
  resultScreen: boolean;
  setResultScreen: (resultScreen: boolean) => void;
}

export default function DevTools({
  noSave,
  setNoSave,
  resultScreen,
  setResultScreen,
}: DevToolsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-row gap-5">
      <div className="flex flex-col gap-2 items-center">
        <label htmlFor="dev-mode" className="text-xs font-bold">
          No save
        </label>
        <Input
          type="checkbox"
          id="dev-mode"
          className="w-5 h-5"
          checked={noSave}
          onChange={() => {
            startTransition(() => {
              const newNoSave = !noSave;
              setNoSave(newNoSave);
              createDevCookie("noSave", newNoSave.toString());
            });
          }}
        />
      </div>
      <div className="flex flex-col gap-2 items-center">
        <label htmlFor="dev-mode" className="text-xs font-bold">
          Result screen
        </label>
        <Input
          type="checkbox"
          id="dev-mode"
          className="w-5 h-5"
          checked={resultScreen}
          onChange={() => {
            startTransition(() => {
              const newResultScreen = !resultScreen;
              setResultScreen(newResultScreen);
              createDevCookie("resultScreen", newResultScreen.toString());
            });
          }}
        />
      </div>
    </div>
  );
}
