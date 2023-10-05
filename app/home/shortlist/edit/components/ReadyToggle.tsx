"use client";

import { useState, useTransition } from "react";

export default function ReadyToggle({isReady, onToggle, label}: { isReady: boolean, onToggle: any, label: string }) {
  const [toggled, setToggled] = useState(isReady);
  let [isPending, startTransition] = useTransition();
  return (
    <div className="flex flex-row">
      <div className="form-control">
        <label className="cursor-pointer label">
          <span className="label-text p-5">{label}</span>
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
