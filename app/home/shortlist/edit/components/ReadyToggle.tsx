"use client";

import { useState, useTransition } from "react";

export default function ReadyToggle({isReady, onToggle, label}: { isReady: boolean, onToggle: any, label: string }) {
  const [toggled, setToggled] = useState(isReady);
  let [isPending, startTransition] = useTransition();
  return (
    <div className="flex flex-co p-2 rounded-md">
      <div className="form-control w-40">
        <label className="cursor-pointer label">
          <span className="label-text">{label}</span>
          <input
            type="checkbox"
            className="toggle toggle-success"
            checked={toggled}
            onChange={() => {
              startTransition(() => onToggle(!toggled))
              setToggled(!toggled)}
            }
          />
        </label>
      </div>
    </div>
  );
}
