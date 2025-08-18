import { createDevCookie } from "@/lib/actions/setDevCookie"
import { Input } from "../ui/Input"
import { useTransition } from "react"

interface DevToolsProps {
  noSave: boolean
  setNoSave: (noSave: boolean) => void
  resultScreen: boolean
  setResultScreen: (resultScreen: boolean) => void
}

export default function DevTools({
  noSave,
  setNoSave,
  resultScreen,
  setResultScreen,
}: DevToolsProps) {
  const [_isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-row gap-5">
      <div className="flex flex-col items-center gap-2">
        <label htmlFor="dev-mode" className="text-xs font-bold">
          No save
        </label>
        <Input
          type="checkbox"
          id="dev-mode"
          className="h-5 w-5"
          checked={noSave}
          onChange={() => {
            startTransition(() => {
              const newNoSave = !noSave
              setNoSave(newNoSave)
              createDevCookie("noSave", newNoSave.toString())
            })
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <label htmlFor="dev-mode" className="text-xs font-bold">
          Result screen
        </label>
        <Input
          type="checkbox"
          id="dev-mode"
          className="h-5 w-5"
          checked={resultScreen}
          onChange={() => {
            startTransition(() => {
              const newResultScreen = !resultScreen
              setResultScreen(newResultScreen)
              createDevCookie("resultScreen", newResultScreen.toString())
            })
          }}
        />
      </div>
    </div>
  )
}
