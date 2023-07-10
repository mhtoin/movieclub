"use client";

import { useState, useTransition } from "react";
import { updateShortlistReadyState } from "../actions/actions";

export default function ReadyToggle({isReady}: { isReady: boolean }) {
  const [toggled, setToggled] = useState(isReady);
  let [isPending, startTransition] = useTransition();
  return (
    <div className="flex flex-col bg-slate-800 p-2 rounded-md">
      <div className="form-control w-40">
        <label className="cursor-pointer label">
          <span className="label-text">Ready</span>
          <input
            type="checkbox"
            className="toggle toggle-success"
            checked={toggled}
            onChange={() => {
              startTransition(() => updateShortlistReadyState(!toggled))
              setToggled(!toggled)}
            }
          />
        </label>
      </div>
    </div>
  );
}
